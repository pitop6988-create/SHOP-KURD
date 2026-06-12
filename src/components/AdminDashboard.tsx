import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Image as ImageIcon, Package, Check, X, Clock, Navigation, Edit2, Trash2, Plane, MapPin, Users, Settings as SettingsIcon } from 'lucide-react';
import { Product, Order, PromoCode, UserProfile } from '../types';
import { formatPrice } from '../data';
import { useLanguage } from '../LanguageContext';
import { doc, setDoc, onSnapshot, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function AdminDashboard({ 
  onBack, 
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  codes,
  onAddCode,
  onDeleteCode
}: { 
  onBack: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct?: (p: Product) => void;
  onDeleteProduct?: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  codes: PromoCode[];
  onAddCode: (code: PromoCode) => void;
  onDeleteCode: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'codes' | 'users' | 'settings'>('orders');
  const { t, language } = useLanguage();
  
  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemImage2, setNewItemImage2] = useState('');
  
  // Codes Tab State
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeValue, setNewCodeValue] = useState('');

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [addingCoinMode, setAddingCoinMode] = useState<string | null>(null);
  const [coinAmount, setCoinAmount] = useState('');

  // App Settings State
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(d => d.data() as UserProfile));
    }, (error) => console.error(error));
    const unsubConfig = onSnapshot(doc(db, 'app_settings', 'general'), (snapshot) => {
      if (snapshot.exists()) {
        setAppVersion(snapshot.data().version || '1.0.0');
      } else {
        setAppVersion('1.0.0');
      }
    }, (error) => console.error(error));
    return () => { unsubUsers(); unsubConfig(); };
  }, []);

  const saveCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName || !newCodeValue) return;
    
    // Pass to parent
    onAddCode({
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      code: newCodeName.toUpperCase(),
      value: newCodeValue
    });
    
    setNewCodeName('');
    setNewCodeValue('');
  };

  const deleteCode = (id: string) => {
    onDeleteCode(id);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) return;

    const urls = [];
    if (newItemImage) urls.push(newItemImage);
    if (newItemImage2) urls.push(newItemImage2);

    if (editingProduct && onUpdateProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: newItemName,
        price: parseInt(newItemPrice) || 0,
        imageUrl: newItemImage,
        imageUrls: urls
      });
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newItemName,
        price: parseInt(newItemPrice) || 0,
        currency: 'IQD',
        imageUrl: newItemImage,
        imageUrls: urls
      };
      onAddProduct(newProduct);
    }

    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    setNewItemImage2('');
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewItemName(product.name);
    setNewItemPrice(product.price.toString());
    setNewItemImage(product.imageUrl);
    setNewItemImage2(product.imageUrls?.[1] || '');
    setShowAddForm(true);
  };

  const handleAddCoin = async (userId: string) => {
    if (!coinAmount || isNaN(Number(coinAmount))) return;
    const amount = Number(coinAmount);
    
    const userRef = doc(db, 'users', userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateDoc(userRef, {
        walletBalance: (user.walletBalance || 0) + amount
      });
    }
    setAddingCoinMode(null);
    setCoinAmount('');
  };

  const handleSaveVersion = async () => {
    await setDoc(doc(db, 'app_settings', 'general'), { version: appVersion }, { merge: true });
    alert('Version updated');
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] w-full relative">
      <div className="pt-10 pb-4 px-4 flex items-center bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center mr-4 text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-medium text-slate-800 text-lg">{t.adminDashboard}</h1>
      </div>

      <div className="flex border-b border-slate-200 bg-white px-4 shrink-0">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          {t.orders}
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          {t.products}
        </button>
        <button 
          onClick={() => setActiveTab('codes')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'codes' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          {t.codes}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          <Users size={18} className="mx-auto" />
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-[#4ca14b] text-[#4ca14b]' : 'border-transparent text-slate-500'}`}
        >
          <SettingsIcon size={18} className="mx-auto" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        {activeTab === 'orders' && (
          <div className="p-4 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center text-slate-400 py-10">{t.noOrders}</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{t.orderHash} {order.id.toUpperCase()}</h3>
                      <p className="text-sm font-medium text-[#4ca14b] mt-0.5">{order.customerName}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-400 shrink-0 ml-4 text-right">
                      {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      <div className="text-xs mt-0.5">{new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </span>
                  </div>

                  <div className="text-[15px] text-slate-500">
                    <span className="font-medium opacity-80">{t.paymentType}: </span>
                    <span className="font-bold text-slate-800">Card</span>
                  </div>

                  <div className="text-[15px] text-slate-500">
                    <span className="font-medium opacity-80">{t.totalAmount}: </span>
                    <span className="font-bold text-slate-800">{formatPrice(order.total, 'IQD')}</span>
                  </div>

                  <div className="text-[15px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    <span className="font-medium opacity-80">{t.products}: </span>
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
                      {order.status === 'confirmed' || order.status === 'delivered' ? t.accepted : t.accept}
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
                      {order.status === 'cancelled' ? t.rejected : t.reject}
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
                  <Plus size={20} className="mr-2" /> {t.addNewItem}
                </button>

                <div className="space-y-4 pb-20">
                  {products.map(product => (
                     <div key={product.id} className="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center p-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center p-1 mr-4 shrink-0 overflow-hidden">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 text-sm leading-tight mb-1">{product.name}</h3>
                          <p className="text-orange-500 font-bold text-sm">{formatPrice(product.price, product.currency)}</p>
                        </div>
                        <div className="flex space-x-2 shrink-0 ml-2">
                          <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-blue-500">
                             <Edit2 size={16} />
                          </button>
                          <button onClick={() => onDeleteProduct && onDeleteProduct(product.id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-red-500">
                             <Trash2 size={16} />
                          </button>
                        </div>
                     </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-medium text-slate-800">{editingProduct ? t.editItem : t.addNewItem}</h2>
                  <button onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setNewItemName('');
                    setNewItemPrice('');
                    setNewItemImage('');
                    setNewItemImage2('');
                  }} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">{t.name}</label>
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
                    <label className="text-sm font-medium text-slate-700">{t.money}</label>
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
                    <label className="text-sm font-medium text-slate-700">{t.imageFile}</label>
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
                      required={!editingProduct}
                    />
                    {newItemImage && (
                       <div className="mt-3 w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                         <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Image File 2 (Optional)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewItemImage2(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4ca14b]/10 file:text-[#4ca14b] hover:file:bg-[#4ca14b]/20"
                    />
                    {newItemImage2 && (
                       <div className="mt-3 w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                         <img src={newItemImage2} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#4ca14b] hover:bg-[#408a3f] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm mt-4"
                  >
                    {editingProduct ? t.updateItem : t.saveItem}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="p-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
              <h2 className="font-medium text-slate-800 mb-4">{t.createCode}</h2>
              <form onSubmit={saveCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{t.code}</label>
                  <input 
                    type="text" 
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                    placeholder="e.g. DISCOUNT10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b] uppercase"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{t.valueDescription}</label>
                  <input 
                    type="text" 
                    value={newCodeValue}
                    onChange={(e) => setNewCodeValue(e.target.value)}
                    placeholder="e.g. 10% Off"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#4ca14b] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
                >
                  {t.saveCode}
                </button>
              </form>
            </div>
            
            <div className="space-y-4">
               {codes.map((c, i) => (
                 <div key={c.id || i} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
                   <div>
                     <p className="font-bold text-slate-800 tracking-wider bg-slate-100 px-2 rounded">{c.code}</p>
                     <p className="text-sm text-slate-500 mt-1">{c.value}</p>
                   </div>
                   <button onClick={() => deleteCode(c.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                     <Trash2 size={20} />
                   </button>
                 </div>
               ))}
               {codes.length === 0 && (
                 <p className="text-center text-slate-400 py-10">No codes created yet.</p>
               )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4 space-y-4">
             {users.length === 0 ? (
               <div className="text-center text-slate-400 py-10">No users found</div>
             ) : (
               users.map(user => (
                 <div key={user.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
                   <div className="overflow-hidden pr-4 flex-1">
                     <p className="font-bold text-slate-800 truncate">{user.email}</p>
                     <p className="text-sm font-medium text-[#4ca14b] mt-0.5">Wallet: {formatPrice(user.walletBalance || 0, 'IQD')}</p>
                   </div>
                   {addingCoinMode === user.id ? (
                     <div className="flex space-x-2 shrink-0">
                       <input 
                         type="number"
                         value={coinAmount}
                         onChange={e => setCoinAmount(e.target.value)}
                         className="w-24 border border-slate-200 rounded px-2 text-sm"
                         placeholder="Amount"
                       />
                       <button onClick={() => handleAddCoin(user.id)} className="bg-green-500 text-white rounded p-1">
                         <Check size={16} />
                       </button>
                       <button onClick={() => setAddingCoinMode(null)} className="bg-red-500 text-white rounded p-1">
                         <X size={16} />
                       </button>
                     </div>
                   ) : (
                     <button
                       onClick={() => { setAddingCoinMode(user.id); setCoinAmount(''); }}
                       className="shrink-0 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                     >
                       Add Coin
                     </button>
                   )}
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 flex flex-col space-y-4">
             <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
               <h2 className="font-medium text-slate-800 mb-4">App Version</h2>
               <div className="space-y-4">
                 <input 
                   type="text" 
                   value={appVersion}
                   onChange={e => setAppVersion(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ca14b]/20 focus:border-[#4ca14b]"
                   placeholder="e.g. 1.5.0"
                 />
                 <button onClick={handleSaveVersion} className="w-full bg-[#4ca14b] text-white py-3 rounded-lg font-bold">
                   Save Version
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
