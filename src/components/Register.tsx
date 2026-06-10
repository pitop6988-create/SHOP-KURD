import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function Register({ onComplete }: { onComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onComplete();
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(error.message || "Authentication failed. Please try again.");
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

  return (
    <div className="flex flex-col h-full bg-white px-6">
      {/* Language Selector */}
      <div className="pt-8">
        <button className="flex items-center space-x-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700">
          <span>🇬🇧</span>
          <span>English</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center pb-20">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Mizgin Hat Co.</h1>
          <p className="text-sm italic text-slate-500 font-serif mt-1">For All LPG Service</p>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 text-slate-800">
          {isLogin ? 'Sign in' : 'Register'}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] transition-all"
            required
            minLength={6}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4ca14b] text-white font-bold py-3.5 rounded-full hover:bg-[#408a3f] transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3.5 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
          Google
        </button>

        <div className="text-center mt-8 text-sm">
          <span className="text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#4ca14b] font-medium hover:underline"
          >
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
