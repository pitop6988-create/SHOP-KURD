import { Product } from '../types';
import { formatPrice } from '../data';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export function Services({ 
  products,
  onProductClick,
  onAddToCart
}: { 
  products: Product[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
}) {
  const { t } = useLanguage();

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-24 overflow-y-auto w-full">
      <div className="pt-10 pb-4 flex justify-center items-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="font-medium text-slate-800">{t.services}</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {products.map((product, index) => (
          <motion.div 
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            key={product.id} 
            className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onProductClick(product)}
          >
            <div className="aspect-square w-full rounded-lg bg-slate-50 mb-3 overflow-hidden flex items-center justify-center p-2 relative">
              <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full rounded-lg mix-blend-darken" />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-[13px] font-medium text-slate-800 leading-tight mb-2 flex-1">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-500 font-bold text-[13px]">
                  {formatPrice(product.price, product.currency)}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 1);
                  }}
                  className="bg-[#4ca14b] text-white p-1.5 rounded-full hover:bg-[#408a3f] transition-colors shadow-sm"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
