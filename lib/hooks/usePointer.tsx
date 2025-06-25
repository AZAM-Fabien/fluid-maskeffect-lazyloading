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

    // Fonction commune pour traiter le mouvement du pointeur
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

    // Pour les événements directs sur le mesh
    const onPointerMove = useCallback(
        (event: any) => {
            handlePointerMove(event.x, event.y);
        },
        [handlePointerMove]
    );

    // Pour les événements globaux (quand le canvas est transparent aux clics)
    const handleGlobalPointerMove = useCallback(
        (event: PointerEvent) => {
            handlePointerMove(event.clientX, event.clientY);
        },
        [handlePointerMove]
    );

    // Si enablePointerEvents est false, on utilise des événements globaux
    useEffect(() => {
        if (!enablePointerEvents) {
            window.addEventListener('pointermove', handleGlobalPointerMove);
            
            return () => {
                window.removeEventListener('pointermove', handleGlobalPointerMove);
            };
        }
    }, [handleGlobalPointerMove, enablePointerEvents]);

    return { onPointerMove, splatStack };
};
