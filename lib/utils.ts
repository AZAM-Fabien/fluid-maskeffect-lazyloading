import { Color, Vector3, Vector4 } from 'three';
import { OPTS } from './constant';

export const hexToRgb = (hex: string) => {
    const color = new Color(hex);

    return new Vector3(color.r, color.g, color.b);
};

export const normalizeScreenHz = (value: number, dt: number) => {
    return Math.pow(value, dt * OPTS.refreshRate);
};

export const parseColor = (colorString: string) => {
    // Regex pour détecter le format rgba
    const rgbaRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/;
    const match = colorString.match(rgbaRegex);

    if (match) {
        // Format RGBA
        const r = parseInt(match[1], 10) / 255;
        const g = parseInt(match[2], 10) / 255;
        const b = parseInt(match[3], 10) / 255;
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;

        return new Vector4(r, g, b, a);
    } else {
        // Format hexadécimal
        const color = new Color(colorString);
        return new Vector4(color.r, color.g, color.b, 1.0);
    }
};
