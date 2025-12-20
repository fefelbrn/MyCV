// CV Tags - Système de tags pour filtrer les tuiles
(function() {
    'use strict';
    
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    const tagsContainer = document.getElementById('cvTagsContainer');
    
    if (!tiles.length || !tagsContainer) return;
    
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
    
    // Créer les boutons de tags
    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.className = 'cv-tag-btn';
        tagButton.setAttribute('data-tag', tag);
        tagButton.textContent = tagDisplayNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
        tagsContainer.appendChild(tagButton);
    });
    
    // Gestion des tags actifs
    let activeTags = new Set();
    
    function combineFilters(filterType) {
        tiles.forEach(tile => {
            const tileType = tile.getAttribute('data-type');
            const tileTags = tile.getAttribute('data-tags');
            
            // Vérifier le type
            let matchesType = true;
            if (filterType !== 'all') {
                matchesType = tileType === filterType;
            }
            
            // Vérifier les tags
            let matchesTags = true;
            if (activeTags.size > 0 && tileTags) {
                const tileTagsArray = tileTags.split(' ').map(t => t.trim());
                matchesTags = Array.from(activeTags).some(activeTag => 
                    tileTagsArray.includes(activeTag)
                );
            }
            
            // Afficher si les deux conditions sont remplies
            if (matchesType && matchesTags) {
                tile.style.display = 'flex';
                tile.style.animation = 'fadeIn 0.4s ease';
            } else {
                tile.style.display = 'none';
            }
        });
    }
    
    function updateFilter() {
        // Obtenir le filtre de type actif
        const activeFilterBtn = document.querySelector('.cv-filter-btn.active');
        const filterType = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        // Combiner les filtres
        combineFilters(filterType);
        
        // Mettre à jour l'état visuel des boutons de tags
        document.querySelectorAll('.cv-tag-btn').forEach(btn => {
            const tag = btn.getAttribute('data-tag');
            if (activeTags.has(tag)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Gérer les clics sur les tags
    tagsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('cv-tag-btn')) {
            const tag = e.target.getAttribute('data-tag');
            
            // Toggle le tag
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
            } else {
                activeTags.add(tag);
            }
            
            updateFilter();
        }
    });
    
    // Écouter les changements de filtre de type pour combiner avec les tags
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Attendre que le filtre de type soit appliqué, puis combiner avec les tags
            setTimeout(() => {
                const activeFilter = document.querySelector('.cv-filter-btn.active');
                if (activeFilter) {
                    const filterType = activeFilter.getAttribute('data-filter');
                    combineFilters(filterType);
                }
            }, 0);
        });
    });
    
    // Exposer la fonction pour être utilisée par cv-filter.js
    window.cvTagsFilter = {
        combineFilters: combineFilters,
        getActiveTags: () => activeTags
    };
    
})();

