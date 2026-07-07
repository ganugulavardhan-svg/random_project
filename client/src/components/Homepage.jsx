import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  Play, Lock, Terminal, Cpu, Shield, Sparkles, 
  ChevronRight, Activity, Wifi, X, Film, Image as ImageIcon,
  MessageSquare, Sliders, Database, Zap, RefreshCw, Send
} from 'lucide-react';
import level1Img from '../assets/level1.jpg';
import level2Img from '../assets/level2.jpg';
import level3Img from '../assets/level3.jpg';
import heroImg from '../assets/command_center.jpg';

// HTML5 Canvas Particle Component (Green + Yellow theme)
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = Math.min(70, Math.floor((width * height) / 13000));
    const mouse = { x: null, y: null, radius: 130 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.4 ? '#00ff66' : '#efff00'; // Green + Yellow particles
        this.color = this.baseColor;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 3.5;
            this.y += Math.sin(angle) * force * 3.5;
            this.color = '#efff00'; // Flash yellow near cursor
          } else {
            this.color = this.baseColor;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (90 - distance) / 90 * 0.18;
            ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
};

const Homepage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // HUD states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [systemLogs, setSystemLogs] = useState([
    'NEXUS.CORE: ACCESS STATE // SYNAPSE OPEN',
    'CUDA DEVICE: INITIATED (RTX 5090 MATRIX)',
    'FREE ALLOCATION INDEX: UNLIMITED ACTIVE'
  ]);

  // CLI widget states
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState([
    'Welcome to NEXUS.GEN v4.0 shell interface.',
    'Type "help" for a list of authorized core tasks.'
  ]);

  // Live Generator Console states
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'video' | 'text'
  const [prompt, setPrompt] = useState('Sleek cybernetic humanoid portrait, glowing green optical lens, dark carbon fiber chassis, wireframe details, neon yellow highlights');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genLogs, setGenLogs] = useState([]);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [genSettings, setGenSettings] = useState({
    model: 'Nexus-Stable-v4.2',
    aspect: '16:9',
    steps: 30
  });

  // Showcase state
  const [showcaseDetail, setShowcaseDetail] = useState(null);

  // Track mouse coordinates for coordinate overlays
  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX.toFixed(0),
      y: e.clientY.toFixed(0)
    });
  };

  // Mock live logs ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        'PIPELINE CORE SYNC INDEX: ' + (99.1 + Math.random() * 0.8).toFixed(2) + '%',
        'VRAM TEMP BUFFER: ' + (55 + Math.random() * 8).toFixed(0) + 'C // FAN 72%',
        'NEURAL STREAM: SEED COMPATIBILITY STABLE',
        'LATENT SYNAPSE UPDATE #' + Math.floor(Math.random() * 884920),
        'GRID OPERATION MATRIX: VALID',
        'FREE CLIENT NODES ONLINE: ' + Math.floor(100 + Math.random() * 50)
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setSystemLogs((prev) => [randomMsg, prev[0], prev[1]].slice(0, 3));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // CLI Command Interpreter
  const handleCliSubmit = (e) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const input = cliInput.trim().toLowerCase();
    let response = '';

    if (input === 'help') {
      response = 'Authorized Command Manifest: \n - status: query live server diagnostics\n - clear: wipe console cache\n - generate: initialize active prompt sync\n - system: check core AI architecture';
    } else if (input === 'status') {
      response = 'DIAGNOSTICS // VRAM: STABLE // PIPELINE LATENCY: 8.4ms // GPU LOAD: 12% // LIMITS: UNLIMITED';
    } else if (input === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else if (input === 'generate') {
      response = 'INITIALIZING ENGINE PIPELINE... COMPILING PROMPT: ' + prompt.substring(0, 20) + '...';
      triggerGeneration();
    } else if (input === 'system') {
      response = 'SYSTEM MODEL LAYERS // IMAGES: Nexus-Stable-v4.2 // VIDEOS: SynthFlow-Cinematic // TEXT: GPT-Nexus-Alpha // FREE USE: ACTIVE';
    } else {
      response = `Command not recognized: "${input}". Type "help" for active index.`;
    }

    setCliHistory((prev) => [...prev, `> ${cliInput}`, response]);
    setCliInput('');
  };

  // Trigger Simulated Generation
  const triggerGeneration = () => {
    if (generating) return;
    setGenerating(true);
    setGenProgress(0);
    setGeneratedOutput(null);
    
    const logs = [
      'ALLOCATING LATENT BUFFERS...',
      'INJECTING RANDOMIZED NOISE...',
      'SAMPLING STEP RESOLUTIONS...',
      'DE-NOISING LATENT VECTOR SPACES...',
      'RUNNING FLOW-MATCHING INTERPOLATIONS...',
      'COMPILING HIGH-FIDELITY BUFFERS...',
      'OUTPUT RESOLVED.'
    ];

    setGenLogs(['[SYS] SYNCHRONIZING CORE PIPELINE...']);

    // Log append intervals
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logs.length) {
        setGenLogs((prev) => [...prev, `[RENDER] ${logs[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Progress counter
    const progressInterval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setGenerating(false);
          // Set output image depending on tab
          if (activeTab === 'image') {
            setGeneratedOutput(level1Img);
          } else if (activeTab === 'video') {
            setGeneratedOutput(level2Img);
          } else {
            setGeneratedOutput('text_output');
          }
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const freeOperations = [
    {
      title: 'IMAGE GENERATION',
      icon: <ImageIcon className="w-6 h-6" />,
      desc: 'Create hyper-realistic 8K cyberpunk concept art, sleek UI blueprints, and digital photography. Powered by Nexus-Stable-v4.2 with zero licensing tokens needed.',
      limit: 'UNLIMITED FREE USE',
      badge: 'STABLE DIFFUSION'
    },
    {
      title: 'VIDEO GENERATION',
      icon: <Film className="w-6 h-6" />,
      desc: 'Synthesize consistent camera movements, cinematic panning, and dynamic neon light trails. Powered by our Flow-Matching kinetic render thunks.',
      limit: 'UNLIMITED FREE USE',
      badge: 'KINETIC SYNTH'
    },
    {
      title: 'TEXT & CONTENT GENERATION',
      icon: <MessageSquare className="w-6 h-6" />,
      desc: 'Compile lore outlines, cyberpunk slang prompts, character backstory manifests, and coding blocks. Powered by our GPT-Nexus-Alpha parser.',
      limit: 'UNLIMITED FREE USE',
      badge: 'NEURAL TEXT'
    }
  ];

  const showcaseGallery = [
    {
      id: 1,
      title: 'SYNTHETIC CYBERNETICS',
      prompt: 'Sleek carbon-fiber humanoid robot, neon green eye visor, intricate wiring arrays, dark environment, matrix grid lines.',
      image: level1Img,
      model: 'Nexus-Stable-v4.2',
      aspect: '16:9',
      seed: 88492019,
      steps: 30
    },
    {
      id: 2,
      title: 'CHRONO DRIFT NEON',
      prompt: 'Futuristic vehicle speeding through a rainy cyberpunk Tokyo street, neon yellow reflection trails, motion blur, cinematography.',
      image: level2Img,
      model: 'SynthFlow-Cinematic',
      aspect: '16:9',
      seed: 49502933,
      steps: 40
    },
    {
      id: 3,
      title: 'NEURAL SPHERE VECTOR',
      prompt: 'Holographic network brain interface, floating digital parameters, electric green connectors, dark background console.',
      image: level3Img,
      model: 'Nexus-Stable-v4.2',
      aspect: '1:1',
      seed: 10492839,
      steps: 25
    },
    {
      id: 4,
      title: 'CONTROL STATION MASTER',
      prompt: 'Sleek cyberpunk command room, glowing command modules, holographic city layouts, neon green and yellow panels.',
      image: heroImg,
      model: 'Nexus-Stable-v4.2',
      aspect: '16:9',
      seed: 994029384,
      steps: 50
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-cyber-bg text-white font-mono flex flex-col relative overflow-hidden select-none"
    >
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,102,0.04),rgba(239,255,0,0.01),rgba(0,255,102,0.04))] bg-[size:100%_4px,3px_100%] pointer-events-none z-40"></div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,102,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,102,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-cyber-green/20 bg-zinc-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-yellow/20 border border-cyber-green/40 flex items-center justify-center shadow-lg shadow-cyber-green/20">
            <Cpu className="w-5 h-5 text-cyber-green animate-pulse" />
          </div>
          <span className="text-xl font-bold font-cyber tracking-widest text-cyber-green">
            NEXUS.GEN
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs">
          <a href="#playground" className="text-zinc-400 hover:text-cyber-green transition-colors flex items-center gap-1 group">
            <span className="text-[10px] text-cyber-green">&lt;01&gt;</span> PLAYGROUND
          </a>
          <a href="#operations" className="text-zinc-400 hover:text-cyber-green transition-colors flex items-center gap-1 group">
            <span className="text-[10px] text-cyber-green">&lt;02&gt;</span> CORE OPERATIONS
          </a>
          <a href="#showcase" className="text-zinc-400 hover:text-cyber-green transition-colors flex items-center gap-1 group">
            <span className="text-[10px] text-cyber-green">&lt;03&gt;</span> GALLERY SHOWCASE
          </a>
          <a href="#terminal" className="text-zinc-400 hover:text-cyber-green transition-colors flex items-center gap-1 group">
            <span className="text-[10px] text-cyber-green">&lt;04&gt;</span> CLI TERMINAL
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:inline text-xs text-cyber-green border border-cyber-green/30 px-3 py-1.5 rounded-lg bg-cyber-green/5 cursor-pointer hover:bg-cyber-green/10"
              >
                CELL ACTIVE // <span className="font-bold">{user.username.toUpperCase()}</span>
              </button>
              <button 
                onClick={() => dispatch(logout())}
                className="px-4 py-1.5 border border-red-950 hover:border-red-500 hover:bg-red-500/10 text-xs text-red-400 rounded-lg transition-all duration-200 cursor-pointer"
              >
                DISCONNECT
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('login')}
                className="text-xs text-zinc-400 hover:text-cyber-green transition-colors py-1.5 px-3 cursor-pointer"
              >
                ACCESS CARD (LOG IN)
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="relative group overflow-hidden px-4 py-2 border border-cyber-green/40 hover:border-cyber-yellow bg-cyber-green/5 text-xs font-semibold rounded-lg text-cyber-green hover:text-cyber-yellow transition-all duration-300 shadow-md shadow-cyber-green/10 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/0 via-cyber-yellow/20 to-cyber-green/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                INITIALIZE (SIGN UP)
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center border-b border-zinc-900 z-10">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>

        <div className="max-w-4xl space-y-8 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-green/5 border border-cyber-green/30 rounded-full text-cyber-green text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,102,0.1)]">
            <Sparkles className="w-3.5 h-3.5" /> FREE GENERATION NODES ACTIVE
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-widest leading-none font-cyber">
            SYNTHETIC <span className="text-cyber-yellow">IMAGERY</span> <br/>
            & CINEMATIC <span className="text-cyber-green">MOTION</span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed tracking-wide font-mono">
            Unleash real-time latent neural diffusion layers. Generate cinema-grade video clips, high-fidelity conceptual art, and semantic copy texts for free without node tokens.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pointer-events-auto">
            <a
              href="#playground"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyber-green to-cyber-yellow hover:opacity-90 text-black font-bold rounded-xl text-xs transition-all duration-300 shadow-md shadow-cyber-green/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
            >
              ENGAGE PLAYGROUND <ChevronRight size={14} />
            </a>
            <a
              href="#operations"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950/60 hover:bg-zinc-900/80 border border-zinc-800 hover:border-cyber-green/40 text-zinc-300 font-bold rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
            >
              CHECK DIAGNOSTICS
            </a>
          </div>
        </div>

        {/* HUD coordinates */}
        <div className="absolute bottom-6 left-6 text-left hidden lg:block text-[10px] text-zinc-600 space-y-1 pointer-events-none">
          <div>LOC_MATRIX: [X: {mousePos.x}, Y: {mousePos.y}]</div>
          <div>CORE CLUSTER SYSTEM STATE: NORMAL</div>
        </div>

        <div className="absolute bottom-6 right-6 text-right hidden lg:block text-[10px] text-zinc-600 space-y-1 pointer-events-none">
          {systemLogs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'text-cyber-green font-bold' : ''}>
              {log}
            </div>
          ))}
        </div>
      </section>

      {/* GENERATIVE PLAYGROUND / CONSOLE */}
      <section id="playground" className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-green/5 border border-cyber-green/20 rounded-full text-cyber-green text-[10px] uppercase tracking-widest font-bold">
            <Sliders className="w-3.5 h-3.5" /> LIVE SYNAPSE CORE
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-widest text-white font-cyber uppercase">AI GENERATIVE COMMAND PLAYGROUND</h2>
          <p className="text-zinc-500 text-xs uppercase">Compile text prompts into synthetic visuals on-the-fly</p>
        </div>

        {/* Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-950/70 border border-cyber-green/20 rounded-3xl p-6 sm:p-8 relative shadow-[0_0_40px_rgba(0,255,102,0.02)]">
          
          {/* Controls - Left (7 columns) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800 pb-4">
              <button
                onClick={() => { setActiveTab('image'); setPrompt('Sleek cybernetic humanoid portrait, glowing green optical lens, dark carbon fiber chassis, wireframe details, neon yellow highlights'); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'image' 
                    ? 'border-cyber-green bg-cyber-green/5 text-cyber-green' 
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                <ImageIcon size={14} /> IMAGE_ENGINE
              </button>
              <button
                onClick={() => { setActiveTab('video'); setPrompt('Futuristic cyber vehicle flying through massive matrix highway, light speed trails, motion blur, rain drops, 4k'); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'video' 
                    ? 'border-cyber-green bg-cyber-green/5 text-cyber-green' 
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                <Film size={14} /> VIDEO_ENGINE
              </button>
              <button
                onClick={() => { setActiveTab('text'); setPrompt('Write a hacker lore sequence explaining how NEXUS.GEN bypasses centralized rendering models'); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'text' 
                    ? 'border-cyber-green bg-cyber-green/5 text-cyber-green' 
                    : 'border-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                <MessageSquare size={14} /> TEXT_PROMPTER
              </button>
            </div>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">INPUT_PROMPT_STRING</label>
              <textarea
                className="w-full h-28 p-4 bg-zinc-900/60 border border-zinc-800 focus:border-cyber-green/60 rounded-2xl text-white placeholder-zinc-700 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-cyber-green/10 resize-none transition-all"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your design structure..."
                disabled={generating}
              />
            </div>

            {/* Tuning Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ACTIVE_MODEL</label>
                <select 
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 p-2.5 rounded-xl outline-none focus:border-cyber-green/60"
                  value={genSettings.model}
                  onChange={(e) => setGenSettings({...genSettings, model: e.target.value})}
                  disabled={generating}
                >
                  <option value="Nexus-Stable-v4.2">Nexus-Stable-v4.2 (Free)</option>
                  <option value="SynthFlow-Cinematic">SynthFlow-Kinetic (Free)</option>
                  <option value="GPT-Nexus-Alpha">GPT-Nexus-Alpha (Free)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ASPECT_RATIO</label>
                <div className="flex gap-2">
                  {['16:9', '1:1', '9:16'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setGenSettings({...genSettings, aspect: r})}
                      className={`flex-grow py-2 text-[10px] font-bold border rounded-lg cursor-pointer ${
                        genSettings.aspect === r ? 'border-cyber-green bg-cyber-green/5 text-cyber-green' : 'border-zinc-800 text-zinc-400'
                      }`}
                      disabled={generating}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">COMPILER_STEPS</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="15" 
                    max="50" 
                    value={genSettings.steps} 
                    onChange={(e) => setGenSettings({...genSettings, steps: Number(e.target.value)})}
                    className="w-full accent-cyber-green"
                    disabled={generating}
                  />
                  <span className="text-xs text-cyber-green font-bold w-6">{genSettings.steps}</span>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={triggerGeneration}
              disabled={generating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-cyber-green to-cyber-yellow text-black font-bold rounded-xl text-xs uppercase tracking-widest shadow-md shadow-cyber-green/20 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer flex justify-center items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin-fast"></span>
                  COMPILING LATENT CODES ({genProgress}%)
                </>
              ) : (
                <>
                  <Zap size={14} /> ENGAGE PIPELINE RENDER
                </>
              )}
            </button>
          </div>

          {/* Render Monitor - Right (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-zinc-800 bg-zinc-950 rounded-2xl p-4 min-h-[350px]">
            {/* Screen Head */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-900 text-[10px] text-zinc-500">
              <span>OUTPUT_MONITOR_#04</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${generating ? 'bg-cyber-yellow animate-pulse' : 'bg-cyber-green'}`}></span>
                {generating ? 'COMPILING' : 'STANDBY'}
              </span>
            </div>

            {/* Screen Content */}
            <div className="flex-grow flex items-center justify-center py-4 relative min-h-[220px]">
              {generating ? (
                <div className="w-full space-y-4 font-mono text-[10px] text-zinc-500 text-left px-4">
                  <div className="text-cyber-yellow font-bold animate-pulse uppercase tracking-wider">SYNCING LATENT ARRAYS...</div>
                  <div className="space-y-1 overflow-y-auto max-h-[140px] border border-zinc-900/60 bg-black/40 p-3 rounded-lg">
                    {genLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              ) : generatedOutput ? (
                generatedOutput === 'text_output' ? (
                  <div className="w-full text-left p-4 bg-black/50 border border-cyber-green/20 rounded-xl max-h-[220px] overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300">
                    <span className="text-cyber-green font-bold block mb-2">// NEXUS OUTPUT GENERATED:</span>
                    "The neural sync bypass protocols were initialized successfully at seed 4492. De-duplication modules verified zero dependency loops. All localized nodes in the network are streaming free latent vector models."
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-cyber-green/30 animate-fadeIn">
                    <img src={generatedOutput} alt="Generated output preview" className="w-full h-full object-cover max-h-[220px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-[9px] text-cyber-green bg-zinc-950/80 px-2 py-0.5 rounded border border-cyber-green/20">
                      OUTPUT_RESOLVED // SEED: {Math.floor(Math.random() * 999999)}
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center space-y-2">
                  <Terminal size={32} className="text-zinc-700 mx-auto animate-pulse" />
                  <div className="text-zinc-600 text-xs font-bold uppercase tracking-wider">GENERATE PIPELINE IDLE</div>
                  <p className="text-[10px] text-zinc-700 max-w-[200px]">INPUT PROMPT AND ENGAGE PIPELINE TO RENDER OUTPUTS</p>
                </div>
              )}
            </div>

            {/* Screen Foot */}
            <div className="border-t border-zinc-900 pt-3 flex justify-between text-[9px] text-zinc-600">
              <span>FPS: 60.00 // SCALE: FIT</span>
              <span>NODE_REF: GENERATOR_CELL_0</span>
            </div>

          </div>
        </div>
      </section>

      {/* CORE OPERATIONS */}
      <section id="operations" className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-green/5 border border-cyber-green/20 rounded-full text-cyber-green text-[10px] uppercase tracking-widest font-bold">
            <Zap className="w-3.5 h-3.5" /> SYNAPTIC PIPELINES
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-widest text-white font-cyber uppercase">CORE GENERATIVE SYSTEM</h2>
          <p className="text-zinc-500 text-xs uppercase">Complete suite of free AI processors mapped for instant deployment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {freeOperations.map((op, idx) => (
            <div key={idx} className="bg-zinc-950/40 border border-zinc-800 hover:border-cyber-green/40 hover:bg-zinc-900/20 rounded-3xl p-8 transition-all duration-300 group text-left space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-cyber-green/5 border border-cyber-green/20 flex items-center justify-center text-cyber-green group-hover:bg-cyber-green/10 transition-colors">
                {op.icon}
              </div>
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-cyber-green/10 text-cyber-green rounded border border-cyber-green/20 uppercase tracking-widest">
                  {op.badge}
                </span>
                <h3 className="text-base font-bold text-white mt-3 font-cyber tracking-widest">{op.title}</h3>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {op.desc}
              </p>
              <div className="pt-4 border-t border-zinc-800/60 flex justify-between items-center">
                <span className="text-[10px] text-cyber-yellow font-bold tracking-wider">{op.limit}</span>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-cyber-green transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE GALLERY */}
      <section id="showcase" className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-green/5 border border-cyber-green/20 rounded-full text-cyber-green text-[10px] uppercase tracking-widest font-bold">
            <Film className="w-3.5 h-3.5 animate-pulse" /> NETWORK ARCHIVES
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-widest text-white font-cyber uppercase">GENERATIVE SHOWCASE</h2>
          <p className="text-zinc-500 text-xs uppercase">Curated results compiled via our free network nodes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseGallery.map((gal) => (
            <div 
              key={gal.id}
              onClick={() => setShowcaseDetail(gal)}
              className="group relative rounded-2xl overflow-hidden border border-zinc-900 hover:border-cyber-green/30 bg-zinc-950/40 p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer text-left"
            >
              {/* Media box */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img 
                  src={gal.image} 
                  alt={gal.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-65"></div>
              </div>

              {/* Tag/Badge */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-cyber-green">{gal.model}</span>
                <span className="text-[8px] text-zinc-500 uppercase">{gal.aspect}</span>
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-white mb-2 uppercase font-cyber tracking-widest">{gal.title}</h3>
              <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-2">
                "{gal.prompt}"
              </p>
            </div>
          ))}
        </div>

        {/* Showcase Expanded Detail Overlay */}
        {showcaseDetail && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setShowcaseDetail(null)}
          >
            <div 
              className="relative w-full max-w-[700px] bg-zinc-950 border border-cyber-green/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowcaseDetail(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <X size={14} /> CLOSE
              </button>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800">
                <img src={showcaseDetail.image} alt={showcaseDetail.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-left space-y-4">
                <h3 className="text-xl font-bold text-cyber-green font-cyber uppercase tracking-widest">{showcaseDetail.title}</h3>
                
                <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                  <p className="text-xs text-zinc-400 font-mono italic leading-relaxed">
                    "{showcaseDetail.prompt}"
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase">MODEL_ENGINE</span>
                    <span className="font-semibold text-white">{showcaseDetail.model}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase">ASPECT_RATIO</span>
                    <span className="font-semibold text-white">{showcaseDetail.aspect}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase">SEED_INDEX</span>
                    <span className="font-semibold text-white">{showcaseDetail.seed}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                    <span className="text-[9px] text-zinc-500 block uppercase">COMPILER_STEPS</span>
                    <span className="font-semibold text-white">{showcaseDetail.steps}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* TECHNICAL NETWORK ARCHITECTURE */}
      <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-green/5 border border-cyber-green/20 rounded-full text-cyber-green text-[10px] uppercase tracking-widest font-bold">
            <Database className="w-3.5 h-3.5 animate-pulse" /> NETWORK DIAGNOSTICS
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-widest text-white font-cyber uppercase">SYSTEM CORE BLUEPRINTS</h2>
          <p className="text-zinc-500 text-xs uppercase">Live cluster computational parameters updated in real-time</p>
        </div>

        <div className="overflow-x-auto border border-zinc-800 bg-zinc-950 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-900/20 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-4 sm:p-5">PROCESSOR_NODE</th>
                <th className="p-4 sm:p-5">ACTIVE_MODEL</th>
                <th className="p-4 sm:p-5">COMPUTE_SPEED</th>
                <th className="p-4 sm:p-5">FREE_DAILY_ALLOWANCE</th>
                <th className="p-4 sm:p-5">NODE_CAPACITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping"></span> NODE_001_TOKYO
                </td>
                <td className="p-4 sm:p-5">Nexus-Stable-v4.2 (Image)</td>
                <td className="p-4 sm:p-5 text-cyber-green">144.2 GigaFLOPS</td>
                <td className="p-4 sm:p-5 font-semibold text-cyber-yellow">UNLIMITED FREE</td>
                <td className="p-4 sm:p-5">98.4% CAP</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green"></span> NODE_002_BERLIN
                </td>
                <td className="p-4 sm:p-5">SynthFlow-Cinematic (Video)</td>
                <td className="p-4 sm:p-5 text-cyber-green">94.8 GigaFLOPS</td>
                <td className="p-4 sm:p-5 font-semibold text-cyber-yellow">UNLIMITED FREE</td>
                <td className="p-4 sm:p-5">88.1% CAP</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green"></span> NODE_003_SF
                </td>
                <td className="p-4 sm:p-5">GPT-Nexus-Alpha (Text)</td>
                <td className="p-4 sm:p-5 text-cyber-green">45.1 GigaFLOPS</td>
                <td className="p-4 sm:p-5 font-semibold text-cyber-yellow">UNLIMITED FREE</td>
                <td className="p-4 sm:p-5">52.9% CAP</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CLI SHELL TERMINAL WIDGET */}
      <section id="terminal" className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-yellow/5 border border-cyber-yellow/20 rounded-full text-cyber-yellow text-[10px] uppercase tracking-widest font-bold">
            <Terminal className="w-3.5 h-3.5" /> COMMAND DIRECTORY
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-white font-cyber uppercase">NEXUS SHELL INTERFACE</h2>
          <p className="text-zinc-500 text-xs uppercase">Execute direct query strings to configure latent pipeline</p>
        </div>

        {/* Terminal frame */}
        <div className="bg-black border border-cyber-green/30 rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.02)] overflow-hidden text-left flex flex-col h-[280px]">
          {/* Header */}
          <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-2 font-bold text-cyber-green">
              <Terminal size={12} /> NEXUS.GEN // BASH
            </span>
            <span>CELL_04</span>
          </div>

          {/* History */}
          <div className="p-4 flex-grow overflow-y-auto text-[11px] text-zinc-400 space-y-2">
            {cliHistory.map((hist, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {hist}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleCliSubmit} className="bg-zinc-950 border-t border-zinc-900 p-2 flex items-center">
            <span className="text-cyber-green text-xs font-bold px-2">&gt;</span>
            <input 
              type="text" 
              className="flex-grow bg-transparent border-none outline-none text-white text-[11px] p-1 font-mono"
              placeholder="Query command (e.g. status, system, help)"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
            />
            <button type="submit" className="text-cyber-green hover:text-white p-1 cursor-pointer">
              <Send size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-8 py-10 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex items-center gap-3">
          <Wifi className="w-4 h-4 text-cyber-green animate-pulse" />
          <span>DIAGNOSTIC STATUS // SECURE SYNAPSE ACTIVE</span>
        </div>
        <div>
          © 2026 NEXUS.GEN // CLASSIFIED OPERATIONS PIPELINE
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
