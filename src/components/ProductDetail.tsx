import { useState } from 'react';
import { Product } from '../types';
import { formatPrice } from '../data';
import { ChevronLeft, Plus, Minus, Check, ShoppingCart } from 'lucide-react';

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
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full absolute top-0 left-0 z-20 overflow-hidden">
      <div className="flex items-center px-4 pt-10 pb-4 bg-white border-b border-slate-100 shadow-sm relative z-10">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h1 className="flex-1 text-center font-medium text-sm text-slate-800 pr-8 line-clamp-1">{product.name}</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="bg-white w-full aspect-square flex items-center justify-center p-8 border-b border-slate-50">
          <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full max-w-[200px] mix-blend-multiply" />
        </div>

        <div className="p-6 bg-white flex-1 flex flex-col shadow-[0_-8px_20px_rgba(0,0,0,0.02)]">
          <div className="flex-1">
             <h2 className="text-[22px] leading-tight font-medium text-slate-800 mb-2">{product.name}</h2>
             <div className="text-3xl font-bold text-orange-500 mb-8">
               {formatPrice(product.price, product.currency)}
             </div>

             <div className="mb-8 select-none">
               <span className="text-slate-700 text-sm font-medium mb-1 block">Quantity</span>
               <span className="text-xs text-slate-400 mb-3 block">Min: 1</span>
               
               <div className="flex items-center space-x-4">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="w-11 h-11 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
                 >
                   <Minus size={18} />
                 </button>
                 <span className="w-12 text-center font-medium text-lg text-slate-800">{quantity}</span>
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
                 >
                   <Plus size={18} />
                 </button>
               </div>
             </div>
          </div>

          <div className="pb-8 pt-4">
             <button 
               onClick={handleAdd}
               disabled={added}
               className={`w-full py-4 rounded-xl font-medium flex justify-center items-center space-x-2 transition-all shadow-sm ${
                 added ? 'bg-[#4ca14b] text-white' : 
                 'bg-[#4ca14b] text-white hover:bg-[#408a3f]'
               }`}
             >
               {added ? (
                 <>
                   <Check size={20} />
                   <span>Added to cart successfully</span>
                 </>
               ) : (
                 <>
                   <ShoppingCart size={18} />
                   <span>Add to cart</span>
                 </>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
