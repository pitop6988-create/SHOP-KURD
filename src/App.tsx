/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
import { Product, CartItem, Order } from './types';
import { products as initialProducts } from './data';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'register'|'services'|'cart'|'orders'|'settings'|'checkout'|'order_success'|'admin'>('register');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [ordersList, setOrdersList] = useState<Order[]>([
    {
      id: '12a394',
      customerName: 'Popoola Opeyemi',
      items: [{ product: initialProducts[0], quantity: 2 }],
      total: initialProducts[0].price * 2,
      status: 'pending',
      date: new Date().toISOString()
    }
  ]);

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
        
          {currentScreen === 'register' && (
              <Register onComplete={() => setCurrentScreen('services')} />
          )}

          {currentScreen !== 'register' && (
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
                            onSuccess={() => setCurrentScreen('order_success')}
                            total={cartTotal} 
                          />
                        )}
                        {currentScreen === 'order_success' && (
                          <OrderSuccess onContinue={() => {
                            setCart([]);
                            setCurrentScreen('orders');
                          }} />
                        )}
                        {currentScreen === 'orders' && (
                          <Orders onBack={() => setCurrentScreen('services')} />
                        )}
                        {currentScreen === 'settings' && (
                          <Settings onNavigateToAdmin={() => setCurrentScreen('admin')} />
                        )}
                        {currentScreen === 'admin' && (
                          <AdminDashboard 
                            onBack={() => setCurrentScreen('settings')} 
                            products={products}
                            onAddProduct={(p) => setProducts([...products, p])}
                            orders={ordersList}
                            onUpdateOrderStatus={(id, status) => setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status } : o))}
                          />
                        )}
                      </div>
                  )}
                
                {!(currentScreen === 'checkout' || currentScreen === 'order_success' || currentScreen === 'admin' || selectedProduct) && (
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
