// CV Filter - Filtrage des tuiles par type
(function() {
    'use strict';
    
    const filterButtons = document.querySelectorAll('.cv-filter-btn');
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    
    if (!filterButtons.length || !tiles.length) return;
    
    function filterTiles(filterType) {
        // Combiner avec le filtre de tags si disponible
        if (window.cvTagsFilter) {
            window.cvTagsFilter.combineFilters(filterType);
        } else {
            // Fallback si le système de tags n'est pas encore chargé
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
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les tuiles
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

