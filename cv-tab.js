// Gestion de la languette CV
(function() {
    'use strict';
    
    const cvTab = document.getElementById('cvTab');
    if (!cvTab) return;
    
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialBottom = 0;
    const threshold = 150; // Distance à tirer pour déclencher la redirection
    const cvUrl = '#'; // Remplacez par l'URL de votre CV
    
    function handleStart(e) {
        isDragging = true;
        cvTab.classList.add('dragging');
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startY = clientY;
        initialBottom = parseInt(getComputedStyle(cvTab).bottom) || 0;
        
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = startY - clientY; // Négatif = vers le haut
        
        // Limiter le mouvement vers le haut uniquement
        if (deltaY > 0) {
            currentY = Math.min(deltaY, threshold + 50);
            cvTab.style.transform = `translateX(-50%) translateY(-${currentY}px)`;
            
            // Feedback visuel basé sur la distance
            const progress = Math.min(currentY / threshold, 1);
            cvTab.style.opacity = 1 - (progress * 0.3);
        }
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        cvTab.classList.remove('dragging');
        
        // Si on a tiré assez loin, afficher l'écran de chargement
        if (currentY >= threshold) {
            // Cacher la languette
            cvTab.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            cvTab.style.transform = `translateX(-50%) translateY(-${threshold + 100}px)`;
            cvTab.style.opacity = '0';
            
            // Afficher l'écran de chargement
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('visible');
                
                // Animer la barre de chargement avec vitesse variable
                const loadingBarFill = document.getElementById('loadingBarFill');
                const loadingPercentage = document.getElementById('loadingPercentage');
                const packetsContainer = document.getElementById('packetsContainer');
                const networkIn = document.getElementById('networkIn');
                const networkOut = document.getElementById('networkOut');
                const networkInGraph = document.querySelector('#networkInGraph .network-graph-line');
                const networkOutGraph = document.querySelector('#networkOutGraph .network-graph-line');
                const cvPage = document.getElementById('cvPage');
                
                // Historique pour les graphiques
                const maxDataPoints = 100;
                const networkInHistory = [];
                const networkOutHistory = [];
                
                // Messages de paquets
                const packetMessages = [
                    'Downloading package: core-utils-2.4.1...',
                    'Installing module: network-driver-1.2.3...',
                    'Loading library: data-processor-3.5.0...',
                    'Extracting archive: config-files-1.0.0...',
                    'Compiling source: kernel-module-4.2.1...',
                    'Updating cache: system-libs-2.1.0...',
                    'Verifying package: security-patch-1.5.2...',
                    'Installing dependencies: runtime-env-3.0.0...',
                    'Loading assets: ui-components-1.8.4...',
                    'Processing data: user-preferences-2.3.1...',
                    'Initializing service: background-daemon-1.1.0...',
                    'Updating registry: system-config-2.0.5...',
                    'Loading plugin: extension-manager-1.4.2...',
                    'Installing update: patch-1.9.3...',
                    'Compiling resources: asset-bundle-2.7.0...'
                ];
                
                let progress = 0;
                const totalDuration = 7500; // 7.5 secondes
                const interval = 16; // ~60fps
                let lastPacketTime = 0;
                let lastNetworkUpdateTime = 0;
                const networkUpdateInterval = 100; // Mise à jour toutes les 0.1s
                let packetIndex = 0;
                
                // Phases de chargement avec vitesses différentes
                const phases = [
                    { start: 0, end: 15, speed: 0.08 },   // Lent au début
                    { start: 15, end: 35, speed: 0.25 },  // Rapide
                    { start: 35, end: 50, speed: 0.12 },  // Ralentit
                    { start: 50, end: 70, speed: 0.30 },  // Très rapide
                    { start: 70, end: 85, speed: 0.10 },  // Ralentit
                    { start: 85, end: 100, speed: 0.15 }   // Fin modérée
                ];
                
                function getCurrentSpeed(currentProgress) {
                    for (const phase of phases) {
                        if (currentProgress >= phase.start && currentProgress < phase.end) {
                            return phase.speed;
                        }
                    }
                    return 0.15; // Vitesse par défaut
                }
                
                function calculateNetworkSpeed(speed) {
                    // Convertir la vitesse de progression en Mo/s
                    // Vitesse élevée = plus de Mo/s
                    // Base: 0.08 speed = ~2 Mo/s, 0.30 speed = ~15 Mo/s
                    const baseMoPerSecond = speed * 50 * 100; // Multiplicateur x100 pour avoir des valeurs élevées
                    const variation = (Math.random() - 0.5) * 30; // Variation aléatoire de ±15 Mo/s
                    return Math.max(10, baseMoPerSecond + variation);
                }
                
                function updateNetworkStats(speed) {
                    if (!networkIn || !networkOut) return;
                    
                    const inSpeed = calculateNetworkSpeed(speed);
                    // Out est généralement 10-20% de In (moins de données sortantes)
                    const outSpeed = inSpeed * (0.1 + Math.random() * 0.1);
                    
                    networkIn.textContent = inSpeed.toFixed(1) + ' Mo/s';
                    networkOut.textContent = outSpeed.toFixed(1) + ' Mo/s';
                    
                    // Ajouter aux historiques
                    networkInHistory.push(inSpeed);
                    networkOutHistory.push(outSpeed);
                    
                    // Limiter la taille des historiques
                    if (networkInHistory.length > maxDataPoints) {
                        networkInHistory.shift();
                        networkOutHistory.shift();
                    }
                    
                    // Mettre à jour les graphiques
                    updateGraphs();
                }
                
                function updateGraphs() {
                    if (!networkInGraph || !networkOutGraph) return;
                    
                    // Trouver les valeurs min et max pour l'échelle
                    const allInValues = networkInHistory.length > 0 ? networkInHistory : [0];
                    const allOutValues = networkOutHistory.length > 0 ? networkOutHistory : [0];
                    const maxIn = Math.max(...allInValues, 1);
                    const maxOut = Math.max(...allOutValues, 1);
                    
                    // Dimensions du graphique (viewBox: 0 0 200 60)
                    const graphWidth = 200;
                    const graphHeight = 60;
                    const padding = 2;
                    
                    // Générer les points pour le graphique In
                    if (networkInHistory.length > 0) {
                        const pointsIn = networkInHistory.map((value, index) => {
                            const x = (index / (maxDataPoints - 1)) * (graphWidth - padding * 2) + padding;
                            const y = graphHeight - ((value / maxIn) * (graphHeight - padding * 2) + padding);
                            return `${x},${y}`;
                        }).join(' ');
                        networkInGraph.setAttribute('points', pointsIn);
                    }
                    
                    // Générer les points pour le graphique Out
                    if (networkOutHistory.length > 0) {
                        const pointsOut = networkOutHistory.map((value, index) => {
                            const x = (index / (maxDataPoints - 1)) * (graphWidth - padding * 2) + padding;
                            const y = graphHeight - ((value / maxOut) * (graphHeight - padding * 2) + padding);
                            return `${x},${y}`;
                        }).join(' ');
                        networkOutGraph.setAttribute('points', pointsOut);
                    }
                }
                
                function addPacketLine(speed) {
                    if (!packetsContainer || packetIndex >= packetMessages.length) return;
                    
                    const packetLine = document.createElement('div');
                    packetLine.className = `packet-line ${speed}`;
                    
                    const prompt = document.createElement('span');
                    prompt.className = 'terminal-prompt';
                    prompt.textContent = '$';
                    
                    const text = document.createElement('span');
                    text.className = 'terminal-text';
                    text.textContent = packetMessages[packetIndex % packetMessages.length];
                    
                    packetLine.appendChild(prompt);
                    packetLine.appendChild(text);
                    packetsContainer.appendChild(packetLine);
                    
                    // Scroll vers le bas
                    packetsContainer.scrollTop = packetsContainer.scrollHeight;
                    
                    // Limiter le nombre de lignes visibles
                    const lines = packetsContainer.querySelectorAll('.packet-line');
                    if (lines.length > 8) {
                        lines[0].remove();
                    }
                    
                    packetIndex++;
                }
                
                const loadingInterval = setInterval(() => {
                    const currentSpeed = getCurrentSpeed(progress);
                    progress += currentSpeed;
                    
                    // Mettre à jour les statistiques réseau toutes les 0.1s
                    const now = Date.now();
                    const timeSinceLastNetworkUpdate = now - lastNetworkUpdateTime;
                    if (timeSinceLastNetworkUpdate >= networkUpdateInterval) {
                        updateNetworkStats(currentSpeed);
                        lastNetworkUpdateTime = now;
                    }
                    
                    // Ajouter des paquets selon la vitesse
                    const timeSinceLastPacket = now - lastPacketTime;
                    const packetInterval = currentSpeed > 0.2 ? 200 : (currentSpeed > 0.15 ? 350 : 600);
                    
                    if (timeSinceLastPacket >= packetInterval && progress < 98) {
                        let speedClass = 'medium';
                        if (currentSpeed > 0.2) speedClass = 'fast';
                        else if (currentSpeed < 0.12) speedClass = 'slow';
                        
                        addPacketLine(speedClass);
                        lastPacketTime = now;
                    }
                    
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(loadingInterval);
                        
                        // Réinitialiser les stats réseau
                        if (networkIn) networkIn.textContent = '0.0 Mo/s';
                        if (networkOut) networkOut.textContent = '0.0 Mo/s';
                        
                        // Réinitialiser les graphiques
                        networkInHistory.length = 0;
                        networkOutHistory.length = 0;
                        if (networkInGraph) networkInGraph.setAttribute('points', '');
                        if (networkOutGraph) networkOutGraph.setAttribute('points', '');
                        
                        // Ajouter un dernier message
                        if (packetsContainer) {
                            const finalLine = document.createElement('div');
                            finalLine.className = 'packet-line fast';
                            finalLine.innerHTML = '<span class="terminal-prompt">$</span><span class="terminal-text">All packages loaded successfully.</span>';
                            packetsContainer.appendChild(finalLine);
                        }
                        
                        // Cacher l'écran de chargement et afficher la page CV
                        setTimeout(() => {
                            loadingScreen.classList.remove('visible');
                            if (cvPage) {
                                cvPage.classList.add('visible');
                            }
                        }, 500);
                    }
                    
                    if (loadingBarFill) {
                        loadingBarFill.style.width = Math.min(progress, 100) + '%';
                    }
                    if (loadingPercentage) {
                        loadingPercentage.textContent = Math.floor(Math.min(progress, 100)) + '%';
                    }
                }, interval);
            }
        } else {
            // Retour à la position initiale
            cvTab.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            cvTab.style.transform = 'translateX(-50%) translateY(0)';
            cvTab.style.opacity = '1';
        }
        
        currentY = 0;
    }
    
    // Événements souris
    cvTab.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Événements tactiles
    cvTab.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
})();

