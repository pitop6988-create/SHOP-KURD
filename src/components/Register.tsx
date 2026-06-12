import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function Register({ onComplete, onGuest }: { onComplete: () => void; onGuest?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  const ensureUserProfile = async (user: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          email: user.email,
          walletBalance: 0
        });
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsLoading(true);
      if (view === 'login') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserProfile(cred.user);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await ensureUserProfile(cred.user);
      }
      onComplete();
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.code === 'auth/invalid-credential') {
        alert(t.invalidCredentials || "Invalid email or password. Please check your credentials or register if you don't have an account.");
      } else if (error.code === 'auth/email-already-in-use') {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          await ensureUserProfile(cred.user);
          onComplete();
        } catch (signInError: any) {
          if (signInError.code === 'auth/invalid-credential') {
             alert(t.emailInUse || "This email is already registered and the password you entered is incorrect. Please try again.");
          } else {
             alert(signInError.message || t.authFailed);
          }
          setView('login');
        }
      } else if (error.code === 'auth/weak-password') {
        alert(t.weakPassword || "Password should be at least 6 characters.");
      } else {
        alert(error.message || t.authFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await ensureUserProfile(cred.user);
      onComplete();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(t.signInFailed || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'kurdish': return 'https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kurdistan.svg';
      case 'arabic': return 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg';
      default: return 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg';
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'kurdish': return 'Kurmancî';
      case 'arabic': return 'العربية';
      default: return 'English';
    }
  };

  if (view === 'welcome') {
    return (
      <div className="flex flex-col h-full bg-slate-900 px-6 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="absolute top-8 right-6 z-20">
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-all"
          >
            <img src={getLanguageIcon()} alt="Language" className="w-4 h-3 object-cover rounded-[2px]" />
            <span>{getLanguageLabel()}</span>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center z-10 pb-10">
          <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20 shadow-xl">
             <span className="text-4xl">🔥</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight mb-2 text-center">Mizgin Hat Co.</h1>
          <p className="text-white/60 italic font-serif text-lg mb-16">{t.subtitle}</p>

          <div className="w-full space-y-4 max-w-[280px]">
            <button 
              onClick={() => setView('register')}
              className="w-full bg-[#4ca14b] text-white font-bold py-4 rounded-2xl hover:bg-[#408a3f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.signUp}
            </button>
            <button 
              onClick={() => setView('login')}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-all"
            >
              {t.login}
            </button>
          </div>
        </div>

        {showLanguageModal && (
          <div 
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowLanguageModal(false)}
          >
            <div 
              className="bg-slate-900 w-full max-w-md rounded-t-[2.5rem] pt-12 pb-14 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
                <button 
                  onClick={() => { setLanguage('kurdish'); setShowLanguageModal(false); }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-all border ${language === 'kurdish' ? 'bg-[#4ca14b] text-white border-[#4ca14b]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kurdistan.svg" alt="Kurdish" className="w-14 h-9 object-cover rounded mb-4" />
                  <span className="font-medium text-[15px]">Kurmancî</span>
                </button>

                <button 
                  onClick={() => { setLanguage('arabic'); setShowLanguageModal(false); }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-all border ${language === 'arabic' ? 'bg-[#4ca14b] text-white border-[#4ca14b]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg" alt="Arabic" className="w-14 h-9 object-cover rounded mb-4 shadow" />
                  <span className="font-medium text-[15px]">العربية</span>
                </button>

                <button 
                  onClick={() => { setLanguage('english'); setShowLanguageModal(false); }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-all border ${language === 'english' ? 'bg-[#4ca14b] text-white border-[#4ca14b]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="English" className="w-14 h-9 object-cover rounded mb-4" />
                  <span className="font-medium text-[15px]">English</span>
                </button>
              </div>
            </div>
          </div>
        )}
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
      </div>

      <div className="flex flex-col flex-1 justify-center pb-20">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
             <span className="text-2xl">🔥</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Mizgin Hat Co.</h1>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 text-slate-800">
          {view === 'login' ? t.welcomeBack : t.createAccount}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <input 
            type="email" 
            placeholder={t.emailAddress}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] transition-all"
            required
          />
          <input 
            type="password" 
            placeholder={t.passwordLabel}
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
            {isLoading ? t.processing : (view === 'login' ? t.signIn : t.signUp)}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400 font-medium">{t.orContinueWith}</span>
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
