// Animation 2 - 3D Text in Glass Torus
// Based on Codrops tutorial: https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus/

(function() {
    'use strict';
    
    let scene, camera, renderer;
    let textMesh, torusMesh;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let time = 0;
    let animationId;
    let fontLoader, font;
    let container, canvas;
    let envMap;
    
    // Wait for DOM and Three.js to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        function checkThree() {
            if (typeof THREE !== 'undefined') {
                loadFont();
            } else {
                setTimeout(checkThree, 50);
            }
        }
        checkThree();
    }
    
    function loadFont() {
        // Load font for 3D text
        fontLoader = new THREE.FontLoader();
        
        // Use a default font or load from file
        // For now, we'll use a simple approach with TextGeometry
        // You can load a custom font file if needed
        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            (loadedFont) => {
                font = loadedFont;
                createScene();
            },
            undefined,
            (error) => {
                console.warn('Font loading failed, using fallback:', error);
                // Fallback: create text without custom font
                createScene();
            }
        );
    }
    
    // Calculate responsive size based on viewport (matches CSS vmin)
    function getResponsiveSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const vmin = Math.min(viewportWidth, viewportHeight);
        
        // Match CSS: 90vmin with min 400px and max 1600px
        let size = vmin * 0.9;
        
        // Apply responsive breakpoints to match CSS
        if (viewportWidth <= 480) {
            size = vmin * 0.75; // 75vmin for mobile
        } else if (viewportWidth <= 768) {
            size = vmin * 0.80; // 80vmin for tablet
        } else if (viewportWidth <= 1200) {
            size = vmin * 0.85; // 85vmin for small desktop
        }
        
        // Apply min/max limits
        size = Math.max(300, Math.min(size, 1600));
        return size;
    }
    
    // Calculate responsive text size
    function getResponsiveTextSize() {
        const viewportWidth = window.innerWidth;
        // Scale text size based on viewport width
        // Base size at 1200px width, scale down for smaller screens
        const baseSize = 0.9;
        const scaleFactor = Math.min(1, Math.max(0.3, viewportWidth / 1200));
        return baseSize * scaleFactor;
    }
    
    // Create or update text mesh
    function createTextMesh() {
        if (!envMap) return false; // Wait for envMap to be ready
        
        // Remove existing text if it exists
        if (textMesh) {
            scene.remove(textMesh);
            // Dispose of geometries and materials
            if (textMesh.children) {
                textMesh.children.forEach(child => {
                    if (child.children) {
                        child.children.forEach(grandChild => {
                            if (grandChild.geometry) grandChild.geometry.dispose();
                            if (grandChild.material) grandChild.material.dispose();
                        });
                    }
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
            }
            if (textMesh.geometry) textMesh.geometry.dispose();
            if (textMesh.material) textMesh.material.dispose();
        }
        
        const responsiveSize = getResponsiveTextSize();
        
        if (font) {
            const textGeometry = new THREE.TextGeometry('Work Experience', {
                font: font,
                size: responsiveSize,
                height: 0.4 * (responsiveSize / 0.9),
                curveSegments: Math.max(12, Math.floor(20 * (responsiveSize / 0.9))),
                bevelEnabled: true,
                bevelThickness: 0.1 * (responsiveSize / 0.9),
                bevelSize: 0.1 * (responsiveSize / 0.9),
                bevelOffset: 0,
                bevelSegments: Math.max(5, Math.floor(10 * (responsiveSize / 0.9)))
            });
            
            textGeometry.computeBoundingBox();
            const centerOffsetX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
            const centerOffsetY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
            
            // Create main text material with chrome/liquid metal effect - clearer visibility
            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff, // Brighter white/silver for better visibility
                metalness: 0.95, // High metalness for chrome effect
                roughness: 0.15, // Slightly more roughness for better readability
                emissive: 0x333333, // More emissive for better visibility
                envMap: envMap, // Environment map for reflections
                envMapIntensity: 2.5, // Strong reflections for chrome
                side: THREE.DoubleSide
            });
            
            // Create main text mesh with chrome effect
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(centerOffsetX, centerOffsetY, 0);
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;
            
            // Add black outline for better visibility
            // Use a different approach - create outline with offset positions
            const outlineMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000, // Black outline
                side: THREE.FrontSide
            });
            
            // Create outline group with multiple offset layers for clean outline
            const outlineGroup = new THREE.Group();
            
            // Create outline with small offsets in 8 directions for smooth outline
            const offsets = [
                { x: 0.03, y: 0, z: -0.01 },
                { x: -0.03, y: 0, z: -0.01 },
                { x: 0, y: 0.03, z: -0.01 },
                { x: 0, y: -0.03, z: -0.01 },
                { x: 0.02, y: 0.02, z: -0.01 },
                { x: -0.02, y: 0.02, z: -0.01 },
                { x: 0.02, y: -0.02, z: -0.01 },
                { x: -0.02, y: -0.02, z: -0.01 }
            ];
            
            offsets.forEach(offset => {
                const outlineGeometry = textGeometry.clone();
                const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
                outlineMesh.position.set(
                    centerOffsetX + offset.x,
                    centerOffsetY + offset.y,
                    offset.z
                );
                outlineGroup.add(outlineMesh);
            });
            
            // Group outline and text together (outline first so it renders behind)
            const textGroup = new THREE.Group();
            textGroup.add(outlineGroup);
            textGroup.add(textMesh);
            scene.add(textGroup);
            
            // Update textMesh reference to the group
            textMesh = textGroup;
            return true;
        } else {
            // Fallback: create simple text using shapes
            createTextFallback();
            return false;
        }
    }
    
    function createScene() {
        container = document.createElement('div');
        container.className = 'text-3d-container';
        
        const size = getResponsiveSize();
        
        // Scene
        scene = new THREE.Scene();
        scene.background = null; // Transparent to show bubble background
        
        // Camera - wider field of view to see more
        camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.set(0, 0, 10); // Further back to see more
        
        // Renderer
        renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        canvas = renderer.domElement;
        canvas.className = 'text-3d-canvas';
        container.appendChild(canvas);
        
        // Add environment map for reflections (important for glass materials)
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        
        // Create a richer environment map for chrome reflections
        const envScene = new THREE.Scene();
        const envLight = new THREE.AmbientLight(0xffffff, 0.6);
        envScene.add(envLight);
        const envLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
        envLight2.position.set(5, 5, 5);
        envScene.add(envLight2);
        // Add warm light for chrome color variation
        const envLight3 = new THREE.DirectionalLight(0xffaa44, 0.5);
        envLight3.position.set(-3, 2, 3);
        envScene.add(envLight3);
        envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
        
        // Create 3D Text "Work Experience"
        createTextMesh();
        
        // Create Glass Torus (responsive size)
        const torusRadius = Math.max(2.0, Math.min(3.0, 3.0 * (window.innerWidth / 1200)));
        const torusGeometry = new THREE.TorusGeometry(torusRadius, 0.3, 16, 100);
        
        // Use MeshPhysicalMaterial with transmission for glass effect
        // This is the key material from the tutorial
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 1.0, // Full transmission (transparent)
            opacity: 0.1,
            transparent: true,
            roughness: 0.0, // Smooth surface
            metalness: 0.0,
            ior: 1.5, // Index of Refraction (glass-like)
            thickness: 0.5, // Thickness of the glass
            chromaticAberration: 0.02, // Subtle color dispersion
            anisotropy: 0.1, // Slight directional blur
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMap: envMap,
            envMapIntensity: 1.0
        });
        
        torusMesh = new THREE.Mesh(torusGeometry, glassMaterial);
        torusMesh.rotation.x = Math.PI / 2;
        scene.add(torusMesh);
        
        // Add lights (enhanced for chrome/liquid metal effect - brighter for clarity)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Brighter ambient
        scene.add(ambientLight);
        
        // Main key light for chrome highlights - brighter
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
        directionalLight1.position.set(5, 8, 5);
        directionalLight1.castShadow = true;
        scene.add(directionalLight1);
        
        // Fill light from opposite side - brighter
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
        directionalLight2.position.set(-5, 3, -5);
        scene.add(directionalLight2);
        
        // Rim light for chrome edge highlights - brighter
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight3.position.set(0, 0, -8);
        scene.add(directionalLight3);
        
        // Point light for additional chrome reflections - brighter
        const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);
        
        // Warm accent light for chrome color variation
        const pointLight2 = new THREE.PointLight(0xffaa44, 1.0, 15);
        pointLight2.position.set(-3, -2, 4);
        scene.add(pointLight2);
        
        // Add hemisphere light for better illumination
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemisphereLight);
        
        // Insert container
        const centerText = document.querySelector('.center-text');
        if (centerText && centerText.parentNode) {
            centerText.parentNode.insertBefore(container, centerText);
            // Ensure the original text is hidden (should already be hidden by CSS)
            centerText.style.display = 'none';
            centerText.style.opacity = '0';
            centerText.style.visibility = 'hidden';
        } else {
            document.body.appendChild(container);
        }
        
        // Handle resize with smooth transition
        let resizeTimeout;
        let isResizing = false;
        let currentSize = getResponsiveSize();
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            
            // Add resizing class for fade effect
            if (!isResizing) {
                container.classList.add('resizing');
                canvas.style.opacity = '0.6';
                canvas.style.transition = 'opacity 0.15s ease-out';
                isResizing = true;
            }
            
            resizeTimeout = setTimeout(() => {
                const newSize = getResponsiveSize();
                
                // Only update if size changed significantly (avoid micro-adjustments)
                if (Math.abs(newSize - currentSize) < 10) {
                    container.classList.remove('resizing');
                    canvas.style.opacity = '1';
                    isResizing = false;
                    return;
                }
                
                currentSize = newSize;
                
                // Smoothly update container size with CSS transition
                container.style.width = newSize + 'px';
                container.style.height = newSize + 'px';
                
                // Update renderer size immediately for smooth rendering
                camera.aspect = 1;
                camera.updateProjectionMatrix();
                renderer.setSize(newSize, newSize);
                canvas.style.width = newSize + 'px';
                canvas.style.height = newSize + 'px';
                
                // Wait for CSS transition to start, then update 3D content
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Recreate text with new size
                        createTextMesh();
                        
                        // Update torus size
                        if (torusMesh) {
                            const torusRadius = Math.max(2.0, Math.min(3.0, 3.0 * (window.innerWidth / 1200)));
                            const newTorusGeometry = new THREE.TorusGeometry(torusRadius, 0.3, 16, 100);
                            torusMesh.geometry.dispose();
                            torusMesh.geometry = newTorusGeometry;
                        }
                        
                        // Fade back in after content is updated
                        setTimeout(() => {
                            canvas.style.transition = 'opacity 0.25s ease-in';
                            canvas.style.opacity = '1';
                            container.classList.remove('resizing');
                            isResizing = false;
                        }, 50);
                    });
                });
            }, 250); // Debounce for smoother feel
        });
        
        addMouseInteraction();
        animate();
    }
    
    function createTextFallback() {
        // Fallback text using basic shapes if font loading fails
        const group = new THREE.Group();
        
        // Create simple letter shapes (basic representation)
        // "Féliz Luberne" - 13 characters including space
        const text = 'Féliz Luberne';
        const letters = text.split('');
        letters.forEach((letter, index) => {
            if (letter === ' ') {
                // Skip spaces
                return;
            }
            const geometry = new THREE.BoxGeometry(0.8, 1.3, 0.4);
            const material = new THREE.MeshStandardMaterial({
                color: 0x000000, // Black color
                emissive: 0x111111, // Slight emissive
                metalness: 0.3,
                roughness: 0.4
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (index - 6) * 0.7;
            mesh.castShadow = true;
            group.add(mesh);
        });
        
        textMesh = group;
        scene.add(textMesh);
    }
    
    function addMouseInteraction() {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }
    
    function animate() {
        if (!scene || !renderer) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        time += 0.016; // ~60fps
        
        // Smooth mouse interpolation
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Rotate camera based on mouse (orbit around the scene)
        camera.position.x = Math.sin(targetX * 0.5) * 2;
        camera.position.y = targetY * 2;
        camera.lookAt(0, 0, 0);
        
        // Animate torus rotation
        if (torusMesh) {
            torusMesh.rotation.y = time * 0.3;
            torusMesh.rotation.z = Math.sin(time * 0.2) * 0.1;
            
            // Animate IOR for "woosh" effect (as shown in tutorial)
            const iorMin = 1.07;
            const iorMax = 1.5;
            const pausePhase = 2.0; // seconds
            const oscillationPhase = 1.5; // seconds
            const totalPhase = pausePhase + oscillationPhase;
            const phaseTime = (time % totalPhase);
            
            let currentIOR;
            if (phaseTime < pausePhase) {
                // Pause phase
                currentIOR = iorMin;
            } else {
                // Oscillation phase - smooth transition
                const oscillationTime = phaseTime - pausePhase;
                const t = oscillationTime / oscillationPhase;
                currentIOR = iorMin + (iorMax - iorMin) * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
            }
            
            torusMesh.material.ior = currentIOR;
        }
        
        // Rotate text slightly with more dynamic movement for liquid effect
        if (textMesh) {
            textMesh.rotation.y = Math.sin(time * 0.15) * 0.15;
            textMesh.rotation.x = Math.cos(time * 0.12) * 0.05;
            // Subtle scale animation for liquid feel
            const scaleVariation = 1 + Math.sin(time * 0.2) * 0.02;
            textMesh.scale.set(scaleVariation, scaleVariation, scaleVariation);
        }
        
        // Render
        renderer.render(scene, camera);
        
        animationId = requestAnimationFrame(animate);
    }
})();
