// Code animation that looks like a spy movie terminal
// Lines appear character by character with a nice fade effect
(function() {
    'use strict';
    
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
                // Line being typed is fully visible
                line.style.opacity = '1';
                line.style.color = '#ffffff';
            } else {
                let opacity;
                if (invertGradient) {
                    // For bottom-left: older lines at top are brighter
                    const distanceFromTop = index;
                    opacity = Math.max(0.6, 0.95 - (distanceFromTop * 0.05));
                } else {
                    // For top-right: newer lines at bottom are brighter
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
        
        updateOpacityGradient();
        
        function typeChar() {
            if (index < text.length) {
                lineElement.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(typeChar, 30); // 30ms feels about right for typing speed
            } else {
                isTyping = false;
                lineElement.classList.remove('typing');
                updateOpacityGradient();
                if (onComplete) onComplete();
            }
        }
        
        typeChar();
    }
    
    function generateRandomCode() {
        if (isTyping) return; // Don't start a new line while one is typing
        
        const randomCode = codeFragments[Math.floor(Math.random() * codeFragments.length)];
        
        // Remove oldest line if we hit the limit
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
        
        const codeLine = document.createElement('div');
        codeLine.className = 'code-line typing';
        codeLine.textContent = '';
        codeContainer.appendChild(codeLine);
        
        currentLines.push(randomCode);
        
        updateOpacityGradient();
        
        typeLine(randomCode, codeLine);
    }
    
    // Add a new line every 800ms
    setInterval(generateRandomCode, 800);
    
    // Start with a few lines already there so it doesn't look empty
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
    
    updateOpacityGradient();
    }
    
    // Top right uses normal gradient (newer = brighter)
    initCodeAnimation('codeAnimation', false);
    // Bottom left uses inverted gradient (older = brighter)
    initCodeAnimation('codeAnimationBottomLeft', true);
    
})();

