import * as THREE from 'three';

import { useFBO } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useDoubleFBO } from '../hooks/useDoubleFBO';
import { OPTSMASK } from '../constantMask';

export const useFBOs = () => {
    const density = useDoubleFBO(OPTSMASK.dyeRes, OPTSMASK.dyeRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const velocity = useDoubleFBO(OPTSMASK.simRes, OPTSMASK.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const pressure = useDoubleFBO(OPTSMASK.simRes, OPTSMASK.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const divergence = useFBO(OPTSMASK.simRes, OPTSMASK.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const curl = useFBO(OPTSMASK.simRes, OPTSMASK.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const FBOs = useMemo(() => {
        return {
            density,
            velocity,
            pressure,
            divergence,
            curl,
        };
    }, [curl, density, divergence, pressure, velocity]);

    useEffect(() => {
        for (const FBO of Object.values(FBOs)) {
            if ('write' in FBO) {
                FBO.setGenerateMipmaps(false);
            } else {
                FBO.texture.generateMipmaps = false;
            }
        }

        return () => {
            for (const FBO of Object.values(FBOs)) {
                FBO.dispose();
            }
        };
    }, [FBOs]);

    return FBOs;
};
