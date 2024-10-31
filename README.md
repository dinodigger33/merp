<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Chase Game</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/PointerLockControls.js"></script>
    <script>
        let scene, camera, renderer, player, controls, chaser;
        const objects = [];

        function init() {
            // Set up scene, camera, renderer
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Player
            player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
            player.position.y = 1;
            scene.add(player);
            camera.position.y = 1.6; // Camera height

            // Chaser (enemy entity)
            chaser = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
            chaser.position.set(5, 1, 5);
            scene.add(chaser);

            // Controls
            controls = new THREE.PointerLockControls(camera, document.body);
            document.body.addEventListener('click', () => {
                controls.lock();
            });

            // Add ground
            const ground = new THREE.Mesh(
                new THREE.PlaneGeometry(100, 100),
                new THREE.MeshBasicMaterial({color: 0x00ff88, side: THREE.DoubleSide})
            );
            ground.rotation.x = -Math.PI / 2;
            scene.add(ground);

            // Add objects to interact with
            for (let i = 0; i < 5; i++) {
                const object = new THREE.Mesh(
                    new THREE.BoxGeometry(1, 1, 1),
                    new THREE.MeshBasicMaterial({color: 0x0000ff})
                );
                object.position.set(Math.random() * 20 - 10, 1, Math.random() * 20 - 10);
                scene.add(object);
                objects.push(object);
            }

            // Animation loop
            animate();
        }

        let velocity = new THREE.Vector3();
        let speed = 0.1;
        let isJumping = false;

        function animate() {
            requestAnimationFrame(animate);

            // Simple chase mechanic
            const chaserSpeed = 0.02;
            chaser.lookAt(player.position);
            chaser.position.x += (player.position.x - chaser.position.x) * chaserSpeed;
            chaser.position.z += (player.position.z - chaser.position.z) * chaserSpeed;

            // Player movement
            if (controls.isLocked) {
                if (velocity.length() > 0) {
                    player.position.add(velocity.clone().multiplyScalar(speed));
                }
                camera.position.copy(player.position).y += 1.6;
            }

            // Gravity and jump logic
            if (player.position.y > 1) {
                velocity.y -= 0.01; // Gravity
                player.position.y += velocity.y;
                if (player.position.y < 1) {
                    player.position.y = 1;
                    isJumping = false;
                }
            }

            // Update object interactions
            objects.forEach((object, index) => {
                if (player.position.distanceTo(object.position) < 1.5) {
                    console.log(`Interacting with object ${index + 1}`);
                    object.material.color.set(0xffff00); // Change color on interaction
                }
            });

            renderer.render(scene, camera);
        }

        // Controls for movement and jump
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': velocity.z = -1; break;
                case 'KeyS': velocity.z = 1; break;
                case 'KeyA': velocity.x = -1; break;
                case 'KeyD': velocity.x = 1; break;
                case 'Space': // Jump
                    if (!isJumping) {
                        velocity.y = 0.2;
                        isJumping = true;
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': case 'KeyS': velocity.z = 0; break;
                case 'KeyA': case 'KeyD': velocity.x = 0; break;
            }
        });

        init();
    </script>
</body>
</html>

