// CV scroll header - follows scroll speed smoothly
(function() {
    'use strict';
    
    const cvPage = document.getElementById('cvPage');
    const cvBanner = document.getElementById('cvBanner');
    
    if (!cvPage || !cvBanner) return;
    
    let lastScrollTop = 0;
    let headerOffset = 0;
    let ticking = false;
    const headerHeight = cvBanner.offsetHeight;
    
    function handleScroll() {
        if (!cvPage.classList.contains('visible')) {
            ticking = false;
            return;
        }
        
        const scrollTop = cvPage.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        
        // Only process if scrolled past initial threshold
        if (scrollTop > 50) {
            // Calculate header offset based on scroll direction and speed
            if (scrollDelta > 0) {
                // Scrolling down - move header up
                headerOffset = Math.min(headerOffset + scrollDelta, headerHeight);
            } else if (scrollDelta < 0) {
                // Scrolling up - move header down
                headerOffset = Math.max(headerOffset + scrollDelta, 0);
            }
        } else {
            // Near top - always show header
            headerOffset = 0;
        }
        
        // Apply transform directly based on scroll position
        cvBanner.style.transform = `translateY(-${headerOffset}px)`;
        cvBanner.style.opacity = 1 - (headerOffset / headerHeight);
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    // Listen to scroll events on CV page
    cvPage.addEventListener('scroll', onScroll, { passive: true });
    
    // Reset header visibility when CV page becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (cvPage.classList.contains('visible')) {
                    // Reset scroll position tracking when CV page opens
                    lastScrollTop = cvPage.scrollTop || 0;
                    headerOffset = 0;
                    cvBanner.style.transform = 'translateY(0)';
                    cvBanner.style.opacity = '1';
                    cvBanner.classList.remove('hidden');
                } else {
                    // Reset when CV page closes
                    headerOffset = 0;
                    cvBanner.style.transform = 'translateY(0)';
                    cvBanner.style.opacity = '1';
                    cvBanner.classList.remove('hidden');
                    lastScrollTop = 0;
                }
            }
        });
    });
    
    observer.observe(cvPage, {
        attributes: true,
        attributeFilter: ['class']
    });
    
})();

