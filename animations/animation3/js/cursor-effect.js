// Custom cursor effect with "SCROLL DOWN" and "EXPLORE" text
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Check if CV page is visible - if so, don't activate custom cursor
        function isCVPageVisible() {
            const cvPage = document.getElementById('cvPage');
            return cvPage && cvPage.classList.contains('visible');
        }
        
        // Generate unique ID for this cursor instance
        const uniqueId = 'cursor-path-' + Math.random().toString(36).substr(2, 9);
        
        // Create cursor element
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor-circle">
                <svg class="cursor-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <path id="${uniqueId}" d="M 100, 100 m -55, 0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" fill="none"/>
                    </defs>
                    <!-- Outer circle - white -->
                    <circle class="cursor-ring-outer" cx="100" cy="100" r="70" fill="none" stroke="white" stroke-width="1"/>
                    <!-- Inner circle - white -->
                    <circle class="cursor-ring-inner" cx="100" cy="100" r="40" fill="none" stroke="white" stroke-width="1"/>
                    <!-- Text between circles - centered and will rotate via CSS -->
                    <text class="cursor-text" fill="white" font-size="8" font-family="Inter, sans-serif" font-weight="300" letter-spacing="0.15em">
                        <textPath href="#${uniqueId}" startOffset="50%" text-anchor="middle">
                            SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE • SCROLL DOWN • EXPLORE
                        </textPath>
                    </text>
                    <!-- White cursor pointer centered -->
                    <g class="cursor-pointer" transform="translate(100, 100)">
                        <path d="M -5,-5 L 5,-5 L 5,5 L -5,5 Z" fill="white"/>
                    </g>
                </svg>
            </div>
        `;
        
        document.body.appendChild(cursor);
        
        // Track mouse position
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let isVisible = false;
        
        // Function to update cursor visibility based on CV page state
        function updateCursorState() {
            if (isCVPageVisible()) {
                // CV page is visible - hide custom cursor and show default cursor
                cursor.classList.remove('visible');
                document.body.style.cursor = '';
            } else {
                // CV page is not visible - show custom cursor and hide default cursor
                if (isVisible) {
                    cursor.classList.add('visible');
                }
                document.body.style.cursor = 'none';
            }
        }
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isCVPageVisible() && !isVisible) {
                cursor.classList.add('visible');
                isVisible = true;
            }
        });
        
        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
            isVisible = false;
        });
        
        // Watch for CV page visibility changes
        const cvPage = document.getElementById('cvPage');
        if (cvPage) {
            const observer = new MutationObserver(() => {
                updateCursorState();
            });
            observer.observe(cvPage, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        // Initial state check
        updateCursorState();
        
        // Smooth cursor animation
        function animateCursor() {
            // Smooth interpolation for cursor position - increased for better responsiveness
            const lerp = 0.35;
            cursorX += (mouseX - cursorX) * lerp;
            cursorY += (mouseY - cursorY) * lerp;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Text rotation is now handled by CSS animation - no JavaScript needed
            
            // Expose cursor position and radius for collision detection
            window.customCursor = {
                x: cursorX,
                y: cursorY,
                radius: 42 // outer circle radius in pixels (70/200 * 120px = 42)
            };
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
    }
})();

