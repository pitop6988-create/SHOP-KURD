import React from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export function BottomNav({ currentTab, onTabChange, cartItemCount }: BottomNavProps) {
  const { t } = useLanguage();
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[95%] bg-white rounded-[2.5rem] p-2 z-30 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100">
       <div className="bg-[#f0f2f5] rounded-[2rem] flex items-center justify-between px-2 py-1.5 shadow-inner space-x-1 sm:space-x-2">
          <NavItem 
            icon={Home} 
            label={t.services || 'Home'} 
            isActive={currentTab === 'services'} 
            onClick={() => onTabChange('services')} 
          />
          <NavItem 
            icon={ShoppingBag} 
            label={t.orders || 'Orders'} 
            isActive={currentTab === 'orders'} 
            onClick={() => onTabChange('orders')} 
          />
          <NavItem 
            icon={User} 
            label={t.settings || 'Account'} 
            isActive={currentTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
          />
       </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }: { icon: any; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all duration-300 rounded-[1.8rem] w-[70px] sm:w-[84px] h-[60px] ${isActive ? 'bg-[#222222] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
    >
      <div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
        <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'fill-current text-white mix-blend-screen' : ''} />
      </div>
      <span className={`text-[11px] sm:text-[12px] tracking-wide ${isActive ? 'font-medium' : 'font-normal'}`}>{label}</span>
    </button>
  );
}
