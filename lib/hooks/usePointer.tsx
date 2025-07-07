import { useThree } from '@react-three/fiber';
import { useCallback, useRef, useEffect } from 'react';
import { Vector2 } from 'three';

type SplatStack = {
    mouseX: number;
    mouseY: number;
    velocityX: number;
    velocityY: number;
};

export const usePointer = ({ force, enablePointerEvents = true }: { force: number; enablePointerEvents?: boolean }) => {
    const size = useThree((three) => three.size);

    const splatStack: SplatStack[] = useRef([]).current;

    const lastMouse = useRef<Vector2>(new Vector2());
    const hasMoved = useRef<boolean>(false);
    const isTouching = useRef<boolean>(false);

    const handlePointerMove = useCallback(
        (x: number, y: number) => {
            const deltaX = x - lastMouse.current.x;
            const deltaY = y - lastMouse.current.y;

            if (!hasMoved.current) {
                hasMoved.current = true;
                lastMouse.current.set(x, y);
                return;
            }

            lastMouse.current.set(x, y);

            splatStack.push({
                mouseX: x / size.width,
                mouseY: 1.0 - y / size.height,
                velocityX: deltaX * force,
                velocityY: -deltaY * force,
            });
        },
        [force, size.height, size.width, splatStack]
    );

    const onPointerMove = useCallback(
        (event: any) => {
            handlePointerMove(event.x, event.y);
        },
        [handlePointerMove]
    );

    const onTouchStart = useCallback(
        (event: TouchEvent) => {
            if (event.cancelable) event.preventDefault();
            if (event.touches.length > 0) {
                isTouching.current = true;
                const touch = event.touches[0];
                // Normalisation des coordonnées tactiles
                handlePointerMove(touch.clientX, touch.clientY);
            }
        },
        [handlePointerMove]
    );

    const onTouchMove = useCallback(
        (event: TouchEvent) => {
            if (event.cancelable) event.preventDefault();
            if (event.touches.length > 0 && isTouching.current) {
                const touch = event.touches[0];
                // Normalisation des coordonnées tactiles
                handlePointerMove(touch.clientX, touch.clientY);
            }
        },
        [handlePointerMove]
    );

    const onTouchEnd = useCallback(() => {
        isTouching.current = false;
        hasMoved.current = false;
    }, []);

    const handleGlobalPointerMove = useCallback(
        (event: PointerEvent) => {
            handlePointerMove(event.clientX, event.clientY);
        },
        [handlePointerMove]
    );

    useEffect(() => {
        if (!enablePointerEvents) {
            window.addEventListener('pointermove', handleGlobalPointerMove);
            window.addEventListener('touchstart', onTouchStart as any);
            window.addEventListener('touchmove', onTouchMove as any);
            window.addEventListener('touchend', onTouchEnd);
            
            return () => {
                window.removeEventListener('pointermove', handleGlobalPointerMove);
                window.removeEventListener('touchstart', onTouchStart as any);
                window.removeEventListener('touchmove', onTouchMove as any);
                window.removeEventListener('touchend', onTouchEnd);
            };
        }
    }, [handleGlobalPointerMove, onTouchStart, onTouchMove, onTouchEnd, enablePointerEvents]);


    const onPointerDown = useCallback(
        (event: any) => {
            if (event.pointerType === 'touch') {
                if (event.cancelable) event.preventDefault();
                isTouching.current = true;
            }
            handlePointerMove(event.x, event.y);
        },
        [handlePointerMove]
    );

    const onPointerUp = useCallback(
        (event: any) => {
            if (event.pointerType === 'touch') {
                isTouching.current = false;
                hasMoved.current = false;
            }
        },
        []
    );

    return { 
        onPointerDown, 
        onPointerMove, 
        onPointerUp,
        splatStack 
    };
};
