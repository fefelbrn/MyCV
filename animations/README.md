# Animation System

This folder contains all the site animations. Each animation is isolated in its own folder.

## Structure

```
animations/
├── animation1/          # Current animation (Terminal & Code Style)
│   ├── css/
│   │   └── animation.css    # Animation CSS styles
│   ├── js/
│   │   ├── script.js         # Main script (frame borders)
│   │   ├── cv-tab.js         # CV tab management
│   │   ├── code-animation.js # Spy-style code animation
│   │   └── easter-eggs.js    # Easter eggs
│   └── config.js             # Animation configuration
├── animation2/          # 3D Text in Glass Torus
│   ├── css/
│   ├── js/
│   └── config.js
└── animation3/          # Gradient Text Animation
    ├── css/
    ├── js/
    └── config.js
```

## Changing Animation

To change animation, simply modify the path in `index.html`:

```html
<!-- Line 13 in index.html -->
<script src="animations/animation1/config.js"></script>
```

Change `animation1` to `animation2` (or your animation name).

## Creating a New Animation

1. Create a new folder: `animations/animation2/`
2. Create subfolders: `css/` and `js/`
3. Create `config.js` with the structure:
   ```javascript
   const ANIMATION_CONFIG = {
       name: 'animation2',
       css: 'animations/animation2/css/animation.css',
       scripts: [
           'animations/animation2/js/script1.js',
           'animations/animation2/js/script2.js'
       ]
   };
   ```
4. Add your CSS and JS files in the respective folders
5. Modify `index.html` to point to your new animation

## Animation 1 - Terminal & Code Style

The current animation includes:
- **Home screen**: "work" text in center with code animations
- **CV tab**: Drag up to open the CV
- **Loading screen**: Terminal-style with progress bar
- **Code animations**: Spy-style code in top-right and bottom-left
- **3D circles**: Rotating circle animations
- **Easter eggs**: Circle in top-left and bug in terminal

## Animation 2 - 3D Text in Glass Torus

Features:
- **3D metallic text**: "Work Experience" rendered in 3D with chrome effect
- **Glass torus**: Transparent glass ring surrounding the text
- **Bubble background**: Animated gradient background with moving bubbles
- **Interactive cursor**: Custom cursor with scroll indicator

## Animation 3 - Gradient Text Animation

Features:
- **Gradient text**: "FELIZ LUBERNE" with vibrant gradient colors
- **Dynamic movement**: Letters float and move with collision detection
- **Interactive cursor**: Custom cursor with collision physics
- **Color blending**: Semi-transparent letters create color blends when overlapping
