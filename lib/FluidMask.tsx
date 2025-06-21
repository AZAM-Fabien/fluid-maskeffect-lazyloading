import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import { Camera, Color, Mesh, Scene, Texture, Vector2, Vector3 } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Effect as FluidMaskEffect } from './effect/FluidMasks';
import { useFBOs } from './hooks/useFBOs';
import { useMaterials } from './hooks/useMaterials';
import { Props } from './types';
import { OPTSMASK } from './constantMask';
import { usePointer } from './hooks/usePointer';
import { BlendFunction } from 'postprocessing';
import { normalizeScreenHz } from './utils';

type Uniforms = {
    uColor: Vector3 | Color;
    uPointer: Vector2;
    uTarget: Texture | null;
    uVelocity: Texture;
    uCurl: Texture;
    uTexture: Texture;
    uPressure: Texture;
    uDivergence: Texture;
    uSource: Texture;
    uRadius: number;
    uClearValue: number;
    uCurlValue: number;
    uDissipation: number;
};

import { useEffect, useState } from 'react';

export const FluidMask = ({
    blend = OPTSMASK.blend,
    force = OPTSMASK.force,
    radius = OPTSMASK.radius,
    curl = OPTSMASK.curl,
    swirl = OPTSMASK.swirl,
    intensity = OPTSMASK.intensity,
    distortion = OPTSMASK.distortion,
    fluidColor = OPTSMASK.fluidColor,
    backgroundColor = OPTSMASK.backgroundColor,
    showBackground = OPTSMASK.showBackground,
    rainbow = OPTSMASK.rainbow,
    pressure = OPTSMASK.pressure,
    densityDissipation = OPTSMASK.densityDissipation,
    velocityDissipation = OPTSMASK.velocityDissipation,
    blendFunction = BlendFunction.NORMAL,
    maskMode = true,
    onReady,
    loadingDelay = 0,
}: Props & { maskMode?: boolean; onReady?: () => void; loadingDelay?: number }) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const bufferScene = useMemo(() => new Scene(), []);
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef<Mesh>(null);
    const postRef = useRef<ShaderPass>(null);

    const FBOs = useFBOs();
    const materials = useMaterials();
    const { onPointerMove, splatStack } = usePointer({ force });

    // new state to track initialization
    const [isInitialized, setIsInitialized] = useState(false);
    // To ensure that onReady is called only once
    const [readyCalled, setReadyCalled] = useState(false);

    // Effect to detect if everything is ready
    useEffect(() => {
        // Consider everything ready if FBOs, materials, refs are defined
        const allReady =
            meshRef.current &&
            postRef.current &&
            FBOs &&
            materials &&
            Object.keys(FBOs).length > 0 &&
            Object.keys(materials).length > 0;
        if (allReady && !isInitialized) {
            setIsInitialized(true);
        }
    }, [FBOs, materials, meshRef.current, postRef.current, isInitialized]);

    // Effect to call onReady after the minimum delay
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        if (isInitialized && !readyCalled) {
            timeoutId = setTimeout(() => {
                if (onReady) onReady();
                setReadyCalled(true);
            }, loadingDelay);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isInitialized, loadingDelay, onReady, readyCalled]);

    const setShaderMaterial = useCallback(
        (name: keyof ReturnType<typeof useMaterials>) => {
            if (!meshRef.current) return;

            meshRef.current.material = materials[name];
            meshRef.current.material.needsUpdate = true;
        },
        [materials],
    );

    const setRenderTarget = useCallback(
        (name: keyof ReturnType<typeof useFBOs>) => {
            const target = FBOs[name];

            if ('write' in target) {
                gl.setRenderTarget(target.write);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
                target.swap();
            } else {
                gl.setRenderTarget(target);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
            }
        },
        [bufferCamera, bufferScene, FBOs, gl],
    );

    const setUniforms = useCallback(
        <K extends keyof Uniforms>(
            material: keyof ReturnType<typeof useMaterials>,
            uniform: K,
            value: Uniforms[K],
        ) => {
            const mat = materials[material];

            if (mat && mat.uniforms[uniform]) {
                mat.uniforms[uniform].value = value;
            }
        },
        [materials],
    );

    useFrame((_, delta) => {
        if (!meshRef.current || !postRef.current) return;

        for (let i = splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
            setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
            setUniforms('splat', 'uRadius', radius / 100.0);
            setRenderTarget('velocity');
            setUniforms('splat', 'uTarget', FBOs.density.read.texture);
            setRenderTarget('density');

            splatStack.pop();
        }

        setShaderMaterial('curl');
        setUniforms('curl', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('curl');

        setShaderMaterial('vorticity');
        setUniforms('vorticity', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('vorticity', 'uCurl', FBOs.curl.texture);
        setUniforms('vorticity', 'uCurlValue', curl);
        setRenderTarget('velocity');

        setShaderMaterial('divergence');
        setUniforms('divergence', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('divergence');

        setShaderMaterial('clear');
        setUniforms('clear', 'uTexture', FBOs.pressure.read.texture);
        setUniforms('clear', 'uClearValue', normalizeScreenHz(pressure, delta));
        setRenderTarget('pressure');

        setShaderMaterial('pressure');
        setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);

        for (let i = 0; i < swirl; i++) {
            setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
            setRenderTarget('pressure');
        }

        setShaderMaterial('gradientSubstract');
        setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
        setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('velocity');

        setShaderMaterial('advection');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(velocityDissipation, delta));

        setRenderTarget('velocity');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(densityDissipation, delta));

        setRenderTarget('density');
    });

    return (
        <>
            {createPortal(
                <mesh
                    ref={meshRef}
                    onPointerMove={onPointerMove}
                    scale={[size.width, size.height, 1]}>
                    <planeGeometry args={[2, 2, 10, 10]} />
                </mesh>,
                bufferScene,
            )}

            <FluidMaskEffect
                blendFunction={blendFunction}
                intensity={intensity}
                rainbow={rainbow}
                distortion={distortion}
                backgroundColor={backgroundColor}
                blend={blend}
                fluidColor={fluidColor}
                showBackground={showBackground}
                maskMode={maskMode}
                ref={postRef}
                tFluid={FBOs.density.read.texture}
            />
        </>
    );
};
