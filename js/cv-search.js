// CV Search - Barre de recherche avec autocomplétion pour les tags
(function() {
    'use strict';
    
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    const searchInput = document.getElementById('cvSearchInput');
    const autocompleteContainer = document.getElementById('cvSearchAutocomplete');
    
    if (!tiles.length || !searchInput || !autocompleteContainer) return;
    
    // Collecter tous les tags uniques depuis les tuiles
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
    
    // Mapper les tags vers des noms affichables
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
    
    // Créer un tableau de tags avec leurs noms d'affichage
    const tagsArray = Array.from(allTags).map(tag => ({
        id: tag,
        display: tagDisplayNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
    })).sort((a, b) => a.display.localeCompare(b.display));
    
    let activeSearchTerm = '';
    let selectedTagIndex = -1;
    
    // Fonction pour filtrer les suggestions
    function getSuggestions(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        const lowerQuery = query.toLowerCase();
        return tagsArray.filter(tag => 
            tag.display.toLowerCase().includes(lowerQuery) || 
            tag.id.toLowerCase().includes(lowerQuery)
        ).slice(0, 8); // Limiter à 8 suggestions
    }
    
    // Fonction pour afficher les suggestions
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
    
    // Fonction pour appliquer le filtre de recherche
    function applySearchFilter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        activeSearchTerm = searchTerm;
        
        // Obtenir le filtre de type actif
        const activeFilterBtn = document.querySelector('.cv-filter-btn.active');
        const filterType = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        // Trouver les tags correspondants
        const matchingTags = searchTerm ? tagsArray.filter(tag => 
            tag.display.toLowerCase().includes(searchTerm) || 
            tag.id.toLowerCase().includes(searchTerm)
        ).map(tag => tag.id) : [];
        
        // Filtrer les tuiles
        tiles.forEach(tile => {
            const tileType = tile.getAttribute('data-type');
            const tileTags = tile.getAttribute('data-tags');
            
            // Vérifier le type
            let matchesType = true;
            if (filterType !== 'all') {
                matchesType = tileType === filterType;
            }
            
            // Vérifier la recherche
            let matchesSearch = true;
            if (searchTerm && matchingTags.length > 0) {
                if (tileTags) {
                    const tileTagsArray = tileTags.split(' ').map(t => t.trim());
                    matchesSearch = matchingTags.some(tag => tileTagsArray.includes(tag));
                } else {
                    matchesSearch = false;
                }
            } else if (searchTerm && matchingTags.length === 0) {
                // Si on cherche quelque chose mais qu'aucun tag ne correspond, cacher toutes les tuiles
                matchesSearch = false;
            }
            
            // Afficher si les deux conditions sont remplies
            if (matchesType && matchesSearch) {
                tile.style.display = 'flex';
                tile.style.animation = 'fadeIn 0.4s ease';
            } else {
                tile.style.display = 'none';
            }
        });
    }
    
    // Gérer la saisie dans la barre de recherche
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const suggestions = getSuggestions(query);
        showSuggestions(suggestions);
        selectedTagIndex = -1;
        applySearchFilter();
    });
    
    // Gérer les clics sur les suggestions
    autocompleteContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('cv-search-suggestion')) {
            const tag = e.target.getAttribute('data-tag');
            const tagDisplay = tagsArray.find(t => t.id === tag)?.display || tag;
            searchInput.value = tagDisplay;
            autocompleteContainer.classList.remove('active');
            applySearchFilter();
        }
    });
    
    // Gérer la navigation au clavier
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
    
    // Fermer l'autocomplétion quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
            autocompleteContainer.classList.remove('active');
            selectedTagIndex = -1;
        }
    });
    
    // Écouter les changements de filtre de type pour réappliquer la recherche
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                applySearchFilter();
            }, 0);
        });
    });
    
    // Exposer la fonction pour être utilisée par cv-filter.js
    window.cvSearchFilter = {
        applySearchFilter: applySearchFilter
    };
    
})();

