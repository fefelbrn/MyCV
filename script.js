// Gestion du bug easter egg
(function() {
    'use strict';
    
    const terminalBug = document.getElementById('terminalBug');
    if (terminalBug) {
        terminalBug.addEventListener('click', function(e) {
            e.preventDefault();
            // Action à définir (peut être un lien, une animation, etc.)
            console.log('🐛 Bug clicked!');
            // Vous pouvez ajouter ici ce que vous voulez faire quand on clique sur le bug
            // Par exemple : window.open('votre-lien', '_blank');
        });
    }
})();

// Force les bordures à rester visibles même lors du zoom
(function() {
    'use strict';
    
    const frameLayer = document.querySelector('.frame-layer');
    if (!frameLayer) return;
    
    // Valeurs de position souhaitées (en pixels)
    const OFFSET = 15;
    
    let isZooming = false;
    let zoomTimeout = null;
    
    // Fonction pour calculer le niveau de zoom
    function getZoomLevel() {
        // Méthode 1: Comparer outerWidth et innerWidth
        const zoom1 = window.outerWidth / window.innerWidth;
        
        // Méthode 2: Utiliser devicePixelRatio (peut ne pas être fiable pour le zoom navigateur)
        const zoom2 = window.devicePixelRatio || 1;
        
        // Méthode 3: Utiliser un élément de référence
        const testElement = document.createElement('div');
        testElement.style.width = '100px';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        const rect = testElement.getBoundingClientRect();
        const zoom3 = rect.width / 100;
        document.body.removeChild(testElement);
        
        // Utiliser la méthode la plus fiable (zoom3 via getBoundingClientRect)
        return zoom3 || zoom1 || 1;
    }
    
    function updateFramePositions() {
        // Calculer le niveau de zoom
        const zoomLevel = getZoomLevel();
        const inverseZoom = 1 / zoomLevel;
        
        // Obtenir la taille réelle de la fenêtre visible
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Forcer la taille du frame-layer à la taille de la fenêtre visible
        frameLayer.style.width = viewportWidth + 'px';
        frameLayer.style.height = viewportHeight + 'px';
        frameLayer.style.top = '0px';
        frameLayer.style.left = '0px';
        frameLayer.style.right = 'auto';
        frameLayer.style.bottom = 'auto';
        
        // Appliquer un scale inverse pour compenser le zoom
        frameLayer.style.transform = `scale(${inverseZoom})`;
        frameLayer.style.transformOrigin = 'top left';
        
        // Ajuster la taille pour compenser le scale
        frameLayer.style.width = (viewportWidth * zoomLevel) + 'px';
        frameLayer.style.height = (viewportHeight * zoomLevel) + 'px';
        
        // Coins
        const cornerTopLeft = frameLayer.querySelector('.corner-top-left');
        const cornerTopRight = frameLayer.querySelector('.corner-top-right');
        const cornerBottomLeft = frameLayer.querySelector('.corner-bottom-left');
        const cornerBottomRight = frameLayer.querySelector('.corner-bottom-right');
        
        // Les éléments enfants sont maintenant positionnés en absolu par rapport au frame-layer
        // qui est lui-même transformé pour compenser le zoom
        const adjustedOffset = OFFSET * zoomLevel;
        
        if (cornerTopLeft) {
            cornerTopLeft.style.top = adjustedOffset + 'px';
            cornerTopLeft.style.left = adjustedOffset + 'px';
            cornerTopLeft.style.right = 'auto';
            cornerTopLeft.style.bottom = 'auto';
            cornerTopLeft.style.position = 'absolute';
        }
        
        if (cornerTopRight) {
            cornerTopRight.style.top = adjustedOffset + 'px';
            cornerTopRight.style.right = adjustedOffset + 'px';
            cornerTopRight.style.left = 'auto';
            cornerTopRight.style.bottom = 'auto';
            cornerTopRight.style.position = 'absolute';
        }
        
        if (cornerBottomLeft) {
            cornerBottomLeft.style.bottom = adjustedOffset + 'px';
            cornerBottomLeft.style.left = adjustedOffset + 'px';
            cornerBottomLeft.style.right = 'auto';
            cornerBottomLeft.style.top = 'auto';
            cornerBottomLeft.style.position = 'absolute';
        }
        
        if (cornerBottomRight) {
            cornerBottomRight.style.bottom = adjustedOffset + 'px';
            cornerBottomRight.style.right = adjustedOffset + 'px';
            cornerBottomRight.style.left = 'auto';
            cornerBottomRight.style.top = 'auto';
            cornerBottomRight.style.position = 'absolute';
        }
        
        // Marques
        const markTop = frameLayer.querySelector('.middle-top');
        const markBottom = frameLayer.querySelector('.middle-bottom');
        const markLeft = frameLayer.querySelector('.middle-left');
        const markRight = frameLayer.querySelector('.middle-right');
        
        if (markTop) {
            markTop.style.top = adjustedOffset + 'px';
            markTop.style.left = ((viewportWidth * zoomLevel) / 2) + 'px';
            markTop.style.transform = 'translateX(-50%)';
            markTop.style.position = 'absolute';
        }
        
        if (markBottom) {
            markBottom.style.bottom = adjustedOffset + 'px';
            markBottom.style.left = ((viewportWidth * zoomLevel) / 2) + 'px';
            markBottom.style.transform = 'translateX(-50%)';
            markBottom.style.position = 'absolute';
        }
        
        if (markLeft) {
            markLeft.style.left = adjustedOffset + 'px';
            markLeft.style.top = ((viewportHeight * zoomLevel) / 2) + 'px';
            markLeft.style.transform = 'translateY(-50%)';
            markLeft.style.position = 'absolute';
        }
        
        if (markRight) {
            markRight.style.right = adjustedOffset + 'px';
            markRight.style.top = ((viewportHeight * zoomLevel) / 2) + 'px';
            markRight.style.transform = 'translateY(-50%)';
            markRight.style.position = 'absolute';
        }
    }
    
    // Mettre à jour au chargement
    updateFramePositions();
    
    // Mettre à jour lors du redimensionnement
    window.addEventListener('resize', updateFramePositions);
    
    // Détecter le zoom au curseur (Ctrl/Cmd + molette)
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey || e.metaKey) {
            isZooming = true;
            updateFramePositions();
            
            // Continuer à mettre à jour pendant le zoom
            if (zoomTimeout) clearTimeout(zoomTimeout);
            zoomTimeout = setTimeout(function() {
                isZooming = false;
            }, 300);
        }
    }, { passive: true });
    
    // Détection continue du zoom
    let lastInnerWidth = window.innerWidth;
    let lastInnerHeight = window.innerHeight;
    let lastDevicePixelRatio = window.devicePixelRatio || 1;
    
    function checkZoom() {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const currentDevicePixelRatio = window.devicePixelRatio || 1;
        
        if (currentWidth !== lastInnerWidth || 
            currentHeight !== lastInnerHeight ||
            currentDevicePixelRatio !== lastDevicePixelRatio ||
            isZooming) {
            updateFramePositions();
            lastInnerWidth = currentWidth;
            lastInnerHeight = currentHeight;
            lastDevicePixelRatio = currentDevicePixelRatio;
        }
    }
    
    // Vérifier le zoom très fréquemment (toutes les 16ms = ~60fps)
    function animate() {
        checkZoom();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    
    // Écouter les événements de scroll
    window.addEventListener('scroll', updateFramePositions, true);
    
    // Écouter les changements de zoom via l'API Visual Viewport (si disponible)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateFramePositions);
        window.visualViewport.addEventListener('scroll', updateFramePositions);
    }
    
})();

