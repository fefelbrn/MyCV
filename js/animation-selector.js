// Animation Selector - Allows switching between different animations
(function() {
    'use strict';
    
    // Available animations with previews
    const ANIMATIONS = [
        {
            id: 'animation1',
            name: 'Terminal',
            description: 'Code style with terminal loading',
            preview: 'terminal', // Preview type for CSS styling
            config: 'animations/animation1/config.js',
            color: '#27c93f' // Terminal green
        },
        {
            id: 'animation2',
            name: '3D Text',
            description: 'Interactive 3D text animation',
            preview: '3d-text',
            config: 'animations/animation2/config.js',
            color: '#6366f1'
        },
        {
            id: 'animation3',
            name: 'Interactive',
            description: 'Cursor interaction with particles',
            preview: 'interactive',
            config: 'animations/animation3/config.js',
            color: '#ec4899'
        }
    ];
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Function to generate preview content based on type
    function getPreviewContent(previewType) {
        switch(previewType) {
            case 'terminal':
                return `
                    <div class="preview-terminal-wrapper">
                        <div class="preview-center-text">work</div>
                        <div class="preview-code-top-right">
                            <div class="preview-code-line-small">const buffer = readBuffer();</div>
                            <div class="preview-code-line-small">await send(data);</div>
                        </div>
                        <div class="preview-code-bottom-left">
                            <div class="preview-code-line-small">function decrypt(key) {</div>
                            <div class="preview-code-line-small">  return result;</div>
                        </div>
                        <div class="preview-rings">
                            <div class="preview-ring"></div>
                        </div>
                    </div>
                `;
            case '3d-text':
                return `
                    <div class="preview-3d">
                        <div class="preview-3d-torus">
                            <div class="preview-3d-torus-ring"></div>
                            <div class="preview-3d-torus-ring-inner"></div>
                        </div>
                        <div class="preview-3d-text-inside">WORK</div>
                    </div>
                `;
            case 'interactive':
                return `
                    <div class="preview-interactive">
                        <div class="preview-interactive-text">
                            <span class="preview-letter" style="color: #ff00ff;">F</span>
                            <span class="preview-letter" style="color: #ffff00;">E</span>
                            <span class="preview-letter" style="color: #00ffff;">L</span>
                            <span class="preview-letter" style="color: #ff6600;">I</span>
                            <span class="preview-letter" style="color: #ff00aa;">Z</span>
                        </div>
                        <div class="preview-cursor-interactive"></div>
                        <div class="preview-particle-interactive"></div>
                        <div class="preview-particle-interactive"></div>
                    </div>
                `;
            default:
                return '<div class="preview-default">Preview</div>';
        }
    }
    
    function init() {
        // Create animation selector UI with previews
        const selector = document.createElement('div');
        selector.className = 'animation-selector';
        selector.innerHTML = `
            <div class="animation-selector-tab">
                <span class="animation-selector-icon">Animations</span>
            </div>
            <div class="animation-selector-menu">
                <div class="animation-selector-title">Choose Animation</div>
                <div class="animation-selector-grid">
                    ${ANIMATIONS.map(anim => `
                        <button class="animation-selector-card" data-animation="${anim.id}">
                            <div class="animation-selector-preview" data-preview="${anim.preview}" style="--preview-color: ${anim.color}">
                                <div class="animation-selector-preview-content">
                                    ${getPreviewContent(anim.preview)}
                                </div>
                            </div>
                            <div class="animation-selector-card-info">
                                <div class="animation-selector-card-header">
                                    <span class="animation-selector-card-name">${anim.name}</span>
                                    <span class="animation-selector-card-check">✓</span>
                                </div>
                                <p class="animation-selector-card-description">${anim.description}</p>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(selector);
        
        // Get current animation - check multiple sources with delay to ensure config is loaded
        function detectCurrentAnimation() {
            let currentAnimation = 'animation1';
            
            // First check window.ANIMATION_CONFIG (most reliable)
            if (window.ANIMATION_CONFIG?.name) {
                currentAnimation = window.ANIMATION_CONFIG.name;
            }
            // Then check which config script is loaded in the HTML
            else {
                const configScripts = document.querySelectorAll('script[src*="animation"][src*="config.js"]');
                configScripts.forEach(script => {
                    const src = script.getAttribute('src');
                    if (src.includes('animation2')) currentAnimation = 'animation2';
                    else if (src.includes('animation3')) currentAnimation = 'animation3';
                    else if (src.includes('animation1')) currentAnimation = 'animation1';
                });
            }
            
            // Also check localStorage as fallback
            const savedAnimation = localStorage.getItem('selectedAnimation');
            if (savedAnimation && !window.ANIMATION_CONFIG) {
                currentAnimation = `animation${savedAnimation}`;
            }
            
            return currentAnimation;
        }
        
        // Wait a bit for config to load, then detect
        let currentAnimation = detectCurrentAnimation();
        
        // Try again after a short delay in case config loads asynchronously
        setTimeout(() => {
            currentAnimation = detectCurrentAnimation();
            const currentItem = selector.querySelector(`[data-animation="${currentAnimation}"]`);
            if (currentItem) {
                // Update active state
                selector.querySelectorAll('.animation-selector-card').forEach(card => {
                    card.classList.remove('active');
                });
                currentItem.classList.add('active');
            }
        }, 100);
        
        // Mark current animation as active immediately
        const currentItem = selector.querySelector(`[data-animation="${currentAnimation}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
        }
        
        // Toggle menu on tab click
        const tab = selector.querySelector('.animation-selector-tab');
        const menu = selector.querySelector('.animation-selector-menu');
        
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('open');
            }
        });
        
        // Handle animation selection
        const cards = selector.querySelectorAll('.animation-selector-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const animationId = card.getAttribute('data-animation');
                
                // Get current animation again to check
                const currentAnim = detectCurrentAnimation();
                if (animationId === currentAnim) {
                    return; // Already selected
                }
                
                // Update active state
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                // Switch animation
                switchAnimation(animationId);
                
                // Close menu
                selector.classList.remove('open');
            });
        });
    }
    
    function switchAnimation(animationId) {
        // Find animation config
        const animation = ANIMATIONS.find(a => a.id === animationId);
        if (!animation) return;
        
        // Save to localStorage
        const animationNumber = animationId.replace('animation', '');
        localStorage.setItem('selectedAnimation', animationNumber);
        
        // For file:// protocol, just reload the page with the new animation
        // The HTML files will read from localStorage
        window.location.reload();
    }
})();

