// main.js

// Create a scene and camera for Three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer and append it to the DOM
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);

// Add a point light to illuminate the model
var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(0, 200, 0);
scene.add(light);

// Set the camera position
camera.position.z = 5;

// Use 3DMLoader to load the .3dm jewelry model
var loader = new THREE.3DMLoader();
loader.load('models/jewelry.3dm', function (object) {
    // Add the loaded model to the scene
    scene.add(object);

    // Optionally, scale the model if needed
    object.scale.set(0.5, 0.5, 0.5); // scale the model down (adjust as necessary)
    
    // Optionally, set the rotation for the model
    object.rotation.set(0, Math.PI / 4, 0); // rotate the model to a better angle
}, undefined, function (error) {
    console.error('Error loading the 3D model: ', error);
});

// Animation loop to rotate the model
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Resize the renderer and camera on window resize
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
