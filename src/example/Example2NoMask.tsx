import { EffectComposer } from '@react-three/postprocessing';
import { FluidMask } from '../../lib/FluidMask';
import { ThreeTunnel } from './tunel';
import { useState } from 'react';
import img from '../assets/img.jpg';
import Text from './Text';
import { useTexture } from '@react-three/drei';
import React from 'react';
import { useConfig } from '../../lib/hooks/useConfig';


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

const Image = () => {
    const texture = useTexture(img);

    return (
        <mesh position-z={-4}>
            <planeGeometry args={[7, 10, 20, 20]} attach='geometry' />
            <meshBasicMaterial map={texture} color='#c4b4d2' />
        </mesh>
    );
};

const Example5 = () => {
    const config = useConfig();

    return (
        <>
            
            <BackgroundContent />
            <ThreeTunnel.In>
                <Image />
                <Text />
                <EffectComposer>
                    <FluidMask {...config} maskMode={false} fluidColor='white' radius={0.1} distortion={2} blend={5} backgroundColor='black'/>
                </EffectComposer>
            </ThreeTunnel.In>
        </>
    );
};

export default Example5;
