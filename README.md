# Fluid Distortion for React Three Fiber

![screen capture](./src/assets/screen_capture.png)

Modification of @whatisjery/react-fluid-distortion to add a mask mode.

Implementing post-processing fluid distortion effects in response to cursor interactions for React-Three-Fiber.
Based on the shaders developed by [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)

---

From the [react-three-fiber](https://github.com/pmndrs/react-three-fiber) documentation :

> [!WARNING]  
> Three-fiber is a React renderer, it must pair with a major version of React, just like react-dom, react-native, etc. @react-three/fiber@8 pairs with react@18, @react-three/fiber@9 pairs with react@19.

---

## Installation :

```bash
npm install @azam-fabien/fluid-dirstion-maskeffect @react-three/drei @react-three/postprocessing postprocessing leva
```

## Example of use :

```jsx
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { EffectComposer } from '@react-three/postprocessing';
import { Canvas } from '@react-three/fiber';

<Canvas
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        background: '#000000',
    }}>
    <EffectComposer>
        <Fluid />
        {... other effets}
    </EffectComposer>
</Canvas>;
```

## Display configuration panel :

Show a debug panel to test options more easily.

```jsx
const config = useConfig();

...

<Fluid {...config} />
```

## Options :

| Name                   | Type        | Default Value | Description                                                                                    |
| ---------------------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `fluidColor`           | hexadecimal | `#005eff`     | Sets the fluid color. Effective only when `rainbow` is set to `false`.                         |
| `backgroundColor`      | string      | `#070410`     | Sets the background color. Effective only when `showBackground` is `true`.                     |
| `showBackground`       | boolean     | `false`       | Toggles the background color's visibility. If `false` it becomes transprent.                   |
| `blend`                | number      | `5`           | Blends fluid into the scene when `showBackground` is true. Valid range: `0.00` to `10.0`.      |
| `intensity`            | number      | `10`          | Sets the fluid intensity. Valid range: `0` to `10`.                                            |
| `force`                | number      | `2`           | Multiplies the mouse velocity to increase fluid splatter. Valid range: `0.0` to `20`.          |
| `distortion`           | number      | `2`           | Sets the distortion amount. Valid range: `0.00` to `2.00`.                                     |
| `radius`               | number      | `0.3`         | Sets the fluid radius. Valid range: `0.01` to `1.00`.                                          |
| `curl`                 | number      | `10`          | Sets the amount of the curl effect. Valid range: `0.0` to `50`.                                |
| `swirl`                | number      | `20`          | Sets the amount of the swirling effect. Valid range: `0` to `20`.                              |
| `velocityDissipation`  | number      | `0.99`        | Reduces the fluid velocity over time. Valid range: `0.00` to `1.00`.                           |
| `densitionDissipation` | number      | `0.95`        | Reduces the fluid density over time. Valid range: `0.00` to `1.00`.                            |
| `pressure`             | number      | `0.80`        | Controls the reduction of pressure. Valid range: `0.00` to `1.00`.                             |
| `rainbow`              | boolean     | `true`        | Activates color mode based on mouse direction. No range applicable as this is a boolean value. |

## Using FluidMask for Transparent Fluid Effects

The `FluidMask` component creates a special effect where the fluid acts as a transparent "hole" in the background, revealing content underneath. This is particularly useful when you want to have a semi-transparent overlay with fluid-shaped cutouts.

```jsx
import { FluidMask } from '@whatisjery/react-fluid-distortion/lib/FluidMask';
import { EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// First, create your background HTML content
<div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1
}}>
    <h1>Content visible through the fluid</h1>
</div>

// Then use FluidMask in your Three.js setup
<Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
    <EffectComposer>
        <FluidMask/>
    </EffectComposer>
</Canvas>
```

### Additional maskMode Option

| Name              | Type    | Default Value         | Description                                             |
| ----------------- | ------- | --------------------- | ------------------------------------------------------- |
| `maskMode`        | boolean | `true`                | Makes fluid act as a transparency mask when set to true |
| `backgroundColor` | string  | `rgba(0, 0, 0, 0.86)` | only accept rgba color for opacity settings             |

## Usage with nextjs

If you're working with an older version of Next.js, you may get this type of error:

```javascript
TypeError: Cannot read properties of undefined (reading '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED')
```

To fix it, you can enable package transpilation in your next.config file. Here’s how:

```javascript
const nextConfig = {
    transpilePackages: ['@whatisjery/react-fluid-distortion'],
};

module.exports = nextConfig;
```
