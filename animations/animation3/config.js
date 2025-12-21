// Animation 3 Configuration
// Gradient Text Animation - "NEVER STOP DREAM" style

const ANIMATION_CONFIG = {
    name: 'animation3',
    css: 'animations/animation3/css/animation.css',
    scripts: [
        'animations/animation3/js/script.js',
        'animations/animation3/js/cursor-effect.js'
    ]
};

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.ANIMATION_CONFIG = ANIMATION_CONFIG;
}

