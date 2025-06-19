import { Effect } from 'postprocessing';
import { Texture, Uniform, Vector4 } from 'three';
import { EffectProps } from '../types';
import { parseColor } from '../utils';
import maskShader from '../glsl/fluidMask.frag';

type Uniforms = {
    tFluid: Texture | null;
    uColor: Vector4;
    uBackgroundColor: Vector4;
    uRainbow: boolean;
    uShowBackground: boolean;
    uMaskMode: boolean;
    uDistort: number;
    uBlend: number;
    uIntensity: number;
};

export type ExtendedEffectProps = EffectProps & {
    maskMode?: boolean;
};

export class FluidEffect extends Effect {
    state: Partial<ExtendedEffectProps>;

    constructor(props: ExtendedEffectProps = {}) {
        const uniforms: Record<keyof Uniforms, Uniform> = {
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),
            uMaskMode: new Uniform(props.maskMode || false),
            uColor: new Uniform(parseColor(props.fluidColor!)),
            uBackgroundColor: new Uniform(parseColor(props.backgroundColor!)),
        };

        super('FluidMaskEffect', maskShader, {
            blendFunction: props.blendFunction,
            uniforms: new Map(Object.entries(uniforms)),
        });

        this.state = {
            ...props,
        };
    }

    private updateUniform<K extends keyof Uniforms>(key: K, value: Uniforms[K]) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform('uIntensity', this.state.intensity!);
        this.updateUniform('uDistort', this.state.distortion!);
        this.updateUniform('uRainbow', this.state.rainbow!);
        this.updateUniform('uBlend', this.state.blend!);
        this.updateUniform('uShowBackground', this.state.showBackground!);
        this.updateUniform('uMaskMode', this.state.maskMode || false);
        this.updateUniform('uColor', parseColor(this.state.fluidColor!));
        this.updateUniform('uBackgroundColor', parseColor(this.state.backgroundColor!));
    }
}
