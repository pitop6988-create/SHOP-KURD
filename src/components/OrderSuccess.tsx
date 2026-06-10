import { Check } from 'lucide-react';

export function OrderSuccess({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white relative w-full items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="w-24 h-24 rounded-full bg-green-100/50 flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#4ca14b] flex items-center justify-center shadow-lg shadow-[#4ca14b]/30">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-2xl font-medium text-slate-800">Order Successful</h2>
      </div>

      <div className="w-full shrink-0 pb-6">
        <button 
          onClick={onContinue}
          className="w-full bg-[#4ca14b] hover:bg-[#408a3f] text-white font-medium py-4 rounded-full transition-colors shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
