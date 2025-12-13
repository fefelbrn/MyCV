/**
 * Fixed frame and zoom management
 * 
 * This script keeps the frame borders fixed even during browser zoom
 */

// Force borders to remain visible even during zoom
(function() {
    'use strict';
    
    const frameLayer = document.querySelector('.frame-layer');
    if (!frameLayer) return;
    
    // Desired position values (in pixels)
    const OFFSET = 15;
    
    let isZooming = false;
    let zoomTimeout = null;
    
    // Function to calculate zoom level
    function getZoomLevel() {
        // Method 1: Compare outerWidth and innerWidth
        const zoom1 = window.outerWidth / window.innerWidth;
        
        // Method 2: Use devicePixelRatio (may not be reliable for browser zoom)
        const zoom2 = window.devicePixelRatio || 1;
        
        // Method 3: Use a reference element
        const testElement = document.createElement('div');
        testElement.style.width = '100px';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        const rect = testElement.getBoundingClientRect();
        const zoom3 = rect.width / 100;
        document.body.removeChild(testElement);
        
        // Use the most reliable method (zoom3 via getBoundingClientRect)
        return zoom3 || zoom1 || 1;
    }
    
    function updateFramePositions() {
        // Calculate zoom level
        const zoomLevel = getZoomLevel();
        const inverseZoom = 1 / zoomLevel;
        
        // Get actual viewport size
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Force frame-layer size to viewport size
        frameLayer.style.width = viewportWidth + 'px';
        frameLayer.style.height = viewportHeight + 'px';
        frameLayer.style.top = '0px';
        frameLayer.style.left = '0px';
        frameLayer.style.right = 'auto';
        frameLayer.style.bottom = 'auto';
        
        // Apply inverse scale to compensate for zoom
        frameLayer.style.transform = `scale(${inverseZoom})`;
        frameLayer.style.transformOrigin = 'top left';
        
        // Adjust size to compensate for scale
        frameLayer.style.width = (viewportWidth * zoomLevel) + 'px';
        frameLayer.style.height = (viewportHeight * zoomLevel) + 'px';
        
        // Corners
        const cornerTopLeft = frameLayer.querySelector('.corner-top-left');
        const cornerTopRight = frameLayer.querySelector('.corner-top-right');
        const cornerBottomLeft = frameLayer.querySelector('.corner-bottom-left');
        const cornerBottomRight = frameLayer.querySelector('.corner-bottom-right');
        
        // Child elements are now positioned absolutely relative to frame-layer
        // which is itself transformed to compensate for zoom
        const adjustedOffset = OFFSET * zoomLevel;
        
        if (cornerTopLeft) {
            cornerTopLeft.style.top = adjustedOffset + 'px';
            cornerTopLeft.style.left = adjustedOffset + 'px';
            cornerTopLeft.style.right = 'auto';
            cornerTopLeft.style.bottom = 'auto';
            cornerTopLeft.style.position = 'absolute';
        }
        
        if (cornerTopRight) {
            cornerTopRight.style.top = adjustedOffset + 'px';
            cornerTopRight.style.right = adjustedOffset + 'px';
            cornerTopRight.style.left = 'auto';
            cornerTopRight.style.bottom = 'auto';
            cornerTopRight.style.position = 'absolute';
        }
        
        if (cornerBottomLeft) {
            cornerBottomLeft.style.bottom = adjustedOffset + 'px';
            cornerBottomLeft.style.left = adjustedOffset + 'px';
            cornerBottomLeft.style.right = 'auto';
            cornerBottomLeft.style.top = 'auto';
            cornerBottomLeft.style.position = 'absolute';
        }
        
        if (cornerBottomRight) {
            cornerBottomRight.style.bottom = adjustedOffset + 'px';
            cornerBottomRight.style.right = adjustedOffset + 'px';
            cornerBottomRight.style.left = 'auto';
            cornerBottomRight.style.top = 'auto';
            cornerBottomRight.style.position = 'absolute';
        }
        
        // Marks
        const markTop = frameLayer.querySelector('.middle-top');
        const markBottom = frameLayer.querySelector('.middle-bottom');
        const markLeft = frameLayer.querySelector('.middle-left');
        const markRight = frameLayer.querySelector('.middle-right');
        
        if (markTop) {
            markTop.style.top = adjustedOffset + 'px';
            markTop.style.left = ((viewportWidth * zoomLevel) / 2) + 'px';
            markTop.style.transform = 'translateX(-50%)';
            markTop.style.position = 'absolute';
        }
        
        if (markBottom) {
            markBottom.style.bottom = adjustedOffset + 'px';
            markBottom.style.left = ((viewportWidth * zoomLevel) / 2) + 'px';
            markBottom.style.transform = 'translateX(-50%)';
            markBottom.style.position = 'absolute';
        }
        
        if (markLeft) {
            markLeft.style.left = adjustedOffset + 'px';
            markLeft.style.top = ((viewportHeight * zoomLevel) / 2) + 'px';
            markLeft.style.transform = 'translateY(-50%)';
            markLeft.style.position = 'absolute';
        }
        
        if (markRight) {
            markRight.style.right = adjustedOffset + 'px';
            markRight.style.top = ((viewportHeight * zoomLevel) / 2) + 'px';
            markRight.style.transform = 'translateY(-50%)';
            markRight.style.position = 'absolute';
        }
    }
    
    // Update on load
    updateFramePositions();
    
    // Update on resize
    window.addEventListener('resize', updateFramePositions);
    
    // Detect zoom with cursor (Ctrl/Cmd + scroll)
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey || e.metaKey) {
            isZooming = true;
            updateFramePositions();
            
            // Continue updating during zoom
            if (zoomTimeout) clearTimeout(zoomTimeout);
            zoomTimeout = setTimeout(function() {
                isZooming = false;
            }, 300);
        }
    }, { passive: true });
    
    // Continuous zoom detection
    let lastInnerWidth = window.innerWidth;
    let lastInnerHeight = window.innerHeight;
    let lastDevicePixelRatio = window.devicePixelRatio || 1;
    
    function checkZoom() {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const currentDevicePixelRatio = window.devicePixelRatio || 1;
        
        if (currentWidth !== lastInnerWidth || 
            currentHeight !== lastInnerHeight ||
            currentDevicePixelRatio !== lastDevicePixelRatio ||
            isZooming) {
            updateFramePositions();
            lastInnerWidth = currentWidth;
            lastInnerHeight = currentHeight;
            lastDevicePixelRatio = currentDevicePixelRatio;
        }
    }
    
    // Check zoom very frequently (every 16ms = ~60fps)
    function animate() {
        checkZoom();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    
    // Listen to scroll events
    window.addEventListener('scroll', updateFramePositions, true);
    
    // Listen to zoom changes via Visual Viewport API (if available)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateFramePositions);
        window.visualViewport.addEventListener('scroll', updateFramePositions);
    }
    
})();

