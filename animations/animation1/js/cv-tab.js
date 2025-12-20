// CV tab drag handler and loading screen
// When you drag the tab up, it shows a cool terminal-style loading screen
(function() {
    'use strict';
    
    const cvTab = document.getElementById('cvTab');
    if (!cvTab) return;
    
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialBottom = 0;
    const threshold = 150; // How far to drag before triggering
    const cvUrl = '#'; // Not used yet, but keeping it for later
    
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
        const deltaY = startY - clientY; // Positive = dragging up
        
        // Only allow dragging upward
        if (deltaY > 0) {
            currentY = Math.min(deltaY, threshold + 50);
            cvTab.style.transform = `translateX(-50%) translateY(-${currentY}px)`;
            
            // Fade out a bit as you drag further
            const progress = Math.min(currentY / threshold, 1);
            cvTab.style.opacity = 1 - (progress * 0.3);
        }
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        cvTab.classList.remove('dragging');
        
        // If they dragged far enough, trigger the loading screen
        if (currentY >= threshold) {
            cvTab.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            cvTab.style.transform = `translateX(-50%) translateY(-${threshold + 100}px)`;
            cvTab.style.opacity = '0';
            
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('visible');
                
                const loadingBarFill = document.getElementById('loadingBarFill');
                const loadingPercentage = document.getElementById('loadingPercentage');
                const packetsContainer = document.getElementById('packetsContainer');
                const networkIn = document.getElementById('networkIn');
                const networkOut = document.getElementById('networkOut');
                const networkInGraph = document.querySelector('#networkInGraph .network-graph-line');
                const networkOutGraph = document.querySelector('#networkOutGraph .network-graph-line');
                const cvPage = document.getElementById('cvPage');
                
                // Store data for the network graphs
                const maxDataPoints = 100;
                const networkInHistory = [];
                const networkOutHistory = [];
                
                // Fake package messages to make it look realistic
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
                const interval = 16; // ~60fps
                // Speed multiplier to make it finish in 4 seconds
                // Math: 4000ms / 16ms = 250 iterations, need 100/250 = 0.4 avg speed
                // Original avg was ~0.17, so multiply by 2.35
                const speedMultiplier = 2.35;
                let lastPacketTime = 0;
                let lastNetworkUpdateTime = 0;
                const networkUpdateInterval = 100; // Update network stats every 0.1s
                let packetIndex = 0;
                
                // Different speed phases to make it feel more realistic
                const phases = [
                    { start: 0, end: 15, speed: 0.08 * speedMultiplier },   // Slow start
                    { start: 15, end: 35, speed: 0.25 * speedMultiplier },  // Speeds up
                    { start: 35, end: 50, speed: 0.12 * speedMultiplier },  // Slows a bit
                    { start: 50, end: 70, speed: 0.30 * speedMultiplier },  // Really fast
                    { start: 70, end: 85, speed: 0.10 * speedMultiplier },  // Slows again
                    { start: 85, end: 100, speed: 0.15 * speedMultiplier }   // Steady finish
                ];
                
                function getCurrentSpeed(currentProgress) {
                    for (const phase of phases) {
                        if (currentProgress >= phase.start && currentProgress < phase.end) {
                            return phase.speed;
                        }
                    }
                    return 0.15; // Default speed
                }
                
                function calculateNetworkSpeed(speed) {
                    // Convert loading speed to fake Mo/s values
                    // Faster loading = higher numbers (looks more impressive)
                    const baseMoPerSecond = speed * 50 * 100;
                    const variation = (Math.random() - 0.5) * 30; // Add some randomness
                    return Math.max(10, baseMoPerSecond + variation);
                }
                
                function updateNetworkStats(speed) {
                    if (!networkIn || !networkOut) return;
                    
                    const inSpeed = calculateNetworkSpeed(speed);
                    // Out is usually less than In (makes sense)
                    const outSpeed = inSpeed * (0.1 + Math.random() * 0.1);
                    
                    networkIn.textContent = inSpeed.toFixed(1) + ' Mo/s';
                    networkOut.textContent = outSpeed.toFixed(1) + ' Mo/s';
                    
                    networkInHistory.push(inSpeed);
                    networkOutHistory.push(outSpeed);
                    
                    // Keep only the last 100 points
                    if (networkInHistory.length > maxDataPoints) {
                        networkInHistory.shift();
                        networkOutHistory.shift();
                    }
                    
                    updateGraphs();
                }
                
                function updateGraphs() {
                    if (!networkInGraph || !networkOutGraph) return;
                    
                    // Find the max value to scale the graph properly
                    const allInValues = networkInHistory.length > 0 ? networkInHistory : [0];
                    const allOutValues = networkOutHistory.length > 0 ? networkOutHistory : [0];
                    const maxIn = Math.max(...allInValues, 1);
                    const maxOut = Math.max(...allOutValues, 1);
                    
                    const graphWidth = 200;
                    const graphHeight = 60;
                    const padding = 2;
                    
                    // Draw the In graph line
                    if (networkInHistory.length > 0) {
                        const pointsIn = networkInHistory.map((value, index) => {
                            const x = (index / (maxDataPoints - 1)) * (graphWidth - padding * 2) + padding;
                            const y = graphHeight - ((value / maxIn) * (graphHeight - padding * 2) + padding);
                            return `${x},${y}`;
                        }).join(' ');
                        networkInGraph.setAttribute('points', pointsIn);
                    }
                    
                    // Draw the Out graph line
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
                    
                    // Auto-scroll to see the latest line
                    packetsContainer.scrollTop = packetsContainer.scrollHeight;
                    
                    // Don't let it get too long, remove oldest lines
                    const lines = packetsContainer.querySelectorAll('.packet-line');
                    if (lines.length > 8) {
                        lines[0].remove();
                    }
                    
                    packetIndex++;
                }
                
                const loadingInterval = setInterval(() => {
                    const currentSpeed = getCurrentSpeed(progress);
                    progress += currentSpeed;
                    
                    // Update network stats periodically
                    const now = Date.now();
                    const timeSinceLastNetworkUpdate = now - lastNetworkUpdateTime;
                    if (timeSinceLastNetworkUpdate >= networkUpdateInterval) {
                        updateNetworkStats(currentSpeed);
                        lastNetworkUpdateTime = now;
                    }
                    
                    // Add packet messages, faster when loading is faster
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
                        
                        // Clean up
                        if (networkIn) networkIn.textContent = '0.0 Mo/s';
                        if (networkOut) networkOut.textContent = '0.0 Mo/s';
                        
                        networkInHistory.length = 0;
                        networkOutHistory.length = 0;
                        if (networkInGraph) networkInGraph.setAttribute('points', '');
                        if (networkOutGraph) networkOutGraph.setAttribute('points', '');
                        
                        // Show success message
                        if (packetsContainer) {
                            const finalLine = document.createElement('div');
                            finalLine.className = 'packet-line fast';
                            finalLine.innerHTML = '<span class="terminal-prompt">$</span><span class="terminal-text">All packages loaded successfully.</span>';
                            packetsContainer.appendChild(finalLine);
                        }
                        
                        // Switch to CV page after a short delay
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
            // Didn't drag far enough, snap back
            cvTab.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            cvTab.style.transform = 'translateX(-50%) translateY(0)';
            cvTab.style.opacity = '1';
        }
        
        currentY = 0;
    }
    
    cvTab.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Also handle touch for mobile
    cvTab.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
})();

// CV close button handler
(function() {
    'use strict';
    
    const cvCloseBtn = document.getElementById('cvCloseBtn');
    const cvPage = document.getElementById('cvPage');
    const cvTab = document.getElementById('cvTab');
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (!cvCloseBtn || !cvPage) return;
    
    cvCloseBtn.addEventListener('click', function() {
        // Hide CV page
        cvPage.classList.remove('visible');
        
        // Reset CV tab position and visibility
        if (cvTab) {
            cvTab.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            cvTab.style.transform = 'translateX(-50%) translateY(0)';
            cvTab.style.opacity = '0.4';
        }
        
        // Hide loading screen if visible
        if (loadingScreen) {
            loadingScreen.classList.remove('visible');
        }
    });
    
})();

