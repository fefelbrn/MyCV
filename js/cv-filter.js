// CV Filter - Filter tiles by type
(function() {
    'use strict';
    
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    
    if (!filterButtons.length || !tiles.length) return;
    
    function filterTiles(filterType) {
        // Combine with tag filter if available
        if (window.cvTagsFilter) {
            window.cvTagsFilter.combineFilters(filterType);
        } else {
            // Fallback if tag system is not yet loaded
            tiles.forEach(tile => {
                if (filterType === 'all') {
                    tile.style.display = 'flex';
                    tile.style.animation = 'fadeIn 0.4s ease';
                } else {
                    const tileType = tile.getAttribute('data-type');
                    if (tileType === filterType) {
                        tile.style.display = 'flex';
                        tile.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        tile.style.display = 'none';
                    }
                }
            });
        }
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tiles
            const filterType = this.getAttribute('data-filter');
            filterTiles(filterType);
        });
    });
    
    // Animation fadeIn
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
})();

