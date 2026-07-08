import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import heroImg from '../assets/command_center.jpg';
import level1Img from '../assets/level1.jpg';
import level2Img from '../assets/level2.jpg';
import level3Img from '../assets/level3.jpg';
import { FcGoogle as Chrome } from 'react-icons/fc';
import { FaGithub as Github } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Define Zod Schema for Registration
const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Alphanumeric characters and underscores only'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
});

const Signup = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col lg:flex-row relative overflow-hidden font-mono select-none">
      
      {/* Grain / Noise HUD overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-30 opacity-60"></div>
      <div className="absolute inset-0 crt-scanline pointer-events-none z-30 opacity-15"></div>

      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] bg-cyber-primary/5 rounded-full blur-[140px] -top-10 -left-10 pointer-events-none z-0"></div>
      <div className="absolute w-[450px] h-[450px] bg-cyber-cyan/3 rounded-full blur-[120px] bottom-10 right-[35%] pointer-events-none z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyber-secondary/4 rounded-full blur-[130px] top-1/3 right-10 pointer-events-none z-0"></div>

      {/* LEFT SIDE (Visual Section - 60% Width) */}
      <div className="w-full lg:w-[60%] p-8 lg:p-16 flex flex-col justify-between items-start relative z-10 border-r border-white/5 bg-zinc-950/20 backdrop-blur-sm">
        
        {/* Top Left back button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-bold text-cyber-muted hover:text-cyber-primary transition-colors cursor-pointer group bg-transparent border-none"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
        </button>

        {/* Center: Holographic Glass Container */}
        <div className="w-full flex-grow flex items-center justify-center py-10 relative">
          
          {/* Static background glows (no heavy performance cost) */}
          <div className="absolute rounded-full w-[240px] h-[240px] bg-cyber-primary/5 blur-[80px] pointer-events-none z-0 top-[30%] left-[35%]" />
          <div className="absolute rounded-full w-[200px] h-[200px] bg-cyber-cyan/4 blur-[90px] pointer-events-none z-0 bottom-[30%] right-[35%]" />

          {/* Hologram Card (Clean CSS scaling) */}
          <div className="relative w-[300px] h-[370px] sm:w-[350px] sm:h-[430px] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-5 flex flex-col justify-between z-10 hover:border-white/20 transition-all duration-300">
            {/* Screen overlay details */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary/5 via-transparent to-cyber-cyan/5 pointer-events-none rounded-3xl"></div>
            <div className="absolute top-4 left-4 text-[9px] text-cyber-primary font-bold border border-cyber-primary/30 px-2 py-0.5 rounded bg-cyber-primary/5">
              SYNAPSE_CORE // ACTIVE
            </div>
            <div className="absolute top-4 right-4 text-[9px] text-zinc-500 font-mono">
              FPS: 60.00
            </div>

            {/* Simulated AI Artwork */}
            <div className="flex-grow flex items-center justify-center mt-8 relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 aspect-[4/3] w-full">
              <img 
                src={heroImg} 
                alt="AI Artwork console" 
                className="w-full h-full object-cover opacity-80 filter saturate-[1.2]" 
              />
              <div className="absolute inset-0 crt-scanline opacity-10"></div>
              
              <div className="absolute w-2 h-2 bg-cyber-primary rounded-full top-[20%] left-[40%] animate-ping" />
              <div className="absolute w-2.5 h-2.5 bg-cyber-cyan rounded-full bottom-[30%] right-[30%] animate-pulse" />
            </div>

            {/* Thumbnail Overlay Decks */}
            <div className="flex gap-3 mt-4 z-20">
              {[level1Img, level2Img, level3Img].map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-12 rounded-lg overflow-hidden border border-white/15 bg-zinc-900 cursor-pointer shadow-lg shadow-black/40 hover:scale-110 transition-transform duration-200"
                >
                  <img src={img} alt="Deck asset" className="w-full h-full object-cover opacity-70" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Left typography */}
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
      </div>

      {/* RIGHT SIDE (Signup Form Section - 40% Width) */}
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
              CREATE ACCOUNT
            </h2>
            <p className="text-xs text-cyber-muted leading-relaxed">
              Register to begin creating extraordinary AI content.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            
            {/* Username Field */}
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest" htmlFor="username">
                Username
              </label>
              <div className="relative flex items-center group">
                <User className="absolute left-4 text-zinc-600 group-focus-within:text-cyber-primary transition-colors duration-200" size={16} />
                <input
                  id="username"
                  type="text"
                  className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${
                    errors.username ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/10 focus:border-cyber-primary focus:ring-cyber-primary/10'
                  } rounded-xl text-white placeholder-zinc-700 text-xs outline-none transition-all duration-200 focus:bg-white/8 focus:ring-4`}
                  placeholder="e.g. pilot_core"
                  disabled={isLoading}
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <span className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
                  <AlertCircle size={12} />
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest" htmlFor="email">
                Email
              </label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-4 text-zinc-600 group-focus-within:text-cyber-primary transition-colors duration-200" size={16} />
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
                <Lock className="absolute left-4 text-zinc-600 group-focus-within:text-cyber-primary transition-colors duration-200" size={16} />
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
              className="w-full py-4 border-2 border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 hover:shadow-[0_0_25px_rgba(232,255,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed mt-6 flex justify-center items-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-cyber-primary/30 border-t-cyber-primary rounded-full animate-spin"></span>
                  COMPILING NODES...
                </>
              ) : (
                'Initialize Engine →'
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
                className="w-full py-3 bg-white/5 border border-white/5 hover:border-cyber-primary/20 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/8 cursor-pointer"
              >
                <Chrome size={14} className="text-zinc-400" /> Continue with Google
              </button>
              <button
                onClick={() => window.location.href = `${API_BASE}/api/auth/github`}
                className="w-full py-3 bg-white/5 border border-white/5 hover:border-cyber-primary/20 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/8 cursor-pointer"
              >
                <Github size={14} className="text-zinc-400" /> Continue with GitHub
              </button>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col gap-3 text-[10px] text-cyber-muted text-center pt-2 font-bold tracking-wider">
            <div>
              ALREADY HAVE AN ACCOUNT?{' '}
              <button
                type="button"
                className="text-cyber-primary hover:underline cursor-pointer bg-transparent border-none"
                onClick={() => onNavigate('login')}
                disabled={isLoading}
              >
                LOG IN
              </button>
            </div>
            <div className="flex justify-center gap-4 text-zinc-700">
              <a href="#terms" className="hover:text-cyber-primary transition-colors">TERMS</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-cyber-primary transition-colors">PRIVACY</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;