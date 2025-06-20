import { useControls, button } from 'leva';
import { OPTSMASK } from '../constantMask';

export const useConfig = () => {
    const handleReset = () => {
        return set(
            Object.fromEntries(
                Object.keys(params).map((key) => {
                    return [key, OPTSMASK[key as keyof typeof OPTSMASK]];
                }),
            ),
        );
    };

    const [params, set] = useControls('Settings', () => ({
        intensity: {
            value: OPTSMASK.intensity,
            min: 0.0,
            max: 100,
            step: 0.01,
            label: 'intensity',
        },

        force: {
            value: OPTSMASK.force,
            min: 0,
            max: 20,
            step: 0.1,
            label: 'force',
        },

        distortion: {
            value: OPTSMASK.distortion,
            min: 0,
            max: 2,
            step: 0.01,
            label: 'distortion',
        },

        curl: {
            value: OPTSMASK.curl,
            min: 0,
            max: 50,
            step: 0.1,
            label: 'curl',
        },

        swirl: {
            value: OPTSMASK.swirl,
            min: 0,
            max: 20,
            step: 1,
            label: 'swirl',
        },

        fluidColor: {
            value: OPTSMASK.fluidColor,
            label: 'fluid color',
        },

        backgroundColor: {
            value: OPTSMASK.backgroundColor,
            label: 'background color',
        },

        blend: {
            value: OPTSMASK.blend,
            min: 0.0,
            max: 10,
            step: 0.01,
            label: 'blend',
        },

        showBackground: {
            value: OPTSMASK.showBackground,
            label: 'show background',
        },

        rainbow: {
            value: OPTSMASK.rainbow,
            label: 'rainbow mode',
        },

        pressure: {
            value: OPTSMASK.pressure,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'pressure reduction',
        },

        densityDissipation: {
            value: OPTSMASK.densityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'density dissipation',
        },

        velocityDissipation: {
            value: OPTSMASK.velocityDissipation,
            min: 0,
            max: 1,
            step: 0.01,
            label: 'velocity dissipation',
        },

        radius: {
            value: OPTSMASK.radius,
            min: 0.01,
            max: 1,
            step: 0.01,
            label: 'radius',
        },
        'reset settings': button(handleReset),
    }));

    return params;
};
