import { CartItem } from '../types';
import { formatPrice } from '../data';
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, MoreHorizontal, CheckCircle2 } from 'lucide-react';
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
  const shippingAndTax = subtotal > 0 ? 5000 : 0;
  const total = subtotal + shippingAndTax;

  const bgColors = ["bg-[#efdfdc]", "bg-[#e2e2cb]", "bg-[#ebdada]", "bg-[#dce9eb]"];

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#f5f4f7] pb-24 w-full absolute inset-0 z-20">
        <div className="pt-12 pb-4 px-6 flex items-center justify-between relative z-10">
           <div className="flex items-center space-x-2 w-12">
              {onBack && (
                <button onClick={onBack} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                  <ChevronLeft size={24} className="text-slate-800" />
                </button>
              )}
           </div>
           <h1 className="font-semibold text-slate-900 text-xl flex-1 text-center font-sans tracking-tight">Cart</h1>
           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
             <MoreHorizontal size={24} className="text-slate-800" />
           </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-4">
          <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-2">
             <ShoppingCart size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-medium text-slate-800">{t.cartEmpty}</h2>
          <p className="text-slate-500 text-sm">{t.cartEmptyDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f4f7] w-full absolute inset-0 z-20">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between sticky top-0 z-10 bg-[#f5f4f7]">
         <div className="flex items-center space-x-2 w-12">
            {onBack && (
              <button onClick={onBack} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-slate-50 transition-colors">
                <ChevronLeft size={24} className="text-slate-800" />
              </button>
            )}
         </div>
         <h1 className="font-semibold text-slate-900 text-[20px] flex-1 text-center font-sans tracking-tight">Cart</h1>
         <button onClick={onClear} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-slate-50 transition-colors overflow-hidden relative group">
           <MoreHorizontal size={24} className="text-slate-800 group-hover:opacity-0 transition-opacity" />
           <Trash2 size={20} className="text-red-500 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-5 mb-4">
        <div className="bg-white rounded-[2rem] p-5 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-2">
          {items.map((item, idx) => {
             const backgroundColor = bgColors[idx % bgColors.length];
             
             return (
              <div key={item.product.id} className="flex relative items-center">
                 <div className={`w-[110px] h-[110px] ${backgroundColor} rounded-3xl flex-shrink-0 flex items-center justify-center p-3`}>
                   <img src={item.product.imageUrl} alt={item.product.name} className="object-contain w-full h-full mix-blend-multiply drop-shadow-sm" />
                 </div>
                 
                 <div className="flex-1 pl-4 flex flex-col justify-center">
                   <h3 className="font-semibold text-slate-800 text-[15px] leading-snug mb-1 pr-2 line-clamp-2">{item.product.name}</h3>
                   <span className="text-[#619c9e] text-[13px] font-medium mb-1 line-clamp-1">{item.product.category || 'The Blue Buffalo'}</span>
                   <div className="text-[15px] font-bold text-slate-800 mb-2">
                      {item.product.price.toLocaleString()} IQD
                   </div>

                   <div className="flex items-center justify-between border border-slate-200 rounded-full w-[100px] h-9 p-0.5 mt-1">
                      <button 
                        onClick={() => item.quantity > 1 ? onUpdateQuantity(item.product.id, item.quantity - 1) : onRemoveItem(item.product.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        {item.quantity > 1 ? <Minus size={16} strokeWidth={2.5} /> : <Trash2 size={14} className="text-red-400" />}
                      </button>
                      <span className="text-[14px] font-semibold text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#f46036] flex items-center justify-center text-white shadow-sm hover:bg-[#e0542d] transition-colors"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                   </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] pt-6 pb-6 px-7 shadow-[0_-5px_30px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.04)] z-20 mx-4 mb-6">
         <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-[15px]">
               <span className="text-slate-500 font-medium tracking-wide">Sub total</span>
               <span className="font-bold text-slate-800">{subtotal.toLocaleString()} IQD</span>
            </div>
            {shippingAndTax > 0 && (
              <div className="flex justify-between items-center text-[15px]">
                 <span className="text-slate-500 font-medium tracking-wide">Shipping & tax</span>
                 <span className="font-bold text-slate-800">{shippingAndTax.toLocaleString()} IQD</span>
              </div>
            )}
         </div>

         <div className="border-t-[1.5px] border-slate-200 border-dashed mb-5"></div>

         <div className="flex justify-between items-center mb-6">
            <span className="text-[17px] font-bold text-slate-900 tracking-wide">Total</span>
            <span className="text-[19px] font-bold text-slate-900">{total.toLocaleString()} IQD</span>
         </div>

         <button 
           onClick={onCheckout}
           className="w-full bg-[#f46036] text-white py-[16px] rounded-full flex items-center justify-center text-[17px] font-bold shadow-[0_8px_20px_rgba(244,96,54,0.3)] hover:bg-[#e0542d] hover:shadow-[0_8px_20px_rgba(244,96,54,0.4)] transition-all active:scale-[0.98]"
         >
            Checkout Now
         </button>
      </div>
    </div>
  );
}
