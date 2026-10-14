import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, BookOpen, Terminal, Code2, Home } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import './App.css';
import VideoBackground from './components/VideoBackground';
import PracticeCourt from './components/PracticeCourt';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "hey dear...., how can i help you?", type: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({ model: 'gemini-3.6-flash' });
        setChatSession(chat);
      }
    } catch (e) {
      console.error("Failed to initialize AI:", e);
    }
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userText = inputValue;
    setChatMessages(prev => [...prev, { text: userText, type: "user" }]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      if (!chatSession) {
        throw new Error("Chat not initialized. Missing API key.");
      }
      const response = await chatSession.sendMessage({ message: userText });
      setChatMessages(prev => [...prev, { 
        text: response.text, 
        type: "bot" 
      }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { 
        text: "Oop's! there is some issue. please try again later.....", 
        type: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <VideoBackground />

      {/* Navbar */}
      <nav className="navbar glass-panel glass-panel-interactive">
        <div className="logo" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
          <Terminal size={28} />
          <span>AuraLearn</span>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={() => setActivePage('home')} className={`flex items-center gap-2 ${activePage === 'home' ? 'active-link' : ''}`}><Home size={18}/> Home</a></li>
          <li><a href="#" className="flex items-center gap-2"><Code2 size={18}/> Playground</a></li>
          <li><a href="#" className="flex items-center gap-2"><BookOpen size={18}/> Study Material</a></li>
          <li><a href="#" onClick={() => setActivePage('practice')} className={`flex items-center gap-2 ${activePage === 'practice' ? 'active-link' : ''}`}><Terminal size={18}/> Practice Court</a></li>
        </ul>
      </nav>

      {activePage === 'home' ? (
        /* Hero Section */
        <main className="hero">
          <h1 className="hero-title typewriter-container">
            WELCOME TO : AURA-LEARN
          </h1>
          <p className="hero-subtitle sparkling-wave-text">
            Supercharge your tech journey! Dive straight into interactive 3D simulations, master skills through epic stories, and command the digital world one line of code at a time.
          </p>
          <button className="btn-primary flex items-center gap-2" onClick={() => setActivePage('practice')}>
            <Code2 size={20}/> Start Playing
          </button>
        </main>
      ) : activePage === 'practice' ? (
        <PracticeCourt />
      ) : null}

      {/* Chatbot Trigger Button */}
      <div className={`chatbot-trigger ${isChatOpen ? 'hidden' : ''}`} onClick={toggleChat} title="Open AI Companion">
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>

      {/* Slide-out Chatbot Panel */}
      <div className={`chatbot-panel glass-panel ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span>&gt;_ AURA-LEARN</span>
          <button className="close-chat" onClick={toggleChat}>
            <X size={20} />
          </button>
        </div>
        <div className="chat-body">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Ask a question..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
