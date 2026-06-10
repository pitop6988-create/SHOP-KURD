import React from 'react';
import { Store, ShoppingCart, ShoppingBag, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export function BottomNav({ currentTab, onTabChange, cartItemCount }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 pb-6 px-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <NavItem 
        icon={<Store size={22} className={currentTab === 'services' ? 'fill-current' : ''} />} 
        label="Services" 
        isActive={currentTab === 'services'} 
        onClick={() => onTabChange('services')} 
      />
      <NavItem 
        icon={
          <div className="relative">
            <ShoppingCart size={22} className={currentTab === 'cart' ? 'fill-current' : ''} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#4ca14b] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </div>
        } 
        label="Shopping Cart" 
        isActive={currentTab === 'cart'} 
        onClick={() => onTabChange('cart')} 
      />
      <NavItem 
        icon={<ShoppingBag size={22} className={currentTab === 'orders' ? 'fill-current' : ''} />} 
        label="Orders" 
        isActive={currentTab === 'orders'} 
        onClick={() => onTabChange('orders')} 
      />
      <NavItem 
        icon={<Settings size={22} className={currentTab === 'settings' ? 'fill-current' : ''} />} 
        label="Settings" 
        isActive={currentTab === 'settings'} 
        onClick={() => onTabChange('settings')} 
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full space-y-1 pt-2 pb-1 transition-colors ${isActive ? 'text-[#4ca14b]' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <div className={isActive ? 'text-[#4ca14b]' : ''}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
