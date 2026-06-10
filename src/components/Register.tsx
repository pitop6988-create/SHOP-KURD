import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ChevronLeft } from 'lucide-react';

export function Register({ onComplete, onGuest }: { onComplete: () => void; onGuest?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsLoading(true);
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onComplete();
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.code === 'auth/invalid-credential') {
        alert("Invalid email or password. Please check your credentials or register if you don't have an account.");
      } else if (error.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          onComplete();
        } catch (signInError: any) {
          if (signInError.code === 'auth/invalid-credential') {
             alert("This email is already registered and the password you entered is incorrect. Please try again.");
          } else {
             alert(signInError.message || "Authentication failed. Please try again.");
          }
          setView('login');
        }
      } else if (error.code === 'auth/weak-password') {
        alert("Password should be at least 6 characters.");
      } else {
        alert(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onComplete();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'welcome') {
    return (
      <div className="flex flex-col h-full bg-slate-900 px-6 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center z-10 pb-10">
          <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20 shadow-xl">
             <span className="text-4xl">🔥</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight mb-2 text-center">Mizgin Hat Co.</h1>
          <p className="text-white/60 italic font-serif text-lg mb-16">For All LPG Service</p>

          <div className="w-full space-y-4 max-w-[280px]">
            <button 
              onClick={() => setView('register')}
              className="w-full bg-[#4ca14b] text-white font-bold py-4 rounded-2xl hover:bg-[#408a3f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Sign Up
            </button>
            <button 
              onClick={() => setView('login')}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-all"
            >
              Login
            </button>
          </div>
          
          <button 
            onClick={onGuest}
            className="mt-12 text-white/50 text-sm font-medium hover:text-white transition-colors underline underline-offset-4"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-6">
      <div className="pt-8 flex items-center">
        <button onClick={() => setView('welcome')} className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1"></div>
        <button className="flex items-center space-x-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700">
          <span>🇬🇧</span>
          <span>English</span>
        </button>
      </div>

      <div className="flex flex-col flex-1 justify-center pb-20">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
             <span className="text-2xl">🔥</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Mizgin Hat Co.</h1>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 text-slate-800">
          {view === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] transition-all"
            required
            minLength={6}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4ca14b] text-white font-bold py-3.5 rounded-xl hover:bg-[#408a3f] transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400 font-medium">or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
          Google
        </button>
      </div>
    </div>
  );
}
