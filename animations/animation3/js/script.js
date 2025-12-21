// Animation 3 - Gradient Text Animation
// Inspired by "NEVER STOP DREAM" style

(function() {
    'use strict';

    let scene, camera, renderer;
    let textMeshes = [];
    let time = 0;
    let animationId;
    let fontLoader, font;
    let mouseX = 0, mouseY = 0;

    // Wait for DOM and Three.js to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Wait for Three.js to be available
        function checkThree() {
            if (typeof THREE !== 'undefined') {
                fontLoader = new THREE.FontLoader();
                fontLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json',
                    function (loadedFont) {
                        font = loadedFont;
                        createScene();
                        animate();
                    },
                    undefined,
                    function (err) {
                        console.error('An error happened loading the font:', err);
                        // Fallback if font fails to load
                        createScene();
                        animate();
                    }
                );
            } else {
                setTimeout(checkThree, 50);
            }
        }
        checkThree();
    }

    function createScene() {
        const container = document.createElement('div');
        container.className = 'text-3d-container';

        const width = Math.max(400, Math.min(window.innerWidth, 1600));
        const height = Math.max(300, Math.min(window.innerHeight, 1200));

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Black background

        // Camera
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 15);

        // Renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1);

        const canvas = renderer.domElement;
        canvas.className = 'text-3d-canvas';
        container.appendChild(canvas);

        // Create gradient text "FELIZ LUBERNE"
        const text = 'FELIZ LUBERNE';
        const words = text.split(' ');
        
        // Color palette for gradients (neon pink, orange, yellow, blue) - matching the inspiration
        const colors = [
            new THREE.Color(0xff00ff), // Bright Pink
            new THREE.Color(0xff6600), // Orange
            new THREE.Color(0xffff00), // Yellow
            new THREE.Color(0x00ffff), // Cyan/Blue
            new THREE.Color(0xff00aa), // Magenta
            new THREE.Color(0xffaa00), // Orange-Yellow
        ];

        let yOffset = words.length * 0.9 + 0.5; // Start from top, slightly higher
        words.forEach((word, wordIndex) => {
            yOffset -= 1.8; // Space between words
            
            // Create each letter in the word
            word.split('').forEach((letter, letterIndex) => {
                if (font) {
                    // Calculate responsive letter size based on viewport width
                    const baseSize = 1.5;
                    const responsiveSize = Math.min(baseSize, Math.max(0.6, baseSize * (window.innerWidth / 1200)));
                    
                    const textGeometry = new THREE.TextGeometry(letter, {
                        font: font,
                        size: responsiveSize, // Responsive size
                        height: 0.2 * (responsiveSize / baseSize), // Scale depth proportionally
                        curveSegments: 16,
                        bevelEnabled: true,
                        bevelThickness: 0.08 * (responsiveSize / baseSize),
                        bevelSize: 0.08 * (responsiveSize / baseSize),
                        bevelOffset: 0,
                        bevelSegments: 8
                    });

                    textGeometry.computeBoundingBox();
                    const centerOffsetX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
                    const centerOffsetY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);

                    // Create gradient material for each letter
                    // Each letter gets a different color from the palette with smooth transitions
                    const colorIndex = (wordIndex * word.length + letterIndex) % colors.length;
                    const nextColorIndex = (colorIndex + 1) % colors.length;
                    const baseColor = colors[colorIndex].clone();
                    const nextColor = colors[nextColorIndex].clone();

                    // Create material with gradient effect - more transparent for overlap blending
                    const material = new THREE.MeshStandardMaterial({
                        color: baseColor,
                        emissive: baseColor,
                        emissiveIntensity: 0.8, // Higher emissive for neon glow
                        transparent: true,
                        opacity: 0.7, // More transparent for better color blending on overlap
                        metalness: 0.1,
                        roughness: 0.3,
                        side: THREE.DoubleSide
                    });

                    // Add vertex colors for gradient effect within each letter
                    const positions = textGeometry.attributes.position;
                    const colorsArray = [];
                    const center = new THREE.Vector3();
                    textGeometry.computeBoundingBox();
                    center.addVectors(
                        textGeometry.boundingBox.min,
                        textGeometry.boundingBox.max
                    ).multiplyScalar(0.5);
                    
                    for (let i = 0; i < positions.count; i++) {
                        const vertex = new THREE.Vector3();
                        vertex.fromBufferAttribute(positions, i);
                        const distance = vertex.distanceTo(center);
                        const maxDist = textGeometry.boundingBox.max.distanceTo(center);
                        const t = distance / maxDist;
                        const color = new THREE.Color().lerpColors(baseColor, nextColor, t);
                        colorsArray.push(color.r, color.g, color.b);
                    }
                    textGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));
                    material.vertexColors = true;

                    const letterMesh = new THREE.Mesh(textGeometry, material);
                    
                    // Position letters with upward tilt and overlap (like in inspiration)
                    const xOffset = (letterIndex - word.length / 2) * 1.1; // Increased spacing
                    const tilt = 0.15; // Upward tilt from left to right
                    letterMesh.position.set(
                        xOffset + (yOffset * tilt), // Tilt effect
                        yOffset + (xOffset * tilt * 0.2),
                        (letterIndex % 3) * 0.05 // Subtle depth variation for overlap
                    );
                    
                    // Store original position and rotation for collision system
                    letterMesh.userData.originalPosition = letterMesh.position.clone();
                    letterMesh.userData.originalRotation = {
                        z: letterMesh.rotation.z,
                        x: letterMesh.rotation.x,
                        y: letterMesh.rotation.y || 0
                    };
                    letterMesh.userData.basePosition = letterMesh.position.clone();
                    
                    // Initialize scale
                    letterMesh.scale.set(1, 1, 1);
                    
                    // Slight rotation for dynamic feel
                    letterMesh.rotation.z = Math.sin(letterIndex * 0.5) * 0.03;
                    
                    scene.add(letterMesh);
                    textMeshes.push(letterMesh);
                }
            });
        });

        // Add lights for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-5, 3, -5);
        scene.add(directionalLight2);

        // Insert into content-layer
        const contentLayer = document.querySelector('.content-layer');
        if (contentLayer) {
            contentLayer.insertBefore(container, contentLayer.firstChild);
        } else {
            document.body.appendChild(container);
        }

        // Handle resize
        window.addEventListener('resize', () => {
            const newWidth = Math.max(400, Math.min(window.innerWidth, 1600));
            const newHeight = Math.max(300, Math.min(window.innerHeight, 1200));
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });
        
        // Mouse interaction for collision detection
        addMouseInteraction();
    }

    function addMouseInteraction() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            // Convert mouse position to normalized device coordinates (-1 to +1)
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        // Reset mouse position when leaving canvas
        document.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function animate() {
        if (!scene || !renderer) {
            animationId = requestAnimationFrame(animate);
            return;
        }

        time += 0.016; // ~60fps

        // Animate letters with smooth dynamic movement and violent collision detection
        textMeshes.forEach((mesh, index) => {
            const basePos = mesh.userData.basePosition || mesh.userData.originalPosition;
            const baseRot = mesh.userData.originalRotation || { z: 0, x: 0, y: 0 };
            
            // Calculate distance from cursor outer circle to letter in 3D space
            let distance;
            let collisionRadius = 2.5; // Default collision radius in 3D space (increased)
            let dx, dy;
            let cursorWorldX, cursorWorldY;
            
            // Use custom cursor if available (outer circle radius)
            if (window.customCursor && window.customCursor.x !== undefined && window.customCursor.y !== undefined) {
                // Get canvas bounding rect for accurate coordinate conversion
                const rect = renderer.domElement.getBoundingClientRect();
                
                // Convert cursor screen position to normalized device coordinates (-1 to +1)
                const cursorScreenX = ((window.customCursor.x - rect.left) / rect.width) * 2 - 1;
                const cursorScreenY = -((window.customCursor.y - rect.top) / rect.height) * 2 + 1;
                
                // Project cursor position to 3D space at the letter's Z depth
                const cursor3D = new THREE.Vector3(cursorScreenX, cursorScreenY, 0.5);
                cursor3D.unproject(camera);
                
                const dir = cursor3D.sub(camera.position).normalize();
                const distanceToLetter = (mesh.position.z - camera.position.z) / dir.z;
                const cursorWorld = camera.position.clone().add(dir.multiplyScalar(distanceToLetter));
                
                cursorWorldX = cursorWorld.x;
                cursorWorldY = cursorWorld.y;
                
                // Convert cursor radius from pixels to 3D space
                // Calculate radius by projecting two points (center and edge) to 3D space
                const cursorScreenX1 = ((window.customCursor.x - window.customCursor.radius - rect.left) / rect.width) * 2 - 1;
                const cursorScreenX2 = ((window.customCursor.x + window.customCursor.radius - rect.left) / rect.width) * 2 - 1;
                
                const cursor3D1 = new THREE.Vector3(cursorScreenX1, cursorScreenY, 0.5);
                const cursor3D2 = new THREE.Vector3(cursorScreenX2, cursorScreenY, 0.5);
                cursor3D1.unproject(camera);
                cursor3D2.unproject(camera);
                
                const dir1 = cursor3D1.sub(camera.position).normalize();
                const dir2 = cursor3D2.sub(camera.position).normalize();
                const distToLetter = (mesh.position.z - camera.position.z) / dir1.z;
                const world1 = camera.position.clone().add(dir1.multiplyScalar(distToLetter));
                const world2 = camera.position.clone().add(dir2.multiplyScalar(distToLetter));
                
                collisionRadius = Math.abs(world1.x - world2.x);
                
                // Increase collision radius by 50% for better detection
                collisionRadius = collisionRadius * 1.5;
                
                // Ensure reasonable collision radius (fallback if calculation fails)
                if (isNaN(collisionRadius) || collisionRadius < 0.5) collisionRadius = 2.0;
                if (collisionRadius > 4.5) collisionRadius = 4.5;
                
                dx = mesh.position.x - cursorWorldX;
                dy = mesh.position.y - cursorWorldY;
                distance = Math.sqrt(dx * dx + dy * dy);
            } else {
                // Fallback to mouse position
                const mouse3D = new THREE.Vector3(mouseX, mouseY, 0.5);
                mouse3D.unproject(camera);
                
                const dir = mouse3D.sub(camera.position).normalize();
                const distanceToLetter = (mesh.position.z - camera.position.z) / dir.z;
                const mouseWorld = camera.position.clone().add(dir.multiplyScalar(distanceToLetter));
                
                cursorWorldX = mouseWorld.x;
                cursorWorldY = mouseWorld.y;
                
                dx = mesh.position.x - cursorWorldX;
                dy = mesh.position.y - cursorWorldY;
                distance = Math.sqrt(dx * dx + dy * dy);
            }
            
            // Smooth varied floating animations - faster and more dynamic
            const speed1 = 1.0 + index * 0.08;
            const speed2 = 0.7 + index * 0.06;
            const speed3 = 1.2 + index * 0.1;
            const speed4 = 0.5 + index * 0.12;
            
            // Spiral movement (smoother)
            const spiralRadius = 0.18 + Math.sin(time * speed1 * 0.5 + index) * 0.08;
            const spiralAngle = time * speed2 + index * 0.5;
            const spiralX = Math.cos(spiralAngle) * spiralRadius;
            const spiralY = Math.sin(spiralAngle) * spiralRadius;
            
            // Wave movement (smoother)
            const waveX = Math.sin(time * speed3 + index * 0.3) * 0.22;
            const waveY = Math.cos(time * speed4 + index * 0.4) * 0.25;
            
            // Figure-8 movement (smoother)
            const figure8X = Math.sin(time * speed1 * 0.6) * 0.12;
            const figure8Y = Math.sin(time * speed1 * 0.6 * 2) * 0.18;
            
            // Combine different movement patterns for each letter
            const pattern = index % 4;
            let floatX, floatY;
            
            if (pattern === 0) {
                floatX = spiralX;
                floatY = spiralY;
            } else if (pattern === 1) {
                floatX = waveX;
                floatY = waveY;
            } else if (pattern === 2) {
                floatX = figure8X;
                floatY = figure8Y;
            } else {
                floatX = spiralX * 0.5 + waveX * 0.5;
                floatY = spiralY * 0.5 + figure8Y * 0.5;
            }
            
            // Smooth dynamic rotations
            const rotZ = Math.sin(time * speed1 + index * 0.2) * 0.1 + 
                        Math.cos(time * speed2 * 0.7 + index * 0.3) * 0.06;
            const rotX = Math.cos(time * speed3 + index * 0.25) * 0.08 + 
                        Math.sin(time * speed4 * 0.8 + index * 0.35) * 0.05;
            const rotY = Math.sin(time * speed1 * 0.5 + index * 0.15) * 0.04;
            
            // Target position with dynamic floating animation
            const targetX = basePos.x + floatX;
            const targetY = basePos.y + floatY;
            const targetZ = basePos.z;
            const targetRotZ = baseRot.z + rotZ;
            const targetRotX = baseRot.x + rotX;
            const targetRotY = baseRot.y + rotY;
            
            // Store target scale
            let targetScale = 1;
            let targetEmissive = 0.8;
            
            // Violent collision effect (with smooth interpolation)
            if (distance < collisionRadius && distance > 0.01) {
                // Calculate violent repulsion force (smooth curve)
                const normalizedDist = distance / collisionRadius;
                const force = 1 - normalizedDist; // Linear for smoother feel
                
                // Normalize direction vector
                let direction;
                if (dx === 0 && dy === 0) {
                    direction = new THREE.Vector3(1, 0, 0); // Default direction if at exact center
                } else {
                    direction = new THREE.Vector3(dx, dy, 0).normalize();
                }
                
                // Strong repulsion (letters fly away violently)
                const repulsionStrength = force * 1.5; // Increased for more visible effect
                const collisionOffsetX = direction.x * repulsionStrength;
                const collisionOffsetY = direction.y * repulsionStrength;
                
                // Smooth interpolation for collision position
                const collisionLerp = 0.4; // Smooth transition
                mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX + collisionOffsetX, collisionLerp);
                mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY + collisionOffsetY, collisionLerp);
                mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, basePos.z + Math.sin(force * Math.PI) * 0.25, collisionLerp);
                
                // Smooth violent rotation effect
                const targetCollisionRotZ = targetRotZ + direction.x * force * 0.7;
                const targetCollisionRotX = targetRotX - direction.y * force * 0.5;
                const targetCollisionRotY = targetRotY + force * 0.3;
                
                mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetCollisionRotZ, collisionLerp);
                mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetCollisionRotX, collisionLerp);
                mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetCollisionRotY, collisionLerp);
                
                // Smooth scale effect
                targetScale = 1 + force * 0.5;
                mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), collisionLerp);
                
                // Smooth emissive intensity
                targetEmissive = 0.8 + force * 1.0;
                mesh.material.emissiveIntensity = THREE.MathUtils.lerp(mesh.material.emissiveIntensity, targetEmissive, 0.3);
            } else {
                // Smooth movement with dynamic floating animation
                const moveSpeed = 0.25; // Smooth movement speed
                mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, moveSpeed);
                mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, moveSpeed);
                mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, moveSpeed);
                
                // Smooth rotation with dynamic animation
                mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotZ, moveSpeed);
                mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, moveSpeed);
                mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotY, moveSpeed);
                
                // Smooth scale return
                mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
                
                // Smooth color/emissive animation
                const colorShift = Math.sin(time * 0.7 + index * 0.25);
                targetEmissive = 0.8 + colorShift * 0.35;
                mesh.material.emissiveIntensity = THREE.MathUtils.lerp(mesh.material.emissiveIntensity, targetEmissive, 0.2);
            }
        });

        // Render
        renderer.render(scene, camera);

        animationId = requestAnimationFrame(animate);
    }
})();
