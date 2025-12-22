// Terminal windows that appear after page load - macOS style
(function() {
    'use strict';
    
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500); // Small delay after page load
    }
    
    function init() {
        // Only show terminals on animation 1
        const currentAnimation = window.ANIMATION_CONFIG?.name || '';
        if (currentAnimation !== 'animation1') {
            return;
        }
        
        // Check if CV page is visible - don't show terminals on CV page
        const cvPage = document.getElementById('cvPage');
        if (cvPage && cvPage.classList.contains('visible')) {
            return;
        }
        
        // Hide terminals when CV page or loading screen becomes visible
        const loadingScreen = document.getElementById('loadingScreen');
        
        function hideTerminals() {
            const terminals = document.querySelectorAll('.mac-terminal-window');
            terminals.forEach(terminal => {
                terminal.style.display = 'none';
                terminal.style.visibility = 'hidden';
                terminal.style.opacity = '0';
            });
        }
        
        function showTerminals() {
            const terminals = document.querySelectorAll('.mac-terminal-window');
            terminals.forEach(terminal => {
                terminal.style.display = '';
                terminal.style.visibility = '';
                terminal.style.opacity = '';
            });
        }
        
        if (cvPage) {
            const cvObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (cvPage.classList.contains('visible')) {
                            hideTerminals();
                        } else {
                            // Only show terminals if loading screen is also not visible
                            if (!loadingScreen || !loadingScreen.classList.contains('visible')) {
                                showTerminals();
                            }
                        }
                    }
                });
            });
            
            cvObserver.observe(cvPage, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        if (loadingScreen) {
            const loadingObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (loadingScreen.classList.contains('visible')) {
                            hideTerminals();
                        } else {
                            // Only show terminals if CV page is also not visible
                            if (!cvPage || !cvPage.classList.contains('visible')) {
                                showTerminals();
                            }
                        }
                    }
                });
            });
            
            loadingObserver.observe(loadingScreen, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        const terminals = [
            {
                title: 'system.exe',
                commands: [
                    { text: 'Initializing system...', delay: 200 },
                    { text: 'Connecting to server...', delay: 300 },
                    { text: 'Authentication successful', delay: 500 },
                ],
                position: { top: '6%', left: '8%' },
                delay: 600
            },
            {
                title: 'monitor.log',
                commands: [
                    { text: 'Starting monitoring service...', delay: 300 },
                    { text: 'Watching file changes...', delay: 400 },
                    { text: 'Network status: OK', delay: 300 },
                    { text: 'All systems operational', delay: 400 }
                ],
                position: { top: '12%', left: '11%' },
                delay: 1200
            },
            {
                title: 'debug.console',
                commands: [
                    { text: 'Debug mode enabled', delay: 200 },
                    { text: 'Logging level: INFO', delay: 300 },
                    { text: 'Breakpoints cleared', delay: 400 },
                    { text: 'Ready for debugging', delay: 300 }
                ],
                position: { top: '20%', left: '4%' },
                delay: 1800
            }
        ];
        
        // Store timeout IDs so we can cancel them if needed
        const timeoutIds = [];
        
        // Function to check if terminals should be created
        function shouldCreateTerminals() {
            const cvPage = document.getElementById('cvPage');
            const loadingScreen = document.getElementById('loadingScreen');
            
            if (cvPage && cvPage.classList.contains('visible')) {
                return false;
            }
            if (loadingScreen && loadingScreen.classList.contains('visible')) {
                return false;
            }
            return true;
        }
        
        terminals.forEach((terminal, index) => {
            const timeoutId = setTimeout(() => {
                // Double-check before creating the window
                if (shouldCreateTerminals()) {
                    createTerminalWindow(terminal, index);
                }
            }, terminal.delay);
            timeoutIds.push(timeoutId);
        });
        
        // Cancel all pending timeouts if loading screen or CV page becomes visible
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            const cancelObserver = new MutationObserver(() => {
                if (loadingScreen.classList.contains('visible') || 
                    (cvPage && cvPage.classList.contains('visible'))) {
                    // Cancel all pending terminal creation timeouts
                    timeoutIds.forEach(id => clearTimeout(id));
                }
            });
            
            cancelObserver.observe(loadingScreen, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        if (cvPage) {
            const cancelCvObserver = new MutationObserver(() => {
                if (cvPage.classList.contains('visible')) {
                    // Cancel all pending terminal creation timeouts
                    timeoutIds.forEach(id => clearTimeout(id));
                }
            });
            
            cancelCvObserver.observe(cvPage, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    function createTerminalWindow(config, zIndex) {
        const terminal = document.createElement('div');
        terminal.className = 'mac-terminal-window';
        terminal.style.zIndex = 1000 + zIndex;
        terminal.style.top = config.position.top;
        terminal.style.left = config.position.left;
        
        terminal.innerHTML = `
            <div class="mac-terminal-header">
                <div class="mac-terminal-buttons">
                    <span class="mac-terminal-button mac-terminal-button-red"></span>
                    <span class="mac-terminal-button mac-terminal-button-yellow"></span>
                    <span class="mac-terminal-button mac-terminal-button-green"></span>
                </div>
                <div class="mac-terminal-title">${config.title}</div>
            </div>
            <div class="mac-terminal-body">
                <div class="mac-terminal-content"></div>
            </div>
        `;
        
        document.body.appendChild(terminal);
        
        // Animate window appearance
        setTimeout(() => {
            terminal.classList.add('visible');
        }, 50);
        
        // Execute commands
        const content = terminal.querySelector('.mac-terminal-content');
        let commandIndex = 0;
        let currentDelay = 0;
        
        function executeNextCommand() {
            if (commandIndex < config.commands.length) {
                const command = config.commands[commandIndex];
                currentDelay += command.delay;
                
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.className = 'mac-terminal-line';
                    line.innerHTML = `
                        <span class="mac-terminal-prompt">$</span>
                        <span class="mac-terminal-text">${command.text}</span>
                    `;
                    content.appendChild(line);
                    
                    // Auto-scroll to bottom
                    content.scrollTop = content.scrollHeight;
                    
                    commandIndex++;
                    executeNextCommand();
                }, command.delay);
            }
        }
        
        executeNextCommand();
    }
    
})();

