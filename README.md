# Aura Learn 🚀

An interactive, AI-powered coding and learning platform featuring Gemini integration, in-browser Python execution (Pyodide), Monaco Editor, and interactive 3D visualizations.

## ✨ Features

- **Interactive Practice Court**: Write, test, and run code with immediate feedback.
- **AI Mentorship & Guidance**: Integrated with Google Gemini AI for smart code explanations, hints, and debugging.
- **In-Browser Python Execution**: Powered by Pyodide to execute Python code safely and client-side.
- **Monaco Code Editor**: Full-featured code editor with syntax highlighting and autocompletion.
- **Modern 3D Visualizations**: Built with React Three Fiber and Three.js.
- **Fluid & Modern UI**: Animated with Framer Motion, styled with modern CSS and Tailwind.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **AI**: `@google/genai` (Google Gemini)
- **Editor**: `@monaco-editor/react`
- **Execution Engine**: `pyodide`
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`
- **State Management**: `zustand`
- **Icons & Styling**: Lucide React, Tailwind CSS, Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yashmangade-1923/aura-learn.git
   cd aura-learn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and configure your API key:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📄 License

MIT
