/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Register } from './components/Register';
import { Services } from './components/Services';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { BottomNav } from './components/BottomNav';
import { Settings } from './components/Settings';
import { Orders } from './components/Orders';
import { Checkout } from './components/Checkout';
import { OrderSuccess } from './components/OrderSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, CartItem, Order, PromoCode } from './types';
import { products as initialProducts } from './data';
import { auth } from './firebase';
import { motion } from 'motion/react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'loading'|'register'|'services'|'cart'|'orders'|'settings'|'checkout'|'order_success'|'admin'>('loading');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentUserKey, setCurrentUserKey] = useState<string>('guest_cart');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      
      const newKey = user ? `shopping_cart_${user.uid}` : 'guest_cart';
      setCurrentUserKey(newKey);
      
      setCart(() => {
        try {
          const saved = localStorage.getItem(newKey);
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      });
      // ... original inner code ...
      if (user) {
        if (currentScreen === 'loading' || currentScreen === 'register') {
          setCurrentScreen('services');
        }
        
      } else {
        const isGuest = localStorage.getItem('isGuest') === 'true';
        if (isGuest) {
          if (currentScreen === 'loading' || currentScreen === 'register') {
            setCurrentScreen('services');
          }
        } else {
          if (currentScreen !== 'register') {
            setCurrentScreen('register');
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentScreen]);

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (currentUserKey) {
      localStorage.setItem(currentUserKey, JSON.stringify(cart));
    }
  }, [cart, currentUserKey]);

  const [products, setProducts] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    import('./firebase').then(({ db }) => {
      import('firebase/firestore').then(({ collection, onSnapshot, setDoc, doc }) => {
        // Products Sync
        const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
          if (snapshot.empty) {
            initialProducts.forEach(async (p) => {
              try {
                await setDoc(doc(db, 'products', p.id), p);
              } catch (e) {
                console.error("Error setting initial product:", e);
              }
            });
          } else {
            const prods = snapshot.docs.map(doc => doc.data() as Product);
            setProducts(prods);
          }
        }, (error) => {
          console.error("Products snapshot error:", error);
        });

        // Orders Sync
        const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
          const ords = snapshot.docs.map(doc => doc.data() as Order);
          ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setOrdersList(ords);
        }, (error) => {
          console.error("Orders snapshot error:", error);
        });

        // Promo Codes Sync
        const unsubscribeCodes = onSnapshot(collection(db, 'promo_codes'), (snapshot) => {
          const codes = snapshot.docs.map(doc => doc.data() as PromoCode);
          setPromoCodes(codes);
        }, (error) => {
          console.error("Promo codes snapshot error:", error);
        });

        return () => {
          unsubscribeProducts();
          unsubscribeOrders();
          unsubscribeCodes();
        };
      });
    });
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: quantity } : item));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-neutral-900 min-h-screen flex items-center justify-center p-0 md:p-4 font-sans text-slate-900 selection:bg-[#4ca14b]/20">
      <div className="w-full max-w-md h-[100dvh] md:h-[850px] bg-white md:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/10 md:ring-slate-900/5">
        
          {currentScreen === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-[#4ca14b] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading...</p>
            </div>
          )}

          {currentScreen === 'register' && (
              <Register 
                onComplete={() => setCurrentScreen('services')} 
                onGuest={() => {
                  localStorage.setItem('isGuest', 'true');
                  setCurrentScreen('services');
                }}
              />
          )}

          {currentScreen !== 'register' && currentScreen !== 'loading' && (
              <div className="flex flex-col h-full relative">
                  {selectedProduct ? (
                      <ProductDetail 
                        product={selectedProduct} 
                        onBack={() => setSelectedProduct(null)}
                        onAddToCart={handleAddToCart}
                      />
                  ) : (
                      <div className="flex-1 overflow-hidden relative">
                        {currentScreen === 'services' && (
                          <Services 
                            products={products}
                            onProductClick={setSelectedProduct} 
                            onAddToCart={(p, q) => handleAddToCart(p, q)} 
                            cartItemCount={cartItemCount}
                            onCartClick={() => setCurrentScreen('cart')}
                          />
                        )}
                        {currentScreen === 'cart' && (
                          <Cart 
                            items={cart} 
                            onUpdateQuantity={updateQuantity} 
                            onRemoveItem={removeItem} 
                            onClear={() => setCart([])} 
                            onBack={() => setCurrentScreen('services')}
                            onCheckout={() => setCurrentScreen('checkout')}
                          />
                        )}
                        {currentScreen === 'checkout' && (
                          <Checkout 
                            onBack={() => setCurrentScreen('cart')} 
                            onSuccess={async () => {
                              try {
                                const newOrder: Order = {
                                  id: Math.random().toString(36).substring(2, 8).toUpperCase(),
                                  customerName: auth.currentUser?.email || 'Guest User',
                                  items: [...cart],
                                  total: cartTotal,
                                  status: 'pending',
                                  date: new Date().toISOString()
                                };
                                const { doc, setDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await setDoc(doc(db, 'orders', newOrder.id), newOrder);
                                setCurrentScreen('order_success');
                              } catch (e) {
                                console.error('Error creating order', e);
                                alert('Failed to checkout. Please try again.');
                              }
                            }}
                            total={cartTotal}
                            codes={promoCodes} 
                          />
                        )}
                        {currentScreen === 'order_success' && (
                          <OrderSuccess onContinue={() => {
                            setCart([]);
                            setCurrentScreen('orders');
                          }} />
                        )}
                        {currentScreen === 'orders' && (
                          <Orders 
                            onBack={() => setCurrentScreen('services')} 
                            orders={ordersList.filter(o => o.customerName === (auth.currentUser?.email || 'Guest User'))}
                          />
                        )}
                        {currentScreen === 'settings' && (
                          <Settings 
                            onNavigateToAdmin={() => setCurrentScreen('admin')} 
                            onLogout={async () => {
                              localStorage.removeItem('isGuest');
                              await auth.signOut();
                              setCurrentScreen('register');
                            }}
                          />
                        )}
                        {currentScreen === 'admin' && (
                          <AdminDashboard 
                            onBack={() => setCurrentScreen('settings')} 
                            products={products}
                            onAddProduct={async (p) => {
                              try {
                                const { doc, setDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await setDoc(doc(db, 'products', p.id), p);
                              } catch (e) {
                                console.error('Error adding product', e);
                                alert('Failed to add product: ' + (e as Error).message);
                              }
                            }}
                            onUpdateProduct={async (p) => {
                              try {
                                const { doc, updateDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await updateDoc(doc(db, 'products', p.id), p as any);
                              } catch (e) {
                                console.error('Error updating product', e);
                                alert('Failed to update: ' + (e as Error).message);
                              }
                            }}
                            onDeleteProduct={async (id) => {
                              try {
                                const { doc, deleteDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await deleteDoc(doc(db, 'products', id));
                              } catch (e) {
                                console.error('Error deleting product', e);
                                alert('Failed to delete: ' + (e as Error).message);
                              }
                            }}
                            orders={ordersList}
                            onUpdateOrderStatus={async (id, status) => {
                              try {
                                const { doc, updateDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await updateDoc(doc(db, 'orders', id), { status });
                              } catch (e) {
                                console.error('Error updating order status', e);
                                alert('Failed to update order: ' + (e as Error).message);
                              }
                            }}
                            codes={promoCodes}
                            onAddCode={async (code) => {
                              try {
                                const { doc, setDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await setDoc(doc(db, 'promo_codes', code.id), code);
                              } catch (e) {
                                console.error('Error adding code', e);
                              }
                            }}
                            onDeleteCode={async (id) => {
                              try {
                                const { doc, deleteDoc } = await import('firebase/firestore');
                                const { db } = await import('./firebase');
                                await deleteDoc(doc(db, 'promo_codes', id));
                              } catch (e) {
                                console.error('Error deleting code', e);
                              }
                            }}
                          />
                        )}
                      </div>
                  )}
                
                {!(currentScreen === 'cart' || currentScreen === 'checkout' || currentScreen === 'order_success' || currentScreen === 'admin' || selectedProduct) && (
                  <div className="shrink-0 z-50">
                    <BottomNav 
                      currentTab={currentScreen} 
                      onTabChange={(tab) => { setCurrentScreen(tab as any); setSelectedProduct(null); }} 
                      cartItemCount={cartItemCount} 
                    />
                  </div>
                )}
              </div>
          )}
      </div>
    </div>
  );
}
