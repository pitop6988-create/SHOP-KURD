import { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, MoreVertical, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function ProductDetail({
  product,
  onBack,
  onAddToCart
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, q: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = product.imageUrls && product.imageUrls.length > 0 
      ? [product.imageUrl, ...product.imageUrls.filter(url => url !== product.imageUrl)] 
      : [product.imageUrl];

  return (
    <div className="flex flex-col h-full bg-white w-full absolute inset-0 z-20 overflow-hidden">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between z-10 sticky top-0 bg-white">
         <div className="w-10">
           <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
             <ChevronLeft size={28} className="text-slate-900" strokeWidth={2.5} />
           </button>
         </div>
         <h1 className="font-semibold text-slate-900 text-[18px] flex-1 text-center font-sans tracking-tight">
            👟 {product.name}
         </h1>
         <div className="w-10 flex justify-end">
           <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-slate-50 transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-32">
        <div className="w-full bg-[#f0eff4] rounded-[2.5rem] relative mt-2 pt-8 pb-16 flex flex-col items-center">
           <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
           </div>
           
           <div className="w-full h-[260px] relative px-4 flex items-center justify-center">
              <img 
                src={allImages[currentImageIndex]} 
                alt={product.name} 
                className="w-[90%] h-full object-contain mix-blend-multiply drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] scale-[1.1] translate-y-2 z-0" 
              />
           </div>

           <div className="absolute bottom-4 left-4 right-4 h-12 bg-white/70 backdrop-blur-md rounded-full flex items-center px-2 shadow-sm border border-white/40">
              <div className="bg-[#f2f2f2] w-14 h-8 rounded-full flex items-center justify-center space-x-1 pl-1">
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                 <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              </div>
              <div className="flex-1 ml-2 bg-white h-8 rounded-full shadow-inner"></div>
           </div>
        </div>

        <div className="flex justify-between space-x-3 mt-6 pb-4 overflow-x-auto w-full hide-scrollbar">
            {allImages.slice(0, 5).map((img, idx) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentImageIndex(idx)}
                 className={`w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-3xl flex-shrink-0 flex items-center justify-center p-2 transition-all relative overflow-hidden ${currentImageIndex === idx ? 'border-[2.5px] border-slate-900 shadow-inner' : 'bg-[#f4f3f8] border border-transparent opacity-90 hover:opacity-100'}`}
               >
                  {currentImageIndex === idx && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                  )}
                  <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm relative z-10" />
               </button>
            ))}
        </div>

        <div className="flex justify-between items-start mt-8 w-full px-1">
           <h2 className="text-[24px] font-bold text-slate-900 leading-snug flex-1 pr-4">{product.name}</h2>
           <div className="text-[22px] font-bold text-slate-900">{product.price.toLocaleString()} IQD</div>
        </div>

        <div className="mt-8 flex items-center justify-center w-full px-1 mb-8">
           <div className="flex items-center justify-between bg-[#f5f4f7] rounded-full p-1.5 w-full max-w-[200px]">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-600 bg-white shadow-sm hover:bg-slate-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="w-12 text-center text-[20px] font-bold text-slate-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-[#f46036] flex items-center justify-center text-white shadow-sm hover:bg-[#e0542d] transition-colors"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
           </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white p-5 pb-8 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-slate-100">
         <button 
           onClick={() => {
              onAddToCart(product, quantity);
              onBack();
           }}
           className="w-full bg-[#f46036] text-white py-[18px] rounded-full flex items-center justify-center text-[18px] font-bold shadow-[0_8px_20px_rgba(244,96,54,0.3)] hover:bg-[#e0542d] transition-all active:scale-[0.98]"
         >
            {t.addToCart || 'Checkout Now'}
         </button>
      </div>
    </div>
  );
}
