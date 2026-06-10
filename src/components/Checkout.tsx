import { useState } from 'react';
import { ChevronLeft, Circle, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../data';

export function Checkout({ onBack, onSuccess, total }: { onBack: () => void; onSuccess: () => void; total: number }) {
  const [view, setView] = useState<'methods' | 'add_method'>('methods');
  const [selectedMethod, setSelectedMethod] = useState('mastercard');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, value: string} | null>(null);

  const applyCode = () => {
    try {
      const savedCodes = JSON.parse(localStorage.getItem('payment_codes') || '[]');
      const found = savedCodes.find((c: any) => c.code === discountCode.toUpperCase());
      if (found) {
        setAppliedDiscount(found);
      } else {
        alert('Invalid or expired code');
      }
    } catch {
      alert('Error applying code');
    }
  };

  const methods = [
    { id: 'mastercard', name: 'Master Card', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' },
    { id: 'paypal', name: 'Pay Pal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { id: 'visa', name: 'Visa Card', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png' },
    { id: 'gpay', name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
  ];

  const shippingFee = 3000; // 3000 IQD as dummy shipping

  if (view === 'add_method') {
    return (
      <div className="flex flex-col h-full bg-white w-full relative">
        <div className="pt-10 pb-4 px-4 flex items-center bg-white sticky top-0 z-10">
          <button onClick={() => setView('methods')} className="w-8 h-8 rounded bg-[#4ca14b] text-white flex items-center justify-center mr-6">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-medium text-slate-800 text-lg">Add Payment Method</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Card Name</label>
            <input 
              type="text" 
              defaultValue="Popoola Opeyemi" 
              className="w-full bg-slate-100/80 border-none rounded-lg px-4 py-3.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Card Number</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="2763 3482 3580 394" 
                className="w-full bg-slate-100/80 border-none rounded-lg pl-4 pr-12 py-3.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]"
              />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-auto" />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-slate-800">Expiration</label>
              <input 
                type="text" 
                defaultValue="09/26" 
                className="w-full bg-slate-100/80 border-none rounded-lg px-4 py-3.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-slate-800">CVV</label>
              <input 
                type="text" 
                defaultValue="799" 
                className="w-full bg-slate-100/80 border-none rounded-lg px-4 py-3.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Postal Code</label>
            <input 
              type="text" 
              defaultValue="993483" 
              className="w-full bg-slate-100/80 border-none rounded-lg px-4 py-3.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]"
            />
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-white shrink-0 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onSuccess}
            className="w-full py-4 bg-[#4ca14b] hover:bg-[#408a3f] text-white rounded-lg font-medium shadow-md shadow-[#4ca14b]/30 transition-colors"
          >
            Add Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white w-full relative">
      <div className="pt-10 pb-4 px-4 flex items-center bg-white sticky top-0 z-10">
        <button onClick={onBack} className="w-8 h-8 rounded bg-[#4ca14b] text-white flex items-center justify-center mr-6">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-medium text-slate-800 text-lg">Payment Method</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
        <div className="space-y-4 mb-10">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                selectedMethod === method.id 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 flex justify-center">
                  <img src={method.logo} alt={method.name} className="h-5 object-contain" />
                </div>
                <span className="font-medium text-slate-700 text-[15px]">{method.name}</span>
              </div>
              {selectedMethod === method.id ? (
                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-green-500 rounded-full" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium text-slate-600">
            <span>Cost Of Purchase</span>
            <span className="text-slate-800">{formatPrice(total, 'IQD')}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-slate-600">
            <span>Shipping Fee</span>
            <span className="text-slate-800">{formatPrice(shippingFee, 'IQD')}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between items-center text-sm font-medium text-green-600">
              <span>Discount ({appliedDiscount.code})</span>
              <span>- {appliedDiscount.value}</span>
            </div>
          )}
          <div className="h-px bg-slate-100 w-full my-2"></div>
          <div className="flex justify-between items-center text-[15px] font-bold text-slate-800">
            <span>Total</span>
            <span>{formatPrice(total + shippingFee, 'IQD')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-8">
          <input 
            type="text" 
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Enter Code"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] uppercase"
          />
          <button onClick={applyCode} className="px-4 py-3 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
            Add Code
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-6 bg-white shrink-0 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onSuccess}
          disabled={!appliedDiscount}
          className={`w-full py-4 rounded-lg font-medium shadow-md transition-all ${
            appliedDiscount 
              ? 'bg-[#4ca14b] text-white shadow-[#4ca14b]/30 hover:bg-[#408a3f]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
