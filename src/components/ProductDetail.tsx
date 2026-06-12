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
    <div className="flex flex-col h-full bg-[#f9fafb] w-full absolute top-0 left-0 z-20 overflow-hidden">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between z-10 sticky top-0 bg-[#f9fafb]">
         <div className="w-10">
           <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
             <ChevronLeft size={24} className="text-slate-800" />
           </button>
         </div>
         <h1 className="font-medium text-slate-900 text-lg flex-1 text-center font-serif">Sneakers Detail</h1>
         <div className="w-10 flex justify-end">
           <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors">
             <MoreVertical size={20} className="text-slate-800" />
           </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex justify-center items-center py-6 px-8 relative mt-10">
           <div className="w-full max-w-[320px] h-[280px] relative">
              <img 
                src={allImages[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl translate-y-[-10px] scale-[1.15]" 
              />
              
              <div className="absolute -bottom-8 left-0 right-0 w-[120%] -ml-[10%] h-32 border-b-[1.5px] border-slate-400/40 rounded-[100%] overflow-hidden pointer-events-none">
                 <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-10 h-6 bg-black rounded-full flex items-center justify-center cursor-pointer pointer-events-auto">
                    <div className="flex space-x-1 border border-white/20 p-1 rounded-full px-2">
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="px-6 flex justify-center space-x-3 mt-12 mb-8 overflow-x-auto pb-4 max-w-full">
            {allImages.map((img, idx) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentImageIndex(idx)}
                 className={`w-20 h-20 rounded-[14px] flex-shrink-0 flex items-center justify-center p-3 transition-all ${currentImageIndex === idx ? 'border-2 border-[#1b8c38] shadow-sm' : 'bg-slate-100 border border-transparent opacity-80 hover:opacity-100'}`}
               >
                  <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" />
               </button>
            ))}
        </div>

        <div className="px-6 flex justify-between items-start mt-6 w-full">
           <h2 className="text-[22px] font-bold text-slate-800 leading-snug flex-1 pr-4">{product.name}</h2>
           <div className="text-[22px] font-bold text-slate-900">{product.price.toLocaleString()} IQD</div>
        </div>

        <div className="px-6 mt-8 flex items-center justify-center mb-32">
           <div className="flex items-center space-x-5 bg-white rounded-full px-2 py-1.5 shadow-sm border border-slate-100 w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#4ca14b] bg-white border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="w-6 text-center text-[18px] font-bold text-slate-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-[#1b8c38] flex items-center justify-center text-white shadow-sm hover:bg-[#15712c] transition-colors"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
           </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-6 border-t border-slate-100 z-20 pb-8">
         <button 
           onClick={() => {
              onAddToCart(product, quantity);
              onBack();
           }}
           className="w-full bg-[#1b8c38] text-white py-4 rounded-full flex items-center justify-center text-[16px] font-medium shadow-md hover:bg-[#15712c] transition-colors"
         >
            {t.addToCart || 'Add to Cart'}
         </button>
      </div>
    </div>
  );
}
