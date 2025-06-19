uniform sampler2D tFluid;

uniform vec4 uColor;
uniform vec4 uBackgroundColor;

uniform float uDistort;
uniform float uIntensity;
uniform float uRainbow;
uniform float uBlend;
uniform float uShowBackground;
uniform float uMaskMode;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Sample the fluid texture
    vec3 fluidColor = texture2D(tFluid, uv).rgb;
    
    // Calculate distortion if needed
    vec2 distortedUv = uv - fluidColor.rg * uDistort;
    
    // Sample the input buffer at the potentially distorted UV
    vec4 texture = texture2D(inputBuffer, distortedUv);
    
    // Calculate fluid intensity based on the length of the color vector
    float intensity = length(fluidColor) * uIntensity;
    
    // If mask mode is active, use the fluid as a transparency mask
    if (uMaskMode > 0.5) {
        // Start with the background color at full opacity
        vec4 backgroundColor = vec4(uBackgroundColor.rgb, uBackgroundColor.a);
        
        // Use fluid intensity to control opacity
        // Invert the intensity so that where fluid is strong, background becomes transparent
        float maskOpacity = 1.0 - clamp(intensity * 5.0, 0.0, 1.0);
        
        // Final color has background color but opacity controlled by fluid intensity
        outputColor = vec4(backgroundColor.rgb, maskOpacity * backgroundColor.a);
        
        return;
    }
    
    // Original fluid effect code (non-mask mode)
    vec3 selectedColor = uColor.rgb * length(fluidColor);
    vec4 colorForFluidEffect = vec4(uRainbow == 1.0 ? fluidColor : selectedColor.rgb, uColor.a);
    vec4 computedBgColor = vec4(uBackgroundColor.rgb, uBackgroundColor.a);

    if (uShowBackground == 0.0) {
        outputColor = mix(texture, colorForFluidEffect, intensity);
        return;
    }

    vec4 computedFluidColor = mix(texture, colorForFluidEffect, uBlend);

    vec4 finalColor;

    if (texture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, intensity);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - texture.a);
    }

    outputColor = finalColor;
}