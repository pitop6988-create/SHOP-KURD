import { useState } from 'react';
import { ChevronLeft, Plus, Image as ImageIcon, Package, Check, X, Clock, Navigation } from 'lucide-react';
import { Product, Order } from '../types';
import { formatPrice } from '../data';

export function AdminDashboard({ 
  onBack, 
  products,
  onAddProduct,
  orders,
  onUpdateOrderStatus
}: { 
  onBack: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
  
  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) return;

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      price: parseInt(newItemPrice) || 0,
      currency: 'IQD',
      imageUrl: newItemImage
    };

    onAddProduct(newProduct);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full relative">
      <div className="pt-10 pb-4 px-4 flex items-center bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center mr-4 text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-medium text-slate-800 text-lg">Admin Dashboard</h1>
      </div>

      <div className="flex border-b border-slate-200 bg-white px-4 shrink-0">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          Products
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        {activeTab === 'orders' && (
          <div className="p-4 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center text-slate-400 py-10">No orders yet</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-lg">Order # {order.id.toUpperCase()}</h3>
                    <span className="text-sm font-medium text-slate-400">
                      {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="text-[15px] text-slate-500">
                    <span className="font-medium opacity-80">Payment Type: </span>
                    <span className="font-bold text-slate-800">Card</span>
                  </div>

                  <div className="text-[15px] text-slate-500">
                    <span className="font-medium opacity-80">Total Amount: </span>
                    <span className="font-bold text-slate-800">{formatPrice(order.total, 'IQD')}</span>
                  </div>

                  <div className="text-[15px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    <span className="font-medium opacity-80">Products: </span>
                    <span className="font-bold text-slate-800">
                      {order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-3">
                    <button 
                      onClick={() => onUpdateOrderStatus(order.id, 'confirmed')}
                      disabled={order.status !== 'pending'}
                      className={`flex-1 py-1.5 rounded-full text-sm font-bold transition-colors ${
                        order.status === 'pending' 
                          ? 'bg-[#3fb858] hover:bg-[#32a84a] text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {order.status === 'confirmed' || order.status === 'delivered' ? 'Accepted' : 'Accept'}
                    </button>
                    <button 
                      onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status !== 'pending'}
                      className={`flex-1 py-1.5 rounded-full text-sm font-bold transition-colors ${
                        order.status === 'pending'
                          ? 'bg-[#ed6a5e] hover:bg-[#dc5448] text-white shadow-sm'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      Reject
                    </button>
                    <button 
                      className="flex-1 py-1.5 bg-white border border-slate-800 rounded-full text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-4">
            {!showAddForm ? (
              <>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full mb-6 bg-white border border-dashed border-[#4ca14b] text-[#4ca14b] py-4 rounded-xl flex items-center justify-center font-medium hover:bg-green-50 transition-colors"
                >
                  <Plus size={20} className="mr-2" /> Add New Item
                </button>

                <div className="space-y-4 pb-20">
                  {products.map(product => (
                     <div key={product.id} className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center p-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center p-1 mr-4 shrink-0">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 text-sm leading-tight mb-1">{product.name}</h3>
                          <p className="text-orange-500 font-bold text-sm">{formatPrice(product.price, product.currency)}</p>
                        </div>
                     </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-medium text-slate-800">Add New Item</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <input 
                      type="text" 
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g. Gas Regulator 2.0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Money</label>
                    <input 
                      type="number" 
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Image File</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewItemImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4ca14b]/10 file:text-[#4ca14b] hover:file:bg-[#4ca14b]/20"
                      required
                    />
                    {newItemImage && (
                       <div className="mt-3 w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                         <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#4ca14b] hover:bg-[#408a3f] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm mt-4"
                  >
                    Save Item
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
