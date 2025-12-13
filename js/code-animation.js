/**
 * Spy movie style code animation
 * 
 * Generates random code lines that appear character by character
 * with an opacity gradient effect.
 * 
 * Two instances: top-right (normal gradient) and bottom-left (inverted gradient)
 */
(function() {
    'use strict';
    
    // Function to initialize a code animation
    function initCodeAnimation(containerId, invertGradient = false) {
        const codeContainer = document.getElementById(containerId);
        if (!codeContainer) return;
    
    // Random spy-style code fragments
    const codeFragments = [
        'const access = decrypt(key);',
        'if (auth === true) {',
        '  return secureData();',
        '}',
        'function hack() {',
        '  let payload = generate();',
        '  send(payload);',
        '}',
        'const token = getToken();',
        'await connect(server);',
        'const hash = encrypt(data);',
        'if (status === 200) {',
        '  log("success");',
        '}',
        'const key = generateKey();',
        'function decrypt(cipher) {',
        '  return decode(cipher);',
        '}',
        'const session = createSession();',
        'await authenticate(user);',
        'const secret = getSecret();',
        'if (verify(signature)) {',
        '  return true;',
        '}',
        'const buffer = readBuffer();',
        'function inject(code) {',
        '  execute(code);',
        '}',
        'const protocol = "https://";',
        'await fetch(endpoint);',
        'const response = await request();',
        'if (response.ok) {',
        '  parse(response);',
        '}',
        'const cipher = encrypt(message);',
        'function decode(input) {',
        '  return atob(input);',
        '}',
        'const header = getHeader();',
        'await send(data);',
        'const result = process();',
        'if (result) {',
        '  return result;',
        '}'
    ];
    
    const maxLines = 12;
    let currentLines = [];
    let isTyping = false;
    
    function updateOpacityGradient() {
        const lines = codeContainer.querySelectorAll('.code-line');
        const totalLines = lines.length;
        
        lines.forEach((line, index) => {
            if (line.classList.contains('typing')) {
                // Currently typing line: full white
                line.style.opacity = '1';
                line.style.color = '#ffffff';
            } else {
                let opacity;
                if (invertGradient) {
                    // Inverted gradient: top lines (old) are brighter
                    const distanceFromTop = index;
                    opacity = Math.max(0.6, 0.95 - (distanceFromTop * 0.05));
                } else {
                    // Normal gradient: bottom lines (recent) are brighter
                    const distanceFromBottom = totalLines - 1 - index;
                    opacity = Math.max(0.6, 0.95 - (distanceFromBottom * 0.05));
                }
                line.style.opacity = opacity.toString();
                line.style.color = 'rgba(255, 255, 255, ' + opacity + ')';
            }
        });
    }
    
    function typeLine(text, lineElement, onComplete) {
        let index = 0;
        isTyping = true;
        
        // Update gradient when starting to type
        updateOpacityGradient();
        
        function typeChar() {
            if (index < text.length) {
                lineElement.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(typeChar, 30); // Typing speed (30ms per character)
            } else {
                isTyping = false;
                // Once finished, line becomes translucent
                lineElement.classList.remove('typing');
                updateOpacityGradient(); // Update gradient
                if (onComplete) onComplete();
            }
        }
        
        typeChar();
    }
    
    function generateRandomCode() {
        if (isTyping) return; // Wait for current line to finish
        
        const randomCode = codeFragments[Math.floor(Math.random() * codeFragments.length)];
        
        // Remove first line if max reached
        if (currentLines.length >= maxLines) {
            const firstLine = codeContainer.querySelector('.code-line');
            if (firstLine) {
                firstLine.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (firstLine.parentNode) {
                        firstLine.remove();
                    }
                }, 300);
            }
            currentLines.shift();
        }
        
        // Create new line
        const codeLine = document.createElement('div');
        codeLine.className = 'code-line typing';
        codeLine.textContent = '';
        codeContainer.appendChild(codeLine);
        
        currentLines.push(randomCode);
        
        // Update gradient for all existing lines
        updateOpacityGradient();
        
        // Start typing the line
        typeLine(randomCode, codeLine);
    }
    
    // Generate code every 800ms (faster)
    setInterval(generateRandomCode, 800);
    
    // Initialize with some already complete lines
    for (let i = 0; i < 6; i++) {
        const randomCode = codeFragments[Math.floor(Math.random() * codeFragments.length)];
        currentLines.push(randomCode);
        const codeLine = document.createElement('div');
        codeLine.className = 'code-line';
        codeLine.textContent = randomCode;
        codeLine.style.transform = 'translateY(0)';
        codeLine.style.animation = 'none';
        codeContainer.appendChild(codeLine);
    }
    
    // Apply initial gradient
    updateOpacityGradient();
    }
    
    // Initialize both animations
    // Top right: normal gradient (recent = bright)
    initCodeAnimation('codeAnimation', false);
    // Bottom left: inverted gradient (old = bright)
    initCodeAnimation('codeAnimationBottomLeft', true);
    
})();

