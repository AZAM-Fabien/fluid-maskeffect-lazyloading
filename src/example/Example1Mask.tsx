import { EffectComposer } from '@react-three/postprocessing';
import { FluidMask } from '../../lib/FluidMask';
import { ThreeTunnel } from './tunel';
import React from 'react';

const BackgroundContent = () => {
    return (
        <div
            className='background-content'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '50px',
                color: '#333',
                zIndex: -1,
                overflow: 'auto',
            }}>
            <h1 style={{ fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' }}>
                Fluid Mask Effect
            </h1>

            <h2 style={{ fontSize: '28px', marginBottom: '15px', fontWeight: 'normal' }}>
                Fluid Acts as a Transparency Mask
            </h2>

            <p style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '800px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
                rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non
                est bibendum non venenatis nisl tempor.
            </p>

            <p
                style={{
                    fontSize: '18px',
                    lineHeight: '1.6',
                    maxWidth: '1200px',
                    marginTop: '20px',
                }}>
                Suspendisse potenti. Sed egestas, ante et vulputate volutpat, eros pede semper est,
                vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo
                quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper
                lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod
                dui, eu pulvinar nunc sapien ornare nisl.
            </p>
        </div>
    );
};

import { useState } from 'react';

const Example1Mask = () => {
    const [isFluidMaskReady, setIsFluidMaskReady] = useState(false);
    const click = () => {
        console.log('click');
    };
    return (
        <>
            {/* Black overlay while FluidMask is loading */}
            {!isFluidMaskReady && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'black',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '2rem',
                }}>
                    Loading...
                </div>
            )}
            <BackgroundContent />
            <button onClick={click} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Click me</button>
            <ThreeTunnel.In>
                <EffectComposer>
                    <FluidMask onReady={() => setIsFluidMaskReady(true)} loadingDelay={1000} pointerEventsEnabled={false}/>
                </EffectComposer>
            </ThreeTunnel.In>
        </>
    );
};

export default Example1Mask;
