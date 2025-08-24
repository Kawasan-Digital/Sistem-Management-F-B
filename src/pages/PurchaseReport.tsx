import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';

export default function PurchaseReport() {
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthlyPurchases = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    
    return state.purchases.filter(purchase => 
      isWithinInterval(new Date(purchase.purchaseDate), { start, end })
    );
  }, [state.purchases, selectedMonth]);

  const totalPurchases = monthlyPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const totalQuantity = monthlyPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
  const averageCost = totalQuantity > 0 ? totalPurchases / totalQuantity : 0;

  const supplierBreakdown = useMemo(() => {
    const supplierMap = new Map<string, { name: string; total: number; count: number }>();
    
    monthlyPurchases.forEach(purchase => {
      const existing = supplierMap.get(purchase.supplier);
      if (existing) {
        existing.total += purchase.totalCost;
        existing.count += 1;
      } else {
        supplierMap.set(purchase.supplier, {
          name: purchase.supplier,
          total: purchase.totalCost,
          count: 1
        });
      }
    });

    return Array.from(supplierMap.values()).sort((a, b) => b.total - a.total);
  }, [monthlyPurchases]);

  const ingredientBreakdown = useMemo(() => {
    const ingredientMap = new Map<string, { name: string; total: number; quantity: number }>();
    
    monthlyPurchases.forEach(purchase => {
      const existing = ingredientMap.get(purchase.ingredientId);
      if (existing) {
        existing.total += purchase.totalCost;
        existing.quantity += purchase.quantity;
      } else {
        ingredientMap.set(purchase.ingredientId, {
          name: purchase.ingredientName,
          total: purchase.totalCost,
          quantity: purchase.quantity
        });
      }
    });

    return Array.from(ingredientMap.values()).sort((a, b) => b.total - a.total);
  }, [monthlyPurchases]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Pembelian</h1>
        <p className="text-gray-600">Analisis pembelian bahan baku dan supplier</p>
      </div>

      {/* Month Selection */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Pilih Bulan:</label>
          <input
            type="month"
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
            className="input-field max-w-xs"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pembelian</p>
          <p className="text-2xl font-bold text-blue-600">
            Rp {totalPurchases.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Total Kuantitas</p>
          <p className="text-2xl font-bold text-green-600">{totalQuantity}</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Rata-rata Harga</p>
          <p className="text-2xl font-bold text-purple-600">
            Rp {averageCost.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown per Supplier</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total Pembelian']}
                />
                <Bar dataKey="total" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ingredient Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown per Bahan Baku</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingredientBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total Pembelian']}
                />
                <Bar dataKey="total" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Teratas</h3>
        <div className="space-y-3">
          {supplierBreakdown.slice(0, 10).map((supplier, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{supplier.name}</p>
                  <p className="text-sm text-gray-600">{supplier.count} transaksi</p>
                </div>
              </div>
              <span className="font-medium text-primary-600">
                Rp {supplier.total.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Purchases Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Pembelian</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bahan Baku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kuantitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga per Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(purchase.purchaseDate), 'dd/MM/yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.ingredientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.quantity} {purchase.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {purchase.costPerUnit.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {purchase.totalCost.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {purchase.supplier}
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
