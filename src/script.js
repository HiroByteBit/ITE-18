// Select the container element
const container = document.getElementById('container');

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Create initial cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x1E90FF }), // Blue
  new THREE.MeshStandardMaterial({ color: 0xFF4500 }), // Red
  new THREE.MeshStandardMaterial({ color: 0x32CD32 })  // Green
];

let currentMaterialIndex = 0;
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials[currentMaterialIndex]);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Interaction variables
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Handle clicks to change color or shape
function onClick() {
  currentMaterialIndex++;
  if (currentMaterialIndex < cubeMaterials.length) {
    cube.material = cubeMaterials[currentMaterialIndex];
  } else {
    // Change to a new geometric shape (tetrahedron)
    const newGeometry = new THREE.TetrahedronGeometry();
    cube.geometry.dispose(); // Clean up previous geometry
    cube.geometry = newGeometry;
    currentMaterialIndex = -1; // Stop further color changes
  }
}

// Dragging logic
function onMouseDown(event) {
  isDragging = true;
}

function onMouseUp() {
  isDragging = false;
}

function onMouseMove(event) {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.005;
    cube.rotation.y += deltaMove.x * rotationSpeed;
    cube.rotation.x += deltaMove.y * rotationSpeed;
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

// Event listeners
window.addEventListener('click', onClick);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
