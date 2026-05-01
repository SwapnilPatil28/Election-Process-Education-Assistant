# Democracy Guide | Immersive Election Process Platform

![Democracy Guide Banner](https://via.placeholder.com/1200x400/0f172a/3b82f6?text=Understanding+Elections,+Reimagined)

An **immersive, interactive, and intelligent platform** designed to completely reinvent how citizens learn about the electoral process. Far beyond a simple chatbot, this solution integrates 3D visualizations, scroll-driven animations, and a context-aware AI assistant to provide an "Apple-level polish" educational journey.

Built explicitly for the **Election Process Education** vertical challenge.

---

## 🎯 Chosen Vertical: Election Process Education
Our platform tackles the complexity of democratic processes—voter registration, absentee ballots, polling timelines, and eligibility rules—by breaking them down into visually stunning, digestible, and interactive modules. It operates strictly on factual, non-partisan data to empower every user.

## ✨ Core Features & Highlights

- **Immersive 3D Experience (Three.js)**: A futuristic, interactive, holographic ballot box element in the hero section reacting to cursor movement in real time.
- **Scroll-Driven Timelines (GSAP)**: Animated visual mapping of the electoral cycle tracking the Announcement, Campaign phases, Voting day, and Count process smoothly on scroll.
- **Voter Journey Simulator**: Step-by-step interactive cards outlining the path to casting a secure vote.
- **Enhanced AI Smart Assistant**: Powered by **Google Gemini 3 Flash Preview**, the UI now incorporates voice-mock interactions, Markdown parsing, instant suggested tags ("First-time Voter", "Absentee"), and session memory clear functionalities. 
- **Glassmorphism UI System**: A modern, Apple-inspired, cleanly engineered design offering smooth blur backdrops, gradient ambient orbs, fluid routing, and a dynamic Light/Dark mode toggle switch.
- **Accessibility & i18n Ready**: Thoughtful architecture implementing `aria` controls, simple typography via 'Space Grotesk', and a clear layout supporting a UI toggle for additional languages.

---

## 🛠 Tech Stack & Architecture

### **Frontend layer (V2 Overhaul)**
- **Vanilla JavaScript (ES6+)** with complete modularity.
- **CSS3 Variables & Animations** for native Dark/Light mode tracking, backdrop-filtering, and hardware-accelerated animations.
- **GSAP & ScrollTrigger** for scroll-jacking depth effects and timeline mapping.
- **Three.js** handling 3D wireframe manipulation natively in the DOM.
- **Marked.js** for securing and formatting Markdown output directly from the Gemini AI in the chat assistant.

### **Backend layer (V1)**
- **Node.js + Express.js** serving the single-page application static files.
- **Google Generative AI SDK (`@google/genai`)**: Connecting the user context to the `gemini-3-flash-preview` model. 
- **Jest & Supertest**: Guaranteeing endpoint API validation.

---

## 🚀 Setup Instructions

1. **Clone the Project**
   ```bash
   git clone <YOUR-GITHUB-REPO-URL>
   cd Election-Process-Education-Assistant
   ```

2. **Install Dependencies**
   Ensure you have Node.js 18+ installed. 
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Make a copy of the example environment file and insert your active API Key.
   ```bash
   # Add GEMINI_API_KEY="your-google-api-key"
   cp .env.example .env
   ```

4. **Launch the Experience**
   Start the Node server on localhost.
   ```bash
   npm start
   ```

   Visit `http://localhost:3000` in your web browser to enter the immersive platform.

5. **Run Integration Tests**
   ```bash
   npm test
   ```

---

## 🔒 Security & Best Practices

- **Zero-Storage Architecture**: Conversational logic runs exclusively in memory for the lifecycle of the session; no PII (Personally Identifiable Information) or tracking persists maliciously. User tags and memory clear buttons act directly on visual state.
- **Safe Environment Configuration**: Adhering strictly to `.gitignore` principles, sensitive Google Service Secrets are evaluated strictly server-side avoiding client spoofing.
- **Fallbacks**: Smooth disconnect messages if Gemini API limit ranges are exhausted.

---

## 🔮 Future Improvements
While this platform already executes on a high-tier production plane, future iterations could include:
- Native WebGL WebXR gamification of an actual voting booth.
- React.js conversion (with React Three Fiber) for stateful prop distribution across a massive global quiz database.
- Firebase integration for saving "Civic Learning" badges over persistent user accounts.

**Designed to revolutionize structural civic awareness.**