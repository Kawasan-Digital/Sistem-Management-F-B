import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

type Period = 'daily' | 'monthly' | 'yearly';

export default function SalesReport() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const periods = [
    { value: 'daily', label: 'Harian', icon: Calendar },
    { value: 'monthly', label: 'Bulanan', icon: TrendingUp },
    { value: 'yearly', label: 'Tahunan', icon: DollarSign }
  ];

  const getDateRange = (period: Period, date: Date) => {
    switch (period) {
      case 'daily':
        return { start: startOfDay(date), end: endOfDay(date) };
      case 'monthly':
        return { start: startOfMonth(date), end: endOfMonth(date) };
      case 'yearly':
        return { start: startOfYear(date), end: endOfYear(date) };
    }
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange(selectedPeriod, selectedDate);
    return state.orders.filter(order => 
      isWithinInterval(new Date(order.createdAt), { start, end })
    );
  }, [state.orders, selectedPeriod, selectedDate]);

  const salesData = useMemo(() => {
    if (selectedPeriod === 'daily') {
      // Group by hour for daily view
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        sales: 0,
        orders: 0
      }));

      filteredOrders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        hourlyData[hour].sales += order.total;
        hourlyData[hour].orders += 1;
      });

      return hourlyData;
    } else if (selectedPeriod === 'monthly') {
      // Group by day for monthly view
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      const dailyData = Array.from({ length: daysInMonth }, (_, day) => ({
        day: day + 1,
        sales: 0,
        orders: 0
      }));

      filteredOrders.forEach(order => {
        const day = new Date(order.createdAt).getDate();
        dailyData[day - 1].sales += order.total;
        dailyData[day - 1].orders += 1;
      });

      return dailyData;
    } else {
      // Group by month for yearly view
      const monthlyData = Array.from({ length: 12 }, (_, month) => ({
        month: format(new Date(2024, month), 'MMM', { locale: id }),
        sales: 0,
        orders: 0
      }));

      filteredOrders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        monthlyData[month].sales += order.total;
        monthlyData[month].orders += 1;
      });

      return monthlyData;
    }
  }, [filteredOrders, selectedPeriod, selectedDate]);

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.menuId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.menuId, {
            name: item.menuName,
            quantity: item.quantity,
            revenue: item.subtotal
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
        <p className="text-gray-600">Analisis penjualan harian, bulanan, dan tahunan</p>
      </div>

      {/* Period Selection */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex space-x-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as Period)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  selectedPeriod === period.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <period.icon className="h-4 w-4 mr-2" />
                {period.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Pilih Tanggal:</label>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Total Penjualan</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {totalSales.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pesanan</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Rata-rata per Pesanan</p>
          <p className="text-2xl font-bold text-purple-600">
            Rp {averageOrderValue.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Grafik Penjualan {selectedPeriod === 'daily' ? 'Harian' : selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedPeriod === 'daily' ? 'hour' : selectedPeriod === 'monthly' ? 'day' : 'month'} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
              />
              <Bar dataKey="sales" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Produk Terlaris</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} terjual</p>
                  </div>
                </div>
                <span className="font-medium text-primary-600">
                  Rp {product.revenue.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribusi Penjualan Produk</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, revenue }) => `${name}: Rp ${revenue.toLocaleString('id-ID')}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Orders Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Pesanan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: id })}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
