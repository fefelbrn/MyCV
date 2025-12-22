// CV tab drag handler and loading screen
// When you drag the tab up, it shows a cool terminal-style loading screen
(function() {
    'use strict';
    
    const cvTab = document.getElementById('cvTab');
    if (!cvTab) return;
    
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialBottom = 0;
    const threshold = 150; // How far to drag before triggering
    const cvUrl = '#'; // Not used yet, but keeping it for later
    
    function handleStart(e) {
        isDragging = true;
        cvTab.classList.add('dragging');
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startY = clientY;
        initialBottom = parseInt(getComputedStyle(cvTab).bottom) || 0;
        
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = startY - clientY; // Positive = dragging up
        
        // Only allow dragging upward
        if (deltaY > 0) {
            currentY = Math.min(deltaY, threshold + 50);
            cvTab.style.transform = `translateX(-50%) translateY(-${currentY}px)`;
            
            // Fade out a bit as you drag further
            const progress = Math.min(currentY / threshold, 1);
            cvTab.style.opacity = 1 - (progress * 0.3);
        }
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        cvTab.classList.remove('dragging');
        
        // Check if we dragged far enough
        if (currentY >= threshold) {
            // Show CV page directly without loading screen
            const cvPage = document.getElementById('cvPage');
            if (cvPage) {
                cvPage.classList.add('visible');
                
                // Hide animation selector when CV page is visible
                const animationSelector = document.querySelector('.animation-selector');
                if (animationSelector) {
                    animationSelector.style.display = 'none';
                    animationSelector.style.visibility = 'hidden';
                    animationSelector.style.opacity = '0';
                    animationSelector.style.pointerEvents = 'none';
                }
            }
        } else {
            // Reset position
            cvTab.style.transform = 'translateX(-50%)';
            cvTab.style.opacity = '';
        }
        
        currentY = 0;
        e.preventDefault();
    }
    
    // Mouse events
    cvTab.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events
    cvTab.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    // Hide animation selector when CV page becomes visible
    const cvPage = document.getElementById('cvPage');
    if (cvPage) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const animationSelector = document.querySelector('.animation-selector');
                    if (cvPage.classList.contains('visible')) {
                        if (animationSelector) {
                            animationSelector.style.display = 'none';
                        }
                    } else {
                        if (animationSelector) {
                            animationSelector.style.display = '';
                        }
                    }
                }
            });
        });
        
        observer.observe(cvPage, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
})();

