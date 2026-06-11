import React, { useState } from 'react';
import { ChevronRight, HeadphonesIcon, Moon, Globe, Lock, LogOut, X } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useLanguage } from '../LanguageContext';

export function Settings({ onNavigateToAdmin, onLogout }: { onNavigateToAdmin?: () => void; onLogout?: () => void }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const { language, setLanguage, t } = useLanguage();

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'EMAD8912') {
      setShowAdminLogin(false);
      setAdminPassword('');
      if (onNavigateToAdmin) onNavigateToAdmin();
    } else {
      alert('Incorrect admin password');
      setAdminPassword('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full relative">
      <div className="pt-10 pb-4 flex justify-center items-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="font-medium text-slate-800">{t.settings}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col items-center mt-10 mb-6">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center">
            Mizgin Hat Co.
          </h1>
          <p className="text-lg italic text-slate-800 font-serif mt-1 font-medium">{t.subtitle}</p>
        </div>

        <div className="text-center text-slate-400 text-sm mb-8 font-medium">
          {t.version} 1.0.0
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mx-4 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <HeadphonesIcon size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">{t.support}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Moon size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">{t.theme}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-700">
                <Globe size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">{t.language}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => setShowAdminLogin(true)}
            className="w-full flex items-center justify-between p-4 border-t border-slate-100 hover:bg-slate-50 transition-colors bg-amber-50/50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Lock size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">{t.adminDashboard}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 border-t border-slate-100 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <LogOut size={20} />
              </div>
              <span className="font-medium text-red-600 text-base">{t.logout}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 opacity-50" />
          </button>
        </div>
      </div>

      {showAdminLogin && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-xl">{t.adminAccess}</h3>
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdminVerify} className="space-y-4">
              <div>
                <input 
                  type="password"
                  placeholder={t.adminPassword}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b]"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#4ca14b] text-white font-bold py-3.5 rounded-xl hover:bg-[#408a3f] transition-colors"
              >
                {t.verify}
              </button>
            </form>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <div 
          className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowLanguageModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-t-[2.5rem] pt-12 pb-14 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
              <button 
                onClick={() => { setLanguage('kurdish'); setShowLanguageModal(false); }}
                className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-colors ${language === 'kurdish' ? 'bg-[#4ca14b] text-white' : 'bg-white'}`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kurdistan.svg" alt="Kurdish" className="w-14 h-9 object-cover rounded mb-4" />
                <span className="font-medium text-[15px]">Kurdish</span>
              </button>

              <button 
                onClick={() => { setLanguage('arabic'); setShowLanguageModal(false); }}
                className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-colors ${language === 'arabic' ? 'bg-[#4ca14b] text-white' : 'bg-white'}`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg" alt="Arabic" className="w-14 h-9 object-cover rounded mb-4" />
                <span className="font-medium text-[15px]">Arabic</span>
              </button>

              <button 
                onClick={() => { setLanguage('english'); setShowLanguageModal(false); }}
                className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-colors ${language === 'english' ? 'bg-[#4ca14b] text-white' : 'bg-white'}`}
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
