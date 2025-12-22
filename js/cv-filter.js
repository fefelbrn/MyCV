// CV Filter - Filter tiles by type (multiple selection)
(function() {
    'use strict';
    
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    
    if (!filterButtons.length || !tiles.length) return;
    
    // Track selected filters
    let selectedFilters = new Set();
    
    function filterTiles() {
        // Combine with tag filter if available
        if (window.cvTagsFilter) {
            const filterArray = Array.from(selectedFilters);
            window.cvTagsFilter.combineFilters(filterArray.length === 0 ? ['all'] : filterArray);
        } else {
            // Fallback if tag system is not yet loaded
            tiles.forEach(tile => {
                if (selectedFilters.size === 0 || selectedFilters.has('all')) {
                    // Show all tiles if no filter selected or "all" is selected
                    tile.style.display = 'flex';
                    tile.style.animation = 'fadeIn 0.4s ease';
                } else {
                    const tileType = tile.getAttribute('data-type');
                    if (selectedFilters.has(tileType)) {
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
            const filterType = this.getAttribute('data-filter');
            
            // Toggle filter selection
            if (this.classList.contains('active')) {
                // Deselect: remove active class and remove from selected filters
                this.classList.remove('active');
                selectedFilters.delete(filterType);
            } else {
                // Select: add active class and add to selected filters
                this.classList.add('active');
                selectedFilters.add(filterType);
                
                // If "all" is selected, deselect all others
                if (filterType === 'all') {
                    selectedFilters.clear();
                    selectedFilters.add('all');
                    filterButtons.forEach(btn => {
                        if (btn !== this) {
                            btn.classList.remove('active');
                        }
                    });
                } else {
                    // If selecting a specific filter, remove "all" if it was selected
                    selectedFilters.delete('all');
                    const allButton = document.querySelector('.cv-filter-btn[data-filter="all"]');
                    if (allButton) {
                        allButton.classList.remove('active');
                    }
                }
            }
            
            // Filter tiles based on selected filters
            filterTiles();
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

