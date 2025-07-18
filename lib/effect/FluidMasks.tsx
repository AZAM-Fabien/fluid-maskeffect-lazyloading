import { forwardRef, useEffect, useMemo } from 'react';
import { ExtendedEffectProps, FluidEffect } from './FluidMaskEffect';

export const Effect = forwardRef(function Fluid(props: ExtendedEffectProps, ref) {
    const effect = useMemo(() => new FluidEffect(props), []);

    useEffect(() => {
        effect.state = { ...props };
        effect.update();
    }, [effect, props]);

    useEffect(() => {
        return () => {
            effect.dispose?.();
        };
    }, [effect]);

    return <primitive ref={ref} object={effect} dispose={null} />;
});
