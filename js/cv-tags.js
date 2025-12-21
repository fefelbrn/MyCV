// CV Tags - Tag system for filtering tiles
(function() {
    'use strict';
    
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    const tagsContainer = document.getElementById('cvTagsContainer');
    
    if (!tiles.length || !tagsContainer) return;
    
    // Collect all unique tags from tiles
    const allTags = new Set();
    tiles.forEach(tile => {
        const tags = tile.getAttribute('data-tags');
        if (tags) {
            tags.split(' ').forEach(tag => {
                if (tag.trim()) {
                    allTags.add(tag.trim());
                }
            });
        }
    });
    
    // Map tags to displayable names
    const tagDisplayNames = {
        'cartier': 'Cartier',
        'edf': 'EDF',
        'dassault': 'Dassault Systèmes',
        'bmw': 'BMW',
        'clubbing-with-ash': 'Clubbing With Ash',
        'albert-school': 'Albert School',
        'mines-paris': 'Mines de Paris',
        'sorbonne': 'Sorbonne',
        'em-lyon': 'EM-LYON',
        'hong-kong-baptist': 'Hong Kong Baptist',
        'google': 'Google',
        'dataiku': 'Dataiku',
        'mit': 'MIT',
        'aws': 'AWS',
        'datacamp': 'DataCamp'
    };
    
    // Create tag buttons
    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.className = 'cv-tag-btn';
        tagButton.setAttribute('data-tag', tag);
        tagButton.textContent = tagDisplayNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
        tagsContainer.appendChild(tagButton);
    });
    
    // Active tags management
    let activeTags = new Set();
    
    function combineFilters(filterType) {
        tiles.forEach(tile => {
            const tileType = tile.getAttribute('data-type');
            const tileTags = tile.getAttribute('data-tags');
            
            // Check type
            let matchesType = true;
            if (filterType !== 'all') {
                matchesType = tileType === filterType;
            }
            
            // Check tags
            let matchesTags = true;
            if (activeTags.size > 0 && tileTags) {
                const tileTagsArray = tileTags.split(' ').map(t => t.trim());
                matchesTags = Array.from(activeTags).some(activeTag => 
                    tileTagsArray.includes(activeTag)
                );
            }
            
            // Show if both conditions are met
            if (matchesType && matchesTags) {
                tile.style.display = 'flex';
                tile.style.animation = 'fadeIn 0.4s ease';
            } else {
                tile.style.display = 'none';
            }
        });
    }
    
    function updateFilter() {
        // Get active type filter
        const activeFilterBtn = document.querySelector('.cv-filter-btn.active');
        const filterType = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        // Combine filters
        combineFilters(filterType);
        
        // Update visual state of tag buttons
        document.querySelectorAll('.cv-tag-btn').forEach(btn => {
            const tag = btn.getAttribute('data-tag');
            if (activeTags.has(tag)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Handle tag clicks
    tagsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('cv-tag-btn')) {
            const tag = e.target.getAttribute('data-tag');
            
            // Toggle tag
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
            } else {
                activeTags.add(tag);
            }
            
            updateFilter();
        }
    });
    
    // Listen to type filter changes to combine with tags
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Wait for type filter to be applied, then combine with tags
            setTimeout(() => {
                const activeFilter = document.querySelector('.cv-filter-btn.active');
                if (activeFilter) {
                    const filterType = activeFilter.getAttribute('data-filter');
                    combineFilters(filterType);
                }
            }, 0);
        });
    });
    
    // Expose function to be used by cv-filter.js
    window.cvTagsFilter = {
        combineFilters: combineFilters,
        getActiveTags: () => activeTags
    };
    
})();

