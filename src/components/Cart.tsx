import { CartItem } from '../types';
import { formatPrice } from '../data';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, CreditCard, Clock, Zap } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
  onBack,
  onCheckout
}: {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClear: () => void;
  onBack?: () => void;
  onCheckout?: () => void;
}) {
  const { t } = useLanguage();
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] pb-24 w-full">
        <div className="pt-10 pb-4 px-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm relative z-10">
          <div className="flex items-center space-x-2">
             {onBack && (
               <button onClick={onBack} className="p-1 -ml-1">
                 <ChevronLeft size={24} className="text-slate-700" />
               </button>
             )}
             <h1 className="font-medium text-slate-800">{t.shoppingCart}</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-2">
             <ShoppingCart size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-medium text-slate-800">{t.cartEmpty}</h2>
          <p className="text-slate-500 text-sm">{t.cartEmptyDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-20 w-full relative">
      <div className="pt-10 pb-4 px-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
         <div className="flex items-center space-x-2">
            {onBack && (
               <button onClick={onBack} className="p-1 -ml-1">
                 <ChevronLeft size={24} className="text-slate-700" />
               </button>
            )}
            <h1 className="font-medium text-slate-800">{t.shoppingCart}</h1>
         </div>
         <button onClick={onClear} className="w-8 flex justify-end">
           <Trash2 size={20} className="text-slate-400 hover:text-red-500 transition-colors" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map(item => (
          <div key={item.product.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex space-x-4 relative group">
             <button 
               onClick={() => onRemoveItem(item.product.id)}
               className="absolute top-3 right-3 text-red-400 bg-red-50 p-1 rounded-full opacity-80 hover:opacity-100"
             >
                <Trash2 size={14} />
             </button>
             
             <div className="w-[88px] h-[88px] bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2 border border-slate-50">
               <img src={item.product.imageUrl} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply" />
             </div>
             
             <div className="flex-1 flex flex-col justify-center">
               <h3 className="font-medium text-slate-800 text-[13px] pr-8 mb-1 leading-tight">{item.product.name}</h3>
               <div className="text-xs text-slate-500 mb-3">{item.product.price.toLocaleString()} IQD {t.perUnit}</div>
               
               <div className="flex items-center justify-between mt-auto">
                 <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-[28px] h-[28px] border border-slate-200 rounded flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-medium text-slate-800">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-[28px] h-[28px] border border-slate-200 rounded flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50"
                    >
                      <Plus size={14} />
                    </button>
                 </div>
                 
                 <div className="text-sm font-bold text-orange-500">
                    {t.total}: {formatPrice(item.product.price * item.quantity, item.product.currency)}
                 </div>
               </div>
             </div>
          </div>
        ))}

        <div className="mt-8 bg-white rounded-xl p-5 shadow-sm border border-slate-100 mb-8 mx-1">
           <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-slate-800">{t.total}</span>
              <span className="text-xl font-bold text-orange-500">{formatPrice(total, 'IQD')}</span>
           </div>
           
           <div className="grid grid-cols-2 gap-3 mb-3">
              <button className="bg-[#4ca14b] text-white py-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium shadow-sm hover:bg-[#408a3f] transition-colors">
                 <Zap size={16} fill="currentColor" className="opacity-80" />
                 <span>{t.orderNow}</span>
              </button>
              <button className="bg-white border hover:bg-slate-50 border-slate-200 text-slate-600 py-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium shadow-sm transition-colors">
                 <Clock size={16} className="opacity-80" />
                 <span>{t.scheduleOrder}</span>
              </button>
           </div>
           
           <button 
             onClick={onCheckout}
             className="w-full bg-[#4ca14b] text-white mt-1 py-3.5 rounded-lg flex items-center justify-center space-x-2 text-[15px] font-medium shadow-sm hover:bg-[#408a3f] transition-colors"
           >
              <CreditCard size={18} className="opacity-90" />
              <span>{t.proceedToCheckout}</span>
           </button>
        </div>
      </div>
    </div>
  );
}
