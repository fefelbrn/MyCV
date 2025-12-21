// Bubble Background Animation
// Based on the provided code

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        createBubbleBackground();
        setupInteractiveBubble();
    }
    
    function createBubbleBackground() {
        // Create gradient background container
        const gradientBg = document.createElement('div');
        gradientBg.className = 'gradient-bg';
        
        // Create SVG with filter
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'goo');
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('in', 'SourceGraphic');
        feGaussianBlur.setAttribute('stdDeviation', '10');
        feGaussianBlur.setAttribute('result', 'blur');
        
        const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        feColorMatrix.setAttribute('in', 'blur');
        feColorMatrix.setAttribute('mode', 'matrix');
        feColorMatrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8');
        feColorMatrix.setAttribute('result', 'goo');
        
        const feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
        feBlend.setAttribute('in', 'SourceGraphic');
        feBlend.setAttribute('in2', 'goo');
        
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feColorMatrix);
        filter.appendChild(feBlend);
        defs.appendChild(filter);
        svg.appendChild(defs);
        
        // Create gradients container
        const gradientsContainer = document.createElement('div');
        gradientsContainer.className = 'gradients-container';
        
        // Create gradient divs
        const g1 = document.createElement('div');
        g1.className = 'g1';
        gradientsContainer.appendChild(g1);
        
        const g2 = document.createElement('div');
        g2.className = 'g2';
        gradientsContainer.appendChild(g2);
        
        const g3 = document.createElement('div');
        g3.className = 'g3';
        gradientsContainer.appendChild(g3);
        
        const g4 = document.createElement('div');
        g4.className = 'g4';
        gradientsContainer.appendChild(g4);
        
        const g5 = document.createElement('div');
        g5.className = 'g5';
        gradientsContainer.appendChild(g5);
        
        const interactive = document.createElement('div');
        interactive.className = 'interactive';
        gradientsContainer.appendChild(interactive);
        
        gradientBg.appendChild(svg);
        gradientBg.appendChild(gradientsContainer);
        
        // Insert at the beginning of body
        document.body.insertBefore(gradientBg, document.body.firstChild);
    }
    
    function setupInteractiveBubble() {
        const interBubble = document.querySelector('.interactive');
        if (!interBubble) return;
        
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;
        
        function move() {
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            requestAnimationFrame(move);
        }
        
        window.addEventListener('mousemove', (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        });
        
        move();
    }
})();
