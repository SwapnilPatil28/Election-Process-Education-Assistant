// Application State
const state = {
    history: [],
    theme: 'dark',
    language: 'en'
};

// Initialize Everything 
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageToggle();
    initGSAPAnimations();
    initThreeJS();
    initChatbot();
    initVoiceInput();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// --- Theme Management ---
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    toggleBtn.addEventListener('click', () => {
        if (state.theme === 'dark') {
            htmlEl.classList.remove('dark-theme');
            htmlEl.classList.add('light-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            state.theme = 'light';
        } else {
            htmlEl.classList.remove('light-theme');
            htmlEl.classList.add('dark-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            state.theme = 'dark';
        }
    });
}

// --- Language & Translation Management ---
function initLanguageToggle() {
    const toggleBtn = document.getElementById('lang-toggle');
    
    toggleBtn.addEventListener('click', () => {
        state.language = state.language === 'en' ? 'hi' : 'en';
        applyTranslations();
    });
}

function applyTranslations() {
    // Determine target translation map based on current state
    const t = translations[state.language];
    if (!t) return;

    // Direct element references needing placeholder or title updates
    const userInput = document.getElementById('user-input');
    const toggleBtn = document.getElementById('lang-toggle');

    // Update all static UI Elements featuring `data-i18n` attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Apply specific localized placeholders / ARIA metadata
    userInput.placeholder = t['ai-placeholder'];
    toggleBtn.title = state.language === 'hi' ? 'Switch to English' : 'Switch Language (ENG | HI)';

    // Visual feedback for the active toggle button
    if (state.language === 'hi') {
        toggleBtn.classList.add('active-lang');
        toggleBtn.style.color = '#3b82f6'; 
    } else {
        toggleBtn.classList.remove('active-lang');
        toggleBtn.style.color = '';
    }
}

// --- Voice Recognition (Web Speech API) ---
function initVoiceInput() {
    const micBtn = document.querySelector('.mic-btn');
    const userInput = document.getElementById('user-input');
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        micBtn.addEventListener('click', () => {
            // Abort current recording or toggle it off? Let's just start for now
            // Or maybe check if already recognizing
            
            // Respect the language toggle state dynamically for speech processing
            recognition.lang = state.language === 'en' ? 'en-US' : 'hi-IN';
            
            micBtn.style.color = '#ef4444'; // Red color indicating recording
            micBtn.style.animation = 'pulsing 1.5s infinite'; 
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value += transcript + " ";
            resetMicBtn();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            resetMicBtn();
            // Provide a user friendly message in case of an error if needed. For now keeping silent fallback to console.
            userInput.placeholder = "Mic Error! Please try again.";
            setTimeout(() => { applyTranslations(); }, 2000); // Revert to valid placeholder
        };

        recognition.onend = () => {
            resetMicBtn();
            // Automatically focus input after speech
            userInput.focus();
        };

        function resetMicBtn() {
            micBtn.style.color = '';
            micBtn.style.animation = '';
        }
        
    } else {
        micBtn.style.display = 'none'; // Hide if browser doesn't support Web Speech API
        console.warn('Speech Recognition not supported in this browser.');
    }
}

// --- GSAP Scroll Animations ---
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Timeline
    gsap.from('.hero-content h1', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { duration: 1, y: 50, opacity: 0, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-ctas', { duration: 1, y: 50, opacity: 0, delay: 0.4, ease: 'power3.out' });

    // Timeline Visualization
    gsap.to('.timeline-line', {
        scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        },
        height: '100%',
        ease: 'none'
    });

    const nodes = gsap.utils.toArray('.timeline-node');
    nodes.forEach((node, i) => {
        const direction = node.classList.contains('left') ? -50 : 50;
        gsap.fromTo(node, 
            { opacity: 0, x: direction }, 
            { 
                scrollTrigger: {
                    trigger: node,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                },
                opacity: 1, x: 0, ease: 'back.out(1.7)'
            }
        );
    });

    // Cards staggered entry
    gsap.from('.interactive', {
        scrollTrigger: { trigger: '.journey-section', start: 'top 70%' },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    });
}

// --- Three.js Holographic Ballot Box ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a stylized box representing a ballot box
    const geometry = new THREE.BoxGeometry(2, 2.5, 2);
    // Add wireframe material for futuristic look
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
    });
    
    // Add wireframe outer shell
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    const cube = new THREE.Mesh(geometry, material);
    cube.add(wireframe);
    scene.add(cube);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x60a5fa, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 6;

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = function () {
        requestAnimationFrame(animate);
        
        // Gentle auto rotation
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
        
        // Reactive mouse rotation
        cube.rotation.x += (mouseY * 0.5 - cube.rotation.x) * 0.05;
        cube.rotation.y += (mouseX * 0.5 - cube.rotation.y) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- Enhanced Chatbot Logic ---
function initChatbot() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const tagBtns = document.querySelectorAll('.tag-btn');
    const clearBtn = document.getElementById('clear-chat');
    
    // Initialize marked options safely
    marked.setOptions({ breaks: true, gfm: true });

    // Presets from sidebar
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-preset');
            userInput.value = prompt;
            userInput.focus();
        });
    });

    // Clear Chat
    clearBtn.addEventListener('click', () => {
        state.history = [];
        chatHistory.innerHTML = `
            <div class="message assistant-message slide-up" id="welcome-message-bubble">
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-content" data-i18n="ai-welcome">${translations[state.language]['ai-welcome']}</div>
            </div>`;
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        // UI Reset
        userInput.value = '';
        appendMessage('user', text);
        state.history.push({ role: 'user', text });

        const loadingId = appendLoading();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text, 
                    history: state.history, 
                    language: state.language 
                }) // Limit history safely if needed
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Server connection error');
            }
            
            const data = await response.json();
            
            document.getElementById(loadingId).remove();
            appendMessage('assistant', data.answer);
            state.history.push({ role: 'assistant', text: data.answer });
            
        } catch (err) {
            document.getElementById(loadingId).remove();
            appendMessage('assistant', `⚠️ ${err.message || "Connection interrupted. Please ensure the server is running properly."}`);
        }
    });

    function appendMessage(role, rawContent) {
        const div = document.createElement('div');
        div.className = `message ${role}-message slide-up`;
        
        const avatar = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
        const content = role === 'assistant' ? marked.parse(rawContent) : rawContent;
        
        div.innerHTML = `
            <div class="avatar">${avatar}</div>
            <div class="msg-content">${content}</div>
        `;
        
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendLoading() {
        const id = 'loader-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = `message assistant-message`;
        div.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-content">
                <div style="display:flex; gap:5px; align-items:center">
                    Generating insights <div class="pulse" style="width:6px; height:6px"></div>
                </div>
            </div>
        `;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return id;
    }
}
