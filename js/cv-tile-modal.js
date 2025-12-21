// CV Tile Modal - Manage tile open/close with zoom
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
        // Get tile content
        const header = tile.querySelector('.cv-tile-header').cloneNode(true);
        const title = tile.querySelector('.cv-tile-title').cloneNode(true);
        const company = tile.querySelector('.cv-tile-company').cloneNode(true);
        const description = tile.querySelector('.cv-tile-description').cloneNode(true);
        
        // Clone tile classes for styling
        const tileClasses = Array.from(tile.classList).filter(c => c.startsWith('cv-tile-'));
        
        // Clear and fill modal
        modalBody.innerHTML = '';
        modalBody.appendChild(header);
        modalBody.appendChild(title);
        modalBody.appendChild(company);
        description.style.display = 'block';
        modalBody.appendChild(description);
        
        // Apply style classes
        modalContent.className = 'cv-tile-modal-content';
        tileClasses.forEach(cls => {
            if (cls !== 'cv-tile') {
                modalContent.classList.add(cls);
            }
        });
        
        // Open modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Open on tile click
    tiles.forEach(tile => {
        tile.addEventListener('click', function(e) {
            // Don't open if clicking on a link
            if (e.target.tagName === 'A') return;
            openModal(tile);
        });
    });
    
    // Close on overlay (blur) click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on close button click
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
})();

