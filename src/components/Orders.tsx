import { ChevronLeft, Heart, Clock, Map, MapPin, Truck, Check, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';
import { GPSTracking } from './GPSTracking';

export function Orders({ onBack }: { onBack?: () => void }) {
  const [view, setView] = useState<'status' | 'tracking'>('status');

  if (view === 'tracking') {
    return <GPSTracking onBack={() => setView('status')} />;
  }

  return (
    <div className="flex flex-col h-full bg-white w-full relative pb-20 overflow-y-auto">
      <div className="pt-10 pb-4 px-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-50">
        {onBack ? (
          <button onClick={onBack} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        <div className="flex flex-col items-center">
          <h1 className="font-medium text-slate-800 text-[15px]">Order Status</h1>
          <p className="text-[11px] text-slate-500 font-medium tracking-wider mt-0.5">INVOICE : 12A394</p>
        </div>
        <button className="p-1 -mr-1 text-blue-500">
          <Heart size={20} />
        </button>
      </div>

      <div className="flex flex-col px-8 pt-8">
        {/* Placeholder Graphic */}
        <div className="flex justify-center mb-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
             {/* Simple visual representation resembling the screenshot's graphic */}
             <div className="absolute w-16 h-20 bg-red-500 left-4 bottom-4 rounded-sm border-2 border-slate-800 z-10 flex flex-col justify-end overflow-hidden pb-1">
                <div className="w-2 h-12 bg-[#fbbf24] absolute left-1 bottom-0 border border-slate-800 transform rotate-[-5deg]"></div>
                <div className="w-2 h-14 bg-[#fbbf24] absolute left-4 bottom-0 border border-slate-800"></div>
                <div className="w-2 h-16 bg-[#fbbf24] absolute left-7 bottom-0 border border-slate-800"></div>
                <div className="w-2 h-12 bg-[#fbbf24] absolute left-10 bottom-0 border border-slate-800 transform rotate-[5deg]"></div>
                <div className="w-full h-1/2 bg-red-600/50 absolute bottom-0"></div>
             </div>
             <div className="absolute w-14 h-24 bg-pink-400 right-2 bottom-4 rounded-sm border-2 border-slate-800">
                <div className="w-full h-4 border-b-2 border-slate-800 bg-slate-200"></div>
                <div className="w-full h-3 border-b-2 border-slate-800 bg-slate-100"></div>
                <div className="w-full h-1/2 border-b-2 border-slate-800 bg-pink-500/50 absolute bottom-0 rounded-b-sm"></div>
             </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-4 mb-10">
          {/* Vertical Line */}
          <div className="absolute left-[15px] top-4 bottom-12 w-[2px] border-l-2 border-dashed border-blue-200"></div>
          
          {/* Order Received */}
          <div className="flex items-start mb-8 relative">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 z-10 mr-4 mt-0.5 relative">
              <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-50 blur-sm"></div>
              <Clock size={16} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-slate-700 mb-1">Order received</h3>
              <p className="text-xs text-slate-400 flex items-center">
                <Clock size={10} className="mr-1" />
                09.10 AM, 9 May 2018
              </p>
            </div>
          </div>

          {/* On the way */}
          <div className="flex items-start mb-8 relative">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 z-10 mr-4 mt-0.5">
              <Map size={14} />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-slate-700 mb-1">On the way</h3>
              <p className="text-xs text-slate-400 flex items-center mb-3">
                <Clock size={10} className="mr-1" />
                09.15 AM, 9 May 2018
              </p>
              <button 
                onClick={() => setView('tracking')}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center transition-colors shadow-sm"
              >
                TRACKING <div className="ml-2 w-1.5 h-1.5 bg-white rounded-full relative"><div className="absolute inset-0 rounded-full animate-ping border border-white"></div></div>
              </button>
            </div>
          </div>

          {/* Delivered */}
          <div className="flex items-start relative">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-300 shrink-0 z-10 mr-4 mt-0.5">
              <Check size={16} />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-slate-400 mb-1">Delivered</h3>
              <p className="text-xs text-slate-400 flex items-center">
                <Clock size={10} className="mr-1" />
                Finish time in 3 min
              </p>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-[1.25rem] transition-colors mt-auto shadow-md">
          Confirm Delivery
        </button>
      </div>
    </div>
  );
}
