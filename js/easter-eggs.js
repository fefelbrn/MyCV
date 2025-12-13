/**
 * Easter eggs management
 * 
 * This file contains all easter eggs on the site:
 * - Clickable bug in the terminal
 * - Circle easter egg (if present)
 */

(function() {
    'use strict';
    
    /**
     * Easter Egg 1: Bug in terminal
     */
    const terminalBug = document.getElementById('terminalBug');
    if (terminalBug) {
        terminalBug.addEventListener('click', function(e) {
            e.preventDefault();
            // Action to define (can be a link, animation, etc.)
            console.log('🐛 Bug clicked!');
            // Example: window.open('your-link', '_blank');
        });
    }
    
    /**
     * Easter Egg 2: Circle in top left
     */
    const easterEgg = document.getElementById('easterEgg');
    if (easterEgg) {
        easterEgg.addEventListener('click', function(e) {
            e.preventDefault();
            // Action to define
            console.log('🥚 Easter egg clicked!');
        });
    }
    
})();

