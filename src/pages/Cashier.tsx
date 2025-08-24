import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Plus, Minus, X, Check } from 'lucide-react';
import { Order, OrderItem } from '../types';

export default function Cashier() {
  const { state, processOrder } = useApp();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(state.menus.map(menu => menu.category))];

  const addToCart = (menu: any) => {
    const existingItem = cart.find(item => item.menuId === menu.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuId === menu.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        menuId: menu.id,
        menuName: menu.name,
        quantity: 1,
        price: menu.price,
        subtotal: menu.price
      }]);
    }
  };

  const removeFromCart = (menuId: string) => {
    setCart(cart.filter(item => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(menuId);
      return;
    }
    
    setCart(cart.map(item =>
      item.menuId === menuId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.subtotal, 0),
      status: 'pending',
      createdAt: new Date()
    };

    // Proses pesanan dan kurangi stok bahan baku secara otomatis
    processOrder(order);
    
    // Reset cart
    setCart([]);
    
    alert('Pesanan berhasil dibuat! Stok bahan baku telah dikurangi secara otomatis.');
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kasir</h1>
        <p className="text-gray-600">Sistem Point of Sale dengan pengurangan stok otomatis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Selection */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Pilih Menu</h2>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'Semua' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.menus
                .filter(menu => selectedCategory === 'all' || menu.category === selectedCategory)
                .map((menu) => (
                  <div
                    key={menu.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{menu.name}</h3>
                      <span className="text-lg font-bold text-primary-600">
                        Rp {menu.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{menu.category}</p>
                    <button
                      onClick={() => addToCart(menu)}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah ke Keranjang
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Keranjang</h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Kosongkan
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Keranjang kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.menuId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.menuName}</p>
                        <p className="text-sm text-gray-600">
                          Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.menuId)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary flex items-center justify-center py-3"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Proses Pesanan
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    *Stok bahan baku akan dikurangi secara otomatis
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pesanan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items.length} item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {order.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'completed' ? 'Selesai' : 
                       order.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
