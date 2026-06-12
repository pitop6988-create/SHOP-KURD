import { CartItem } from '../types';
import { formatPrice } from '../data';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, MoreVertical, MapPin, CheckCircle2 } from 'lucide-react';
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
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#f9fafb] pb-24 w-full">
        <div className="pt-12 pb-4 px-6 flex items-center justify-between relative z-10">
           <div className="flex items-center space-x-2 w-10">
              {onBack && (
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <ChevronLeft size={20} className="text-slate-800" />
                </button>
              )}
           </div>
           <h1 className="font-medium text-slate-900 text-lg flex-1 text-center font-serif">{t.shoppingCart || 'Cart'}</h1>
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
             <MoreVertical size={20} className="text-slate-800" />
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
    <div className="flex flex-col h-full bg-[#f9fafb] w-full relative">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between sticky top-0 z-10 bg-[#f9fafb]">
         <div className="flex items-center space-x-2 w-10">
            {onBack && (
              <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ChevronLeft size={20} className="text-slate-800" />
              </button>
            )}
         </div>
         <h1 className="font-medium text-slate-900 text-lg flex-1 text-center">{t.shoppingCart || 'Cart'}</h1>
         <button onClick={onClear} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors overflow-hidden relative group">
           <MoreVertical size={20} className="text-slate-800 group-hover:opacity-0 transition-opacity" />
           <Trash2 size={18} className="text-red-500 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="px-6 space-y-6 pt-6">
          {items.map(item => (
            <div key={item.product.id} className="flex relative">
               <div className="flex-1 flex items-center bg-white rounded-[1.5rem] pr-5 relative z-10">
                 <div className="w-[120px] h-[120px] bg-slate-100 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center p-3 relative shadow-inner">
                   <img src={item.product.imageUrl} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply" />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center pl-5 py-4">
                   <h3 className="font-medium text-slate-600 text-[15px] mb-3 leading-snug line-clamp-2">{item.product.name}</h3>
                   
                   <div className="flex items-center justify-between mt-auto">
                     <div className="text-lg font-bold text-slate-900">
                        {item.product.price.toLocaleString()} IQD
                     </div>

                     <div className="flex items-center space-x-4 bg-slate-50 rounded-full px-2 py-1 shadow-sm border border-slate-100">
                        <button 
                          onClick={() => item.quantity > 1 ? onUpdateQuantity(item.product.id, item.quantity - 1) : onRemoveItem(item.product.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#4ca14b]"
                        >
                          {item.quantity > 1 ? <Minus size={16} strokeWidth={3} /> : <Trash2 size={14} className="text-red-400" />}
                        </button>
                        <span className="w-3 text-center text-[15px] font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-[#4ca14b] flex items-center justify-center text-white shadow-sm"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-8 px-6 pb-32">
           <div className="flex justify-between items-center px-1">
              <span className="text-[17px] font-bold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-slate-900">{total.toLocaleString()} IQD</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-6 border-t border-slate-100 z-20 pb-8">
         <button 
           onClick={onCheckout}
           className="w-full bg-[#1b8c38] text-white py-4 rounded-full flex items-center justify-center text-[16px] font-medium shadow-md hover:bg-[#15712c] transition-colors"
         >
            Checkout
         </button>
      </div>
    </div>
  );
}
