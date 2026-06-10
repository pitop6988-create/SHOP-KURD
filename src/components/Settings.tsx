import { ChevronRight, HeadphonesIcon, Moon, Globe, LogIn, Lock } from 'lucide-react';

export function Settings({ onNavigateToAdmin }: { onNavigateToAdmin?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full relative">
      <div className="pt-10 pb-4 flex justify-center items-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="font-medium text-slate-800">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col items-center mt-10 mb-6">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center">
            Mizgin Hat Co.
          </h1>
          <p className="text-lg italic text-slate-800 font-serif mt-1 font-medium">For All LPG Service</p>
        </div>

        <div className="text-center text-slate-400 text-sm mb-8 font-medium">
          Version 1.0.0
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mx-4 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <HeadphonesIcon size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">Support</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Moon size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">Theme</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-700">
                <Globe size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">Language</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={onNavigateToAdmin}
            className="w-full flex items-center justify-between p-4 border-t border-slate-100 hover:bg-slate-50 transition-colors bg-amber-50/50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Lock size={20} />
              </div>
              <span className="font-medium text-slate-700 text-base">Admin Dashboard</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
