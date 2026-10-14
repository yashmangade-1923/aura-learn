import React, { useState, useEffect } from 'react';
import { Terminal, Play, Loader2, Trash2, Code, FileJson, ChevronRight, RotateCcw, Globe, Sun, Moon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './PracticeCourt.css';

const DEFAULT_CODE = {
  javascript: '/**\n * Welcome to AuraLearn Playground!\n */\n\nfunction greet(name) {\n  return `Hello, ${name}! Ready to code?`;\n}\n\nconsole.log(greet("Hacker"));\n',
  typescript: '/**\n * Welcome to AuraLearn TypeScript Playground!\n */\n\nfunction greet(name: string): string {\n  return `Hello, ${name}! Ready to code?`;\n}\n\nconsole.log(greet("Hacker"));\n',
  python: '# Welcome to AuraLearn Playground!\n\ndef greet(name):\n    return f"Hello, {name}! Ready to code?"\n\nprint(greet("Hacker"))\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, AuraLearn! Ready to code?");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, AuraLearn! Ready to code?" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, AuraLearn! Ready to code?\\n");\n    return 0;\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, AuraLearn! Ready to code?");\n    }\n}',
  rust: 'fn main() {\n    println!("Hello, AuraLearn! Ready to code?");\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, AuraLearn! Ready to code?")\n}',
  ruby: '# Welcome to AuraLearn Playground!\n\ndef greet(name)\n  "Hello, #{name}! Ready to code?"\nend\n\nputs greet("Hacker")',
  php: '<?php\n// Welcome to AuraLearn Playground!\n\nfunction greet($name) {\n    return "Hello, $name! Ready to code?";\n}\n\necho greet("Hacker") . "\\n";\n?>',
  swift: 'import Foundation\n\nfunc greet(name: String) -> String {\n    return "Hello, \\(name)! Ready to code?"\n}\n\nprint(greet(name: "Hacker"))',
  bash: '#!/bin/bash\n# Welcome to AuraLearn Playground!\n\nNAME="Hacker"\necho "Hello, $NAME! Ready to code?"',
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body {\n      font-family: system-ui, sans-serif;\n      text-align: center;\n      color: white;\n      background: linear-gradient(135deg, #1e1e2e, #2a2a40);\n      padding: 40px;\n      margin: 0;\n      height: 100vh;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n    }\n    h1 { color: #00ffcc; text-shadow: 0 0 10px rgba(0,255,204,0.5); }\n    button {\n      padding: 12px 24px;\n      background: #00ffcc;\n      border: none;\n      border-radius: 8px;\n      font-weight: bold;\n      font-size: 16px;\n      cursor: pointer;\n      transition: transform 0.2s, box-shadow 0.2s;\n    }\n    button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,255,204,0.3); }\n  </style>\n</head>\n<body>\n  <h1>Welcome to Aura Web!</h1>\n  <p>Write your HTML, CSS, and JS right here.</p>\n  <button onclick="alert(\'Welcome to frontend dev!\')">Click Me</button>\n</body>\n</html>',
  react: `function App() {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div style={{ padding: '40px', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', background: 'linear-gradient(135deg, #1e1e2e, #181824)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>\n      <h1 style={{ color: '#00ffcc', textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>React Playground</h1>\n      <p style={{ opacity: 0.8 }}>Build your UI components here!</p>\n      <button \n        onClick={() => setCount(c => c + 1)}\n        style={{ padding: '12px 24px', background: '#00ffcc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,255,204,0.2)' }}\n      >\n        Clicks: {count}\n      </button>\n    </div>\n  );\n}\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`
};

const PracticeCourt = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedCompiler, setSelectedCompiler] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState('');
  const [webPreview, setWebPreview] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Fetch available languages from Wandbox API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch('https://wandbox.org/api/list.json');
        const data = await res.json();
        
        // Define the languages we want to support and their preferred compiler prefixes
        const supported = {
          'javascript': 'nodejs-',
          'typescript': 'typescript-',
          'python': 'cpython-3',
          'java': 'openjdk-jdk-22',
          'cpp': 'gcc-13',
          'c': 'gcc-13', // C compilers end with -c, we will handle this below
          'csharp': 'mono-',
          'rust': 'rust-1',
          'go': 'go-1',
          'ruby': 'ruby-3',
          'php': 'php-8',
          'swift': 'swift-6',
          'bash': 'bash'
        };

        const uniqueLangs = [];
        
        // For each supported language, find the matching compiler
        Object.entries(supported).forEach(([langKey, prefix]) => {
          let compiler;
          if (langKey === 'c') {
            // Find a GCC compiler specifically for C (name ends with '-c' on Wandbox)
            compiler = data.find(c => c.name.startsWith(prefix) && c.name.endsWith('-c'));
          } else if (langKey === 'cpp') {
            // Find a GCC compiler for C++ (avoid '-c' versions)
            compiler = data.find(c => c.name.startsWith(prefix) && !c.name.endsWith('-c'));
          } else {
            compiler = data.find(c => c.name.startsWith(prefix));
          }

          if (compiler) {
            uniqueLangs.push({
              id: langKey,
              name: compiler.language === 'Bash script' ? 'Bash' : compiler.language,
              compiler: compiler.name,
              version: compiler.version || compiler.name.replace(prefix, '')
            });
          }
        });

        // Ensure C++ displays properly in UI if name from API is weird
        uniqueLangs.forEach(lang => {
          if (lang.id === 'cpp') lang.name = 'C++';
          if (lang.id === 'csharp') lang.name = 'C#';
        });

        uniqueLangs.sort((a, b) => a.name.localeCompare(b.name));

        // Manually inject Frontend Web Development languages
        uniqueLangs.unshift(
          { id: 'html', name: 'HTML / CSS / JS', compiler: 'browser', version: 'Web' },
          { id: 'react', name: 'React (JSX)', compiler: 'browser', version: '18.x' }
        );

        setLanguages(uniqueLangs);
        
        const jsRuntime = uniqueLangs.find(l => l.id === 'javascript');
        if (jsRuntime) setSelectedCompiler(jsRuntime.compiler);
        
      } catch (err) {
        console.error("Failed to fetch compilers:", err);
        setOutput("System Error: Could not connect to code execution engine.\nPlease check your internet connection.");
        setIsError(true);
      }
    };
    fetchLanguages();
  }, []);

  const handleLanguageChange = (e) => {
    const langId = e.target.value;
    setSelectedLanguage(langId);
    
    const runtime = languages.find(l => l.id === langId);
    if (runtime) setSelectedCompiler(runtime.compiler);

    if (DEFAULT_CODE[langId]) {
      setCode(DEFAULT_CODE[langId]);
    } else {
      setCode(`// Start coding...\n`);
    }
    
    clearOutput();
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const clearOutput = () => {
    setOutput('');
    setWebPreview('');
    setExecutionTime(null);
    setIsError(false);
  };

  const resetCode = () => {
    if (DEFAULT_CODE[selectedLanguage]) {
      setCode(DEFAULT_CODE[selectedLanguage]);
    }
    clearOutput();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const runCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setIsError(false);
    setExecutionTime(null);

    // Handle Frontend Browser execution
    if (selectedLanguage === 'html') {
      setWebPreview(code);
      setIsRunning(false);
      return;
    }

    if (selectedLanguage === 'react') {
      const reactTemplate = `<!DOCTYPE html>
<html>
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { margin: 0; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
  </script>
</body>
</html>`;
      setWebPreview(reactTemplate);
      setIsRunning(false);
      return;
    }

    // Handle Backend API execution
    setOutput('Compiling and executing...');
    const startTime = Date.now();

    try {
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: selectedCompiler,
          code: code,
          save: false
        })
      });

      const data = await response.json();
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      // Wandbox returns status "0" or 0 for success
      if (data.status == 0) {
        let finalOut = "";
        if (data.program_message) finalOut += data.program_message;
        setOutput(finalOut || "Execution completed with no output.");
        setIsError(false);
      } else {
        let errOut = "";
        if (data.compiler_error) errOut += `Compiler Error:\n${data.compiler_error}\n`;
        if (data.program_error) errOut += `Runtime Error:\n${data.program_error}\n`;
        if (data.program_message) errOut += `Output:\n${data.program_message}`;
        setOutput(errOut || "Execution Failed.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setOutput("System Error: Failed to execute code.\nThe execution engine might be temporarily unavailable.");
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  // Ensure proper syntax highlighting map
  const getMonacoLanguage = (lang) => {
    const map = {
      'c++': 'cpp',
      'c#': 'csharp',
      'node': 'javascript',
      'python3': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'rs': 'rust',
      'react': 'javascript'
    };
    return map[lang] || lang;
  };

  const isWebMode = selectedLanguage === 'html' || selectedLanguage === 'react';

  return (
    <div className={`practice-court-container ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      {/* Editor Header / Toolbar */}
      <div className="court-header">
        <div className="court-title">
          <Code size={22} className="theme-accent" />
          <span>AuraEditor <span className="version-tag">PRO</span></span>
        </div>
        
        <div className="controls">
          <div className="language-selector-wrapper">
            <FileJson size={16} className="lang-icon" />
            <select 
              className="language-select" 
              value={selectedLanguage} 
              onChange={handleLanguageChange}
              title="Select Programming Language"
            >
              {languages.length === 0 ? (
                <option value="javascript">Loading languages...</option>
              ) : (
                languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name} ({lang.version})
                  </option>
                ))
              )}
            </select>
          </div>

          <button 
            className="btn-icon theme-toggle" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="btn-icon reset-btn" 
            onClick={resetCode} 
            title="Reset Code to Default"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            className="btn-run" 
            onClick={runCode} 
            disabled={isRunning || languages.length === 0}
            title="Execute Code"
          >
            {isRunning ? <Loader2 size={16} className="loading-spinner" /> : <Play size={16} />}
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>
      
      <div className="court-body">
        {/* Monaco Editor Pane */}
        <div className="editor-pane">
          <Editor
            height="100%"
            width="100%"
            language={getMonacoLanguage(selectedLanguage)}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={code}
            onChange={handleEditorChange}
            loading={
              <div className="editor-loading">
                <Loader2 size={24} className="loading-spinner theme-accent" />
                <span>Initializing Editor Core...</span>
              </div>
            }
            options={{
              automaticLayout: true, // Fixes the issue where editor breaks on resize/load
              minimap: { enabled: true, scale: 0.75 },
              fontSize: 15,
              fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
              fontLigatures: true,
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
              wordWrap: "on",
              lineHeight: 1.6,
            }}
          />
        </div>
        
        {/* Output Terminal Pane */}
        <div className="output-pane">
          <div className="output-header">
            <div className="flex items-center gap-2">
              {isWebMode ? (
                <><Globe size={16} className="output-icon" /> <span className="output-title">Browser Preview</span></>
              ) : (
                <><Terminal size={16} className="output-icon" /> <span className="output-title">Terminal</span></>
              )}
              
              {executionTime && !isWebMode && (
                <span className="execution-time">
                  Executed in {executionTime}ms
                </span>
              )}
            </div>
            <div className="output-actions">
              <button onClick={clearOutput} className="btn-icon trash-btn" title="Clear Console">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="output-container">
            {isWebMode ? (
              webPreview ? (
                <iframe 
                  srcDoc={webPreview} 
                  title="web-preview"
                  className="web-preview-iframe"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="output-placeholder web-placeholder">
                  <Globe size={48} className="placeholder-icon" />
                  <p>Click Run to launch the browser preview.</p>
                </div>
              )
            ) : (
              <div className="output-content">
                {output ? (
                  <div className={`terminal-output ${isError ? 'output-error' : 'output-success'}`}>
                    {output.split('\n').map((line, i) => (
                      <div key={i} className="output-line">
                        <span className="prompt-arrow"><ChevronRight size={14}/></span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="output-placeholder">
                    <div className="ascii-art">
                      {`>_ SYSTEM READY`}
                    </div>
                    <p>Awaiting execution commands...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeCourt;
