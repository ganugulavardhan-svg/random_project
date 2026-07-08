import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { FcGoogle as Chrome } from 'react-icons/fc';
import { FaGithub as Github } from "react-icons/fa";
import heroImg from '../assets/command_center.jpg';
import level1Img from '../assets/level1.jpg';
import level2Img from '../assets/level2.jpg';
import level3Img from '../assets/level3.jpg';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// Memoized Background Glows
const BackgroundGlows = React.memo(() => (
  <>
    <div className="absolute w-[500px] h-[500px] bg-cyber-primary/3 rounded-full blur-[80px] -top-10 -left-10 pointer-events-none z-0"></div>
    <div className="absolute w-[450px] h-[450px] bg-cyber-cyan/2 rounded-full blur-[80px] bottom-10 right-[35%] pointer-events-none z-0"></div>
    <div className="absolute w-[400px] h-[400px] bg-cyber-secondary/2 rounded-full blur-[80px] top-1/3 right-10 pointer-events-none z-0"></div>
  </>
));

// Memoized HUD Overlays
const HudOverlays = React.memo(() => (
  <>
    <div className="absolute inset-0 bg-grain pointer-events-none z-30 opacity-20"></div>
    <div className="absolute inset-0 crt-scanline pointer-events-none z-30 opacity-5"></div>
  </>
));

// Hologram Card - No animations
const HologramCard = React.memo(() => (
  <div className="relative w-[300px] h-[370px] sm:w-[350px] sm:h-[430px] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-5 flex flex-col justify-between z-10">
    <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary/3 via-transparent to-cyber-cyan/3 pointer-events-none rounded-3xl"></div>

    <div className="absolute top-4 left-4 text-[9px] text-cyber-primary font-bold border border-cyber-primary/30 px-2 py-0.5 rounded bg-cyber-primary/5">
      SYNAPSE_CORE // ACTIVE
    </div>
    <div className="absolute top-4 right-4 text-[9px] text-zinc-500 font-mono">
      FPS: 60.00
    </div>

    <div className="flex-grow flex items-center justify-center mt-8 relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 aspect-[4/3] w-full">
      <img
        src={heroImg}
        alt="AI Artwork console"
        className="w-full h-full object-cover opacity-80 saturate-[1.2]"
        loading="lazy"
      />
      <div className="absolute inset-0 crt-scanline opacity-5"></div>

      <div className="absolute w-2 h-2 bg-cyber-primary rounded-full top-[20%] left-[40%]" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
      <div className="absolute w-2.5 h-2.5 bg-cyber-cyan rounded-full bottom-[30%] right-[30%]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
    </div>

    <ThumbnailDecks />
  </div>
));

// Thumbnail Decks - No hover animations
const ThumbnailDecks = React.memo(() => {
  const images = [level1Img, level2Img, level3Img];

  return (
    <div className="flex gap-3 mt-4 z-20">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="w-16 h-12 rounded-lg overflow-hidden border border-white/15 bg-zinc-900 cursor-pointer shadow-lg shadow-black/20 flex-shrink-0 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
        >
          <img
            src={img}
            alt="Deck asset"
            className="w-full h-full object-cover opacity-70"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
});

// Animated Text Section - No animations
const AnimatedText = React.memo(() => (
  <div className="space-y-4 text-left w-full max-w-lg mt-auto">
    <div className="space-y-1">
      {['CREATE.', 'IMAGINE.', 'GENERATE.'].map((word, idx) => (
        <h1
          key={idx}
          className="text-4xl sm:text-6xl font-black text-white font-cyber tracking-widest leading-none"
        >
          {word}
        </h1>
      ))}
    </div>
    <p className="text-xs sm:text-sm text-cyber-muted max-w-sm leading-relaxed">
      Create stunning AI images and cinematic videos from simple text prompts.
    </p>
  </div>
));

// Form Elements - No stagger animations
const FormSection = React.memo(({ onNavigate, isLoading, errors, register, handleSubmit, onSubmit, showPassword, setShowPassword }) => (
  <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-16 py-12 relative z-10 bg-zinc-950/40 backdrop-blur-md">
    <div className="w-full max-w-[360px] mx-auto space-y-8">
      {/* Logo */}
      <div className="text-left flex items-center gap-2">
        <span className="text-lg font-bold font-cyber tracking-widest text-white">
          QUICK<span className="text-cyber-primary">AI</span>
        </span>
      </div>

      {/* Heading */}
      <div className="text-left space-y-2">
        <h2 className="text-3xl font-black text-white tracking-widest font-cyber uppercase leading-none">
          WELCOME BACK
        </h2>
        <p className="text-xs text-cyber-muted leading-relaxed">
          Sign in to continue creating extraordinary AI content.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2 text-left">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest" htmlFor="email">
            Email
          </label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-4 text-zinc-650 group-focus-within:text-cyber-primary transition-colors duration-200" size={16} />
            <input
              id="email"
              type="email"
              className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${
                errors.email ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/10 focus:border-cyber-primary focus:ring-cyber-primary/10'
              } rounded-xl text-white placeholder-zinc-700 text-xs outline-none transition-all duration-200 focus:bg-white/8 focus:ring-4`}
              placeholder="name@domain.com"
              disabled={isLoading}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
              <AlertCircle size={12} />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2 text-left">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest" htmlFor="password">
            Password
          </label>
          <div className="relative flex items-center group">
            <Lock className="absolute left-4 text-zinc-650 group-focus-within:text-cyber-primary transition-colors duration-200" size={16} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-11 pr-12 py-3 bg-white/5 border ${
                errors.password ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/10 focus:border-cyber-primary focus:ring-cyber-primary/10'
              } rounded-xl text-white placeholder-zinc-700 text-xs outline-none transition-all duration-200 focus:bg-white/8 focus:ring-4`}
              placeholder="••••••••"
              disabled={isLoading}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-4 text-zinc-500 hover:text-cyber-primary transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
              <AlertCircle size={12} />
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 border-2 border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-6 flex justify-center items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-cyber-primary/30 border-t-cyber-primary rounded-full animate-spin"></span>
              SYNCHRONIZING CORE...
            </>
          ) : (
            'Generate with AI →'
          )}
        </button>
      </form>

      {/* Social Logins */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          <span className="h-[1px] w-[40%] bg-white/5"></span>
          <span>OR</span>
          <span className="h-[1px] w-[40%] bg-white/5"></span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => window.location.href = `${API_BASE}/api/auth/google`}
            className="w-full py-3 bg-white/5 border border-white/5 hover:border-cyber-primary/20 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/8 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Chrome size={14} className="text-zinc-400" /> Continue with Google
          </button>
          <button
            onClick={() => window.location.href = `${API_BASE}/api/auth/github`}
            className="w-full py-3 bg-white/5 border border-white/5 hover:border-cyber-primary/20 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/8 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Github size={14} className="text-zinc-400" /> Continue with GitHub
          </button>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="flex flex-col gap-3 text-[10px] text-cyber-muted text-center pt-2 font-bold tracking-wider">
        <div>
          DON'T HAVE AN ACCOUNT?{' '}
          <button
            type="button"
            className="text-cyber-primary hover:underline cursor-pointer"
            onClick={() => onNavigate('signup')}
            disabled={isLoading}
          >
            CREATE ONE
          </button>
        </div>
        <div className="flex justify-center gap-4 text-zinc-650">
          <a href="#forgot" className="hover:text-cyber-primary">FORGOT PASSWORD?</a>
          <span>•</span>
          <a href="#terms" className="hover:text-cyber-primary">TERMS</a>
          <span>•</span>
          <a href="#privacy" className="hover:text-cyber-primary">PRIVACY</a>
        </div>
      </div>
    </div>
  </div>
));

// SVG Ribbon - Static, no animation
const RibbonEffect = React.memo(() => (
  <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#32FF8A" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.6" />
      </linearGradient>
    </defs>

    <path
      d="M 36,48 C 48,32 50,68 62,48"
      stroke="url(#ribbon-grad)"
      strokeWidth="0.4"
      fill="none"
      strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))' }}
    />
  </svg>
));

// Back Button - No animations
const BackButton = React.memo(({ onNavigate }) => (
  <button
    onClick={() => onNavigate('home')}
    className="flex items-center gap-2 text-xs font-bold text-cyber-muted hover:text-cyber-primary transition-colors cursor-pointer group"
  >
    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
  </button>
));

// Main Login Component
const Login = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col lg:flex-row relative overflow-hidden font-mono select-none">
      <HudOverlays />
      <BackgroundGlows />
      <RibbonEffect />

      {/* LEFT SIDE */}
      <div className="w-full lg:w-[60%] p-8 lg:p-16 flex flex-col justify-between items-start relative z-10 border-r border-white/5 bg-zinc-950/20 backdrop-blur-sm">
        <BackButton onNavigate={onNavigate} />

        <div className="w-full flex-grow flex items-center justify-center py-10 relative">
          <HologramCard />
        </div>

        <AnimatedText />
      </div>

      {/* RIGHT SIDE */}
      <FormSection
        onNavigate={onNavigate}
        isLoading={isLoading}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </div>
  );
};

export default Login;