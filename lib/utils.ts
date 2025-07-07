import { Color, Vector3, Vector4 } from 'three';
import { OPTSMASK } from './constantMask';

export const hexToRgb = (hex: string) => {
    const color = new Color(hex);

    return new Vector3(color.r, color.g, color.b);
};

export const normalizeScreenHz = (value: number, dt: number) => {
    return Math.pow(value, dt * OPTSMASK.refreshRate);
};

export const parseColor = (colorString: string) => {
    const rgbaRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/;
    const match = colorString.match(rgbaRegex);

    if (match) {
        const r = parseInt(match[1], 10) / 255;
        const g = parseInt(match[2], 10) / 255;
        const b = parseInt(match[3], 10) / 255;
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;

        return new Vector4(r, g, b, a);
    } else {
        const color = new Color(colorString);
        return new Vector4(color.r, color.g, color.b, 1.0);
    }
};
