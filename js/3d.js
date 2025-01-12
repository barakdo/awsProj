var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, 600);  // Set size based on the window size (or any custom size you prefer)
renderer.setPixelRatio(window.devicePixelRatio);  // Set pixel ratio to ensure higher resolution rendering
document.getElementById('ring').appendChild(renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xFFD700, 1);
directionalLight.position.set(0, 5, 5).normalize();
scene.add(directionalLight);

var spotLight = new THREE.SpotLight(0xFFFFFF, 2, 10, Math.PI / 4, 0.1, 1);
spotLight.position.set(0, 3, 3);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);
scene.add(spotLight.target);

var backLight1 = new THREE.PointLight(0xFFD700, 1, 15, 2);
backLight1.position.set(-3, 2, -2);
scene.add(backLight1);

var backLight2 = new THREE.PointLight(0xFF1493, 0.5, 15, 2);
backLight2.position.set(3, -2, -2);
scene.add(backLight2);

var backLight3 = new THREE.PointLight(0x87CEFA, 0.4, 15, 2);
backLight3.position.set(0, -3, -3);
scene.add(backLight3);

camera.position.set(0, 0, 5);

var loader = new THREE.GLTFLoader();
loader.load('models/ring.glb', function (gltf) {
    var ring = gltf.scene;
    scene.add(ring);

    // Function to update canvas size and camera aspect ratio based on the container size
    function updateCanvasSize() {
        const ringElement = document.getElementById('ring');
        const width = ringElement.clientWidth;
        const height = ringElement.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Set initial canvas size
    updateCanvasSize();

    // Adjust canvas size when the window is resized
    window.addEventListener('resize', updateCanvasSize);

    ring.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xFFD700,
                metalness: 0.9,
                roughness: 0.2,
                emissive: 0xFFFFFF,
                emissiveIntensity: 0.1
            });
        }
    });

    var diamondMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.05,
        metalness: 0.9,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.3
    });

    ring.traverse(function (child) {
        if (child.name === 'diamond') {
            child.material = diamondMaterial;
        }
    });

    var box = new THREE.Box3().setFromObject(ring);
    var size = new THREE.Vector3();
    box.getSize(size);

    var scaleFactor = 5 / Math.max(size.x, size.y, size.z);
    ring.scale.set(scaleFactor, scaleFactor, scaleFactor);

    ring.rotation.set(5, 0.3, 0);
    ring.position.set(0, -0.5, 0);

    function animate() {
        requestAnimationFrame(animate);
        ring.rotation.z += 0.005;
        ring.rotation.x = 5.301;
        var time = Date.now() * 0.002;
        var intensity = Math.sin(time) * 0.5 + 1.5;
        spotLight.intensity = intensity;
        renderer.render(scene, camera);
    }

    animate();
}, undefined, function (error) {
    console.error('Error loading the 3D model:', error);
});
