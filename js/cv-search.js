// CV Search - Search bar with autocompletion for tags
(function() {
    'use strict';
    
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    const searchInput = document.getElementById('cvSearchInput');
    const autocompleteContainer = document.getElementById('cvSearchAutocomplete');
    
    if (!tiles.length || !searchInput || !autocompleteContainer) return;
    
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
    
    // Create array of tags with their display names
    const tagsArray = Array.from(allTags).map(tag => ({
        id: tag,
        display: tagDisplayNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
    })).sort((a, b) => a.display.localeCompare(b.display));
    
    let activeSearchTerm = '';
    let selectedTagIndex = -1;
    
    // Function to filter suggestions
    function getSuggestions(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        const lowerQuery = query.toLowerCase();
        return tagsArray.filter(tag => 
            tag.display.toLowerCase().includes(lowerQuery) || 
            tag.id.toLowerCase().includes(lowerQuery)
        ).slice(0, 8); // Limit to 8 suggestions
    }
    
    // Function to display suggestions
    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.classList.remove('active');
            return;
        }
        
        autocompleteContainer.innerHTML = '';
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'cv-search-suggestion';
            if (index === selectedTagIndex) {
                item.classList.add('selected');
            }
            item.textContent = suggestion.display;
            item.setAttribute('data-tag', suggestion.id);
            autocompleteContainer.appendChild(item);
        });
        autocompleteContainer.classList.add('active');
    }
    
    // Function to apply search filter
    function applySearchFilter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        activeSearchTerm = searchTerm;
        
        // Get active type filter
        const activeFilterBtn = document.querySelector('.cv-filter-btn.active');
        const filterType = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        // Find matching tags
        const matchingTags = searchTerm ? tagsArray.filter(tag => 
            tag.display.toLowerCase().includes(searchTerm) || 
            tag.id.toLowerCase().includes(searchTerm)
        ).map(tag => tag.id) : [];
        
        // Filter tiles
        tiles.forEach(tile => {
            const tileType = tile.getAttribute('data-type');
            const tileTags = tile.getAttribute('data-tags');
            
            // Check type
            let matchesType = true;
            if (filterType !== 'all') {
                matchesType = tileType === filterType;
            }
            
            // Check search
            let matchesSearch = true;
            if (searchTerm && matchingTags.length > 0) {
                if (tileTags) {
                    const tileTagsArray = tileTags.split(' ').map(t => t.trim());
                    matchesSearch = matchingTags.some(tag => tileTagsArray.includes(tag));
                } else {
                    matchesSearch = false;
                }
            } else if (searchTerm && matchingTags.length === 0) {
                // If searching but no tags match, hide all tiles
                matchesSearch = false;
            }
            
            // Show if both conditions are met
            if (matchesType && matchesSearch) {
                tile.style.display = 'flex';
                tile.style.animation = 'fadeIn 0.4s ease';
            } else {
                tile.style.display = 'none';
            }
        });
    }
    
    // Handle search bar input
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const suggestions = getSuggestions(query);
        showSuggestions(suggestions);
        selectedTagIndex = -1;
        applySearchFilter();
    });
    
    // Handle suggestion clicks
    autocompleteContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('cv-search-suggestion')) {
            const tag = e.target.getAttribute('data-tag');
            const tagDisplay = tagsArray.find(t => t.id === tag)?.display || tag;
            searchInput.value = tagDisplay;
            autocompleteContainer.classList.remove('active');
            applySearchFilter();
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const suggestions = Array.from(autocompleteContainer.querySelectorAll('.cv-search-suggestion'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedTagIndex < suggestions.length - 1) {
                selectedTagIndex++;
                suggestions.forEach((s, i) => {
                    if (i === selectedTagIndex) {
                        s.classList.add('selected');
                        s.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    } else {
                        s.classList.remove('selected');
                    }
                });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedTagIndex > 0) {
                selectedTagIndex--;
                suggestions.forEach((s, i) => {
                    if (i === selectedTagIndex) {
                        s.classList.add('selected');
                        s.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    } else {
                        s.classList.remove('selected');
                    }
                });
            } else if (selectedTagIndex === 0) {
                selectedTagIndex = -1;
                suggestions.forEach(s => s.classList.remove('selected'));
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedTagIndex >= 0 && suggestions[selectedTagIndex]) {
                const tag = suggestions[selectedTagIndex].getAttribute('data-tag');
                const tagDisplay = tagsArray.find(t => t.id === tag)?.display || tag;
                searchInput.value = tagDisplay;
                autocompleteContainer.classList.remove('active');
                applySearchFilter();
            } else {
                applySearchFilter();
            }
        } else if (e.key === 'Escape') {
            autocompleteContainer.classList.remove('active');
            selectedTagIndex = -1;
        }
    });
    
    // Close autocomplete when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
            autocompleteContainer.classList.remove('active');
            selectedTagIndex = -1;
        }
    });
    
    // Listen to type filter changes to reapply search
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                applySearchFilter();
            }, 0);
        });
    });
    
    // Expose function to be used by cv-filter.js
    window.cvSearchFilter = {
        applySearchFilter: applySearchFilter
    };
    
})();

