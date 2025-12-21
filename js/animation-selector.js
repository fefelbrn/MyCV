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
                    <div class="preview-terminal">
                        <div class="preview-terminal-header">
                            <div class="preview-terminal-dot preview-terminal-dot-red"></div>
                            <div class="preview-terminal-dot preview-terminal-dot-yellow"></div>
                            <div class="preview-terminal-dot preview-terminal-dot-green"></div>
                        </div>
                        <div class="preview-terminal-body">
                            <div class="preview-terminal-line">
                                <span class="preview-terminal-prompt">$</span>
                                <span class="preview-terminal-text">work</span>
                            </div>
                            <div class="preview-terminal-code">
                                <span class="preview-code-line">const buffer = readBuffer();</span>
                                <span class="preview-code-line">await send(data);</span>
                            </div>
                        </div>
                    </div>
                `;
            case '3d-text':
                return `
                    <div class="preview-3d">
                        <div class="preview-3d-text">3D</div>
                        <div class="preview-3d-ring"></div>
                    </div>
                `;
            case 'interactive':
                return `
                    <div class="preview-interactive">
                        <div class="preview-cursor"></div>
                        <div class="preview-particle"></div>
                        <div class="preview-particle"></div>
                        <div class="preview-particle"></div>
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
                <span class="animation-selector-icon">⚙</span>
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
        
        // Get current animation from config
        const currentAnimation = window.ANIMATION_CONFIG?.name || 'animation1';
        
        // Mark current animation as active
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
                
                if (animationId === currentAnimation) {
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
        
        // Remove old animation CSS
        const oldLinks = document.querySelectorAll('link[data-animation-stylesheet]');
        oldLinks.forEach(link => link.remove());
        
        // Remove old animation scripts
        const oldScripts = document.querySelectorAll('script[data-animation-script]');
        oldScripts.forEach(script => script.remove());
        
        // Load new animation config
        const configScript = document.createElement('script');
        configScript.src = animation.config;
        configScript.onload = () => {
            const config = window.ANIMATION_CONFIG;
            if (!config) return;
            
            // Load new CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = config.css;
            link.setAttribute('data-animation-stylesheet', 'true');
            document.head.appendChild(link);
            
            // Load new scripts
            config.scripts.forEach((src, index) => {
                const script = document.createElement('script');
                script.src = src;
                script.defer = true;
                script.setAttribute('data-animation-script', 'true');
                document.head.appendChild(script);
            });
            
            // Reload page after a short delay to ensure everything loads
            setTimeout(() => {
                window.location.reload();
            }, 500);
        };
        document.head.appendChild(configScript);
    }
})();

