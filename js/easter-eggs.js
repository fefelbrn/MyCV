// Easter eggs - hidden surprises for curious visitors
(function() {
    'use strict';
    
    // Bug in the terminal header
    const terminalBug = document.getElementById('terminalBug');
    if (terminalBug) {
        terminalBug.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🐛 Bug clicked!');
            // TODO: Add something fun here
        });
    }
    
    // Circle in top left corner
    const easterEgg = document.getElementById('easterEgg');
    if (easterEgg) {
        easterEgg.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🥚 Easter egg clicked!');
            // TODO: Add something fun here too
        });
    }
    
})();

