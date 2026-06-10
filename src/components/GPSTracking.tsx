import { ChevronLeft, Phone, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary, Pin } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({ strokeColor: '#16a34a', strokeOpacity: 0.8, strokeWeight: 5 });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport, 40);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
}

export function GPSTracking({ onBack }: { onBack: () => void }) {
  const origin = { lat: 39.123, lng: -84.538 }; // Example: Queen City Ave & Harrison Ave area
  const destination = { lat: 39.135, lng: -84.545 };

  if (!hasValidKey) {
    return (
      <div className="flex flex-col h-full bg-slate-100 p-6 items-center justify-center text-center w-full">
        <h2 className="text-xl font-bold mb-4">Google Maps API Key Required</h2>
        <p className="text-sm text-slate-600 mb-2">Open Settings (gear icon) → Secrets</p>
        <p className="text-sm text-slate-600 mb-4">Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
        <button onClick={onBack} className="text-[#4ca14b] font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
         <APIProvider apiKey={API_KEY} version="weekly">
           <Map
             defaultCenter={{ lat: 39.129, lng: -84.541 }}
             defaultZoom={14}
             mapId="DEMO_MAP_ID"
             internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
             style={{ width: '100%', height: '100%' }}
             disableDefaultUI={true}
           >
             <AdvancedMarker position={origin}>
                <div className="text-3xl filter drop-shadow-md">🛵</div>
             </AdvancedMarker>
             
             <AdvancedMarker position={destination}>
                <div className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-[#16a34a] bg-white shadow-lg flex items-center justify-center">
                  <img src="https://ui-avatars.com/api/?name=User&background=f1f5f9&color=64748b" alt="User" className="w-full h-full object-cover" />
                </div>
             </AdvancedMarker>
             
             <RouteDisplay origin={origin} destination={destination} />
           </Map>
         </APIProvider>
      </div>

      <div className="pt-12 px-6 flex items-center justify-between bg-transparent relative z-10 pointer-events-none">
        <button onClick={onBack} className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-800 pointer-events-auto">
          <ChevronLeft size={24} />
        </button>
        <div className="uppercase font-bold tracking-widest text-slate-800 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
          FAIRS
        </div>
        <div className="w-12 h-12"></div>
      </div>

      <div className="absolute bottom-6 left-4 right-4 z-20">
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col pointer-events-auto">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <span className="text-slate-400 font-medium tracking-wide text-sm">Shipper</span>
            <div className="flex justify-center flex-1">
               <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-xl mr-4 overflow-hidden shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Tod+Schmitt&background=334155&color=fff" alt="Shipper" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Tod Schmitt</h2>
                <div className="flex text-[#fbbf24] text-xs">
                  ★ ★ ★ ★ ★
                </div>
              </div>
            </div>
            
            <button className="w-14 h-14 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#16a34a]/30">
              <Phone size={24} fill="currentColor" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl">
              <span className="text-slate-500 font-medium">Estimated Time</span>
              <span className="font-bold text-slate-800 text-lg">23 Min</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl">
              <span className="text-slate-500 font-medium">Total Amount</span>
              <span className="font-bold text-[#16a34a] text-lg">$9.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
