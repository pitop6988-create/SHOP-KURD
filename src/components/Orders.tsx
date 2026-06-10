import { ChevronLeft, Check, X, Clock, Plane, Navigation } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../data';

export function Orders({ onBack, orders }: { onBack?: () => void; orders?: Order[] }) {
  const latestOrder = orders && orders.length > 0 ? orders[0] : null;

  return (
    <div className="flex flex-col h-full bg-slate-900 relative w-full items-center overflow-y-auto">
      <div className="w-full pt-10 pb-4 px-4 flex items-center justify-between sticky top-0 bg-slate-900 z-10 shrink-0">
        {onBack ? (
          <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
        <div className="flex flex-col items-center">
          <h1 className="font-medium text-white text-[15px]">My Order Status</h1>
        </div>
        <div className="w-10"></div>
      </div>

      {!latestOrder ? (
         <div className="flex-1 flex items-center justify-center text-slate-500">
           No orders yet.
         </div>
      ) : (
        <div className="flex-1 flex flex-col items-center w-full px-6 pt-6 pb-10">
          {latestOrder.status === 'confirmed' || latestOrder.status === 'delivered' ? (
            <div className="flex flex-col items-center w-full">
              <div className="w-24 h-24 bg-[#4ca14b] rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(76,161,75,0.4)] animate-in zoom-in duration-300">
                <Plane size={48} className="text-white -rotate-45 ml-1 mb-1" />
              </div>

              <h2 className="text-white font-bold text-2xl mb-1 text-center">Order Accepted</h2>
              <p className="text-white/60 mb-10 text-center">Order # {latestOrder.id.toUpperCase()}</p>
            </div>
          ) : latestOrder.status === 'cancelled' ? (
             <div className="flex flex-col items-center w-full mb-10">
               <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mb-6 animate-in zoom-in duration-300 shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                 <X size={48} className="text-white" strokeWidth={3} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Order Rejected</h2>
               <p className="text-white/60 text-center text-sm">We are sorry, your order {latestOrder.id.toUpperCase()} could not be processed.</p>
             </div>
          ) : (
             <div className="flex flex-col items-center w-full mb-10">
               <div className="w-24 h-24 rounded-full bg-[#fbbc04] flex items-center justify-center mb-6 animate-in zoom-in duration-300 shadow-[0_0_40px_rgba(251,188,4,0.4)]">
                 <Clock size={48} className="text-white" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Pending Review</h2>
               <p className="text-white/60 text-center text-sm">Waiting for admin approval.</p>
             </div>
          )}

          {latestOrder.status !== 'cancelled' && (
            <div className="w-full bg-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0 mt-1">
                  <Navigation size={20} />
                </div>
                <div className="flex-1 text-white">
                  <h4 className="font-bold text-lg mb-1">Delivery Address</h4>
                  <p className="opacity-80">{latestOrder.customerName}</p>
                  <p className="opacity-80 mt-1">{latestOrder.address}</p>
                  <p className="opacity-80 mt-1">{latestOrder.phone}</p>
                </div>
              </div>
              
              <div className="h-px bg-white/20 w-full" />
              
              <div className="text-white">
                 <h4 className="font-bold text-lg mb-3">Order Items</h4>
                 <ul className="space-y-2 opacity-80">
                   {latestOrder.items.map(item => (
                      <li key={item.product.id} className="flex justify-between items-center">
                         <span>{item.quantity}x {item.product.name}</span>
                         <span className="font-medium">{formatPrice(item.product.price * item.quantity, item.product.currency)}</span>
                      </li>
                   ))}
                 </ul>
              </div>
              
              <div className="h-px bg-white/20 w-full" />
              
              <div className="flex justify-between items-center text-white text-lg font-bold pt-2">
                <span>Total</span>
                <span>{formatPrice(latestOrder.total, 'IQD')}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
