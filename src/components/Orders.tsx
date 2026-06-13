import { ChevronLeft, Check, X, Clock, Wallet, QrCode } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../data';
import { useLanguage } from '../LanguageContext';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';

export function Orders({ onBack, orders }: { onBack?: () => void; orders?: Order[] }) {
  const { t } = useLanguage();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setWalletBalance(snapshot.data().walletBalance || 0);
        }
      }, (error) => console.error(error));
      return () => unsubscribeUser();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 relative w-full items-center overflow-y-auto">
      <div className="w-full pt-10 pb-4 px-4 flex items-center justify-between sticky top-0 bg-slate-900 z-10 shrink-0 border-b border-white/10">
        {onBack ? (
          <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
        <div className="flex flex-col items-center">
          <h1 className="font-medium text-white text-[15px]">{t.myOrderStatus}</h1>
        </div>
        <button onClick={() => setShowQR(!showQR)} className="p-2 -mr-2 text-[#4ca14b] rounded-full transition-colors">
          <QrCode size={24} />
        </button>
      </div>

      {showQR && auth.currentUser && (
        <div className="w-full bg-slate-800 p-6 flex flex-col items-center border-b border-white/10">
          <div className="bg-white p-4 rounded-xl mb-4 shadow-lg">
            <QRCodeSVG value={auth.currentUser.uid} size={150} />
          </div>
          <div className="flex items-center space-x-2 text-[#4ca14b]">
            <Wallet size={20} />
            <span className="font-bold text-xl">{formatPrice(walletBalance, 'IQD')}</span>
          </div>
          <p className="text-white/60 text-sm mt-2 text-center">Show this QR code to the admin to pay or add money</p>
        </div>
      )}

      {!orders || orders.length === 0 ? (
         <div className="flex-1 flex items-center justify-center text-slate-400">
           {t.noOrders}
         </div>
      ) : (
        <div className="flex-1 flex flex-col w-full px-4 pt-4 pb-10 space-y-4">
          {orders.map(order => (
            <div key={order.id} className="w-full bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{t.orderHash}{order.id.toUpperCase()}</h3>
                  <p className="text-white/60 text-sm mt-0.5">{new Date(order.date).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-4">
                  <span className="text-sm font-medium text-white/80 mr-1 capitalize">
                    {order.status === 'confirmed' ? t.accepted : order.status === 'cancelled' ? t.rejected : t.pending}
                  </span>
                  {order.status === 'confirmed' || order.status === 'delivered' ? (
                    <div className="w-8 h-8 rounded-full bg-[#4ca14b] flex items-center justify-center shadow-[0_0_15px_rgba(76,161,75,0.3)]">
                      <Check size={18} className="text-white" strokeWidth={3} />
                    </div>
                  ) : order.status === 'cancelled' ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <X size={18} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#fbbc04] flex items-center justify-center shadow-[0_0_15px_rgba(251,188,4,0.3)]">
                      <Clock size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 opacity-90 text-white mb-4">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center p-1 mr-3 shrink-0 overflow-hidden">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <span className="font-medium pr-2 leading-tight">{item.quantity}x {item.product.name}</span>
                    </div>
                    <span className="font-medium shrink-0">{formatPrice(item.product.price * item.quantity, item.product.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/20 pt-3 text-white">
                <span className="font-bold">{t.total}</span>
                <span className="font-bold">{formatPrice(order.total, 'IQD')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
