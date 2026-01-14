// Animation 1 Configuration
// Change this file to switch between animations

const ANIMATION_CONFIG = {
    name: 'animation1',
    css: 'animations/animation1/css/animation.css',
    scripts: [
        'animations/animation1/js/script.js',
        'animations/animation1/js/easter-eggs.js',
        'animations/animation1/js/code-animation.js',
        'animations/animation1/js/cv-tab.js',
        'animations/animation1/js/cursor-effect.js',
        'animations/animation1/js/terminal-windows.js'
    ]
};

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.ANIMATION_CONFIG = ANIMATION_CONFIG;
}

