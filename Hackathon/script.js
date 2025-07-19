function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    if (username && password) {
        localStorage.setItem(username, password);
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
    } else {
        alert('Please enter a username and password.');
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (localStorage.getItem(username) === password) {
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = 'chat.html';
    } else {
        alert('Invalid credentials. Try again.');
    }
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

if (!sessionStorage.getItem('loggedInUser') && window.location.pathname.includes('chat.html')) {
    window.location.href = 'login.html';
}

const API_KEY = 'AIzaSyAAqW48wgWJqNCmIr7-wqTY1ovyNeC27jM';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById('chatMessages');
    chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    input.value = '';

    const loadingMessage = document.createElement('p');
    loadingMessage.innerHTML = '<strong>Bot:</strong> Thinking...';
    chatBox.appendChild(loadingMessage);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        loadingMessage.innerHTML = `<strong>Bot:</strong> ${botResponse}`;
    } catch (error) {
        loadingMessage.innerHTML = '<strong>Bot:</strong> Error retrieving response.';
        console.error('API Error:', error);
    }
}

// 3D Animation Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x6c43ff, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

const light = new THREE.PointLight(0xffffff);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 30;

function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();