// CV Tile Modal - Gestion de l'ouverture/fermeture des tuiles avec zoom
(function() {
    'use strict';
    
    const tiles = document.querySelectorAll('.cv-tile:not(.cv-tile-intro)');
    const modal = document.getElementById('cvTileModal');
    const modalOverlay = document.getElementById('cvTileModalOverlay');
    const modalContent = document.getElementById('cvTileModalContent');
    const modalBody = document.getElementById('cvTileModalBody');
    const modalClose = document.getElementById('cvTileModalClose');
    
    if (!modal || !tiles.length) return;
    
    function openModal(tile) {
        // Récupérer le contenu de la tuile
        const header = tile.querySelector('.cv-tile-header').cloneNode(true);
        const title = tile.querySelector('.cv-tile-title').cloneNode(true);
        const company = tile.querySelector('.cv-tile-company').cloneNode(true);
        const description = tile.querySelector('.cv-tile-description').cloneNode(true);
        
        // Cloner les classes de la tuile pour le style
        const tileClasses = Array.from(tile.classList).filter(c => c.startsWith('cv-tile-'));
        
        // Vider et remplir le modal
        modalBody.innerHTML = '';
        modalBody.appendChild(header);
        modalBody.appendChild(title);
        modalBody.appendChild(company);
        description.style.display = 'block';
        modalBody.appendChild(description);
        
        // Appliquer les classes de style
        modalContent.className = 'cv-tile-modal-content';
        tileClasses.forEach(cls => {
            if (cls !== 'cv-tile') {
                modalContent.classList.add(cls);
            }
        });
        
        // Ouvrir le modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Ouvrir au clic sur une tuile
    tiles.forEach(tile => {
        tile.addEventListener('click', function(e) {
            // Ne pas ouvrir si on clique sur un lien
            if (e.target.tagName === 'A') return;
            openModal(tile);
        });
    });
    
    // Fermer au clic sur l'overlay (flou)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Fermer au clic sur le bouton de fermeture
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
})();

