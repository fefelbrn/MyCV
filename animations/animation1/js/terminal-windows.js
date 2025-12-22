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
        // Check if CV page is visible - don't show terminals on CV page
        const cvPage = document.getElementById('cvPage');
        if (cvPage && cvPage.classList.contains('visible')) {
            return;
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
        
        terminals.forEach((terminal, index) => {
            setTimeout(() => {
                createTerminalWindow(terminal, index);
            }, terminal.delay);
        });
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

