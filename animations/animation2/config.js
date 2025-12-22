// Animation 2 Configuration
// Change this file to switch between animations

const ANIMATION_CONFIG = {
    name: 'animation2',
    css: 'animations/animation2/css/animation.css',
    scripts: [
        'animations/animation2/js/bubble-background.js',
        'animations/animation2/js/script.js',
        'animations/animation2/js/cursor-effect.js',
        'animations/animation2/js/cv-tab.js'
    ]
};

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.ANIMATION_CONFIG = ANIMATION_CONFIG;
}

