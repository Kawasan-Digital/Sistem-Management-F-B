import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, TrendingDown, DollarSign, Calculator, PieChart as PieChartIcon } from 'lucide-react';

export default function ProfitLoss() {
  const { state } = useApp();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const monthlyData = useMemo(() => {
    const data = Array.from({ length: 12 }, (_, month) => {
      const start = startOfMonth(new Date(selectedYear, month));
      const end = endOfMonth(new Date(selectedYear, month));

      // Filter orders for this month
      const monthOrders = state.orders.filter(order => 
        isWithinInterval(new Date(order.createdAt), { start, end })
      );

      // Filter expenses for this month
      const monthExpenses = state.expenses.filter(expense => 
        isWithinInterval(new Date(expense.date), { start, end })
      );

      // Filter purchases for this month
      const monthPurchases = state.purchases.filter(purchase => 
        isWithinInterval(new Date(purchase.purchaseDate), { start, end })
      );

      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      const expenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const costOfGoods = monthPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
      const grossProfit = revenue - costOfGoods;
      const netProfit = grossProfit - expenses;

      return {
        month: format(new Date(selectedYear, month), 'MMM', { locale: id }),
        revenue,
        costOfGoods,
        grossProfit,
        expenses,
        netProfit
      };
    });

    return data;
  }, [state.orders, state.expenses, state.purchases, selectedYear]);

  const yearlySummary = useMemo(() => {
    const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
    const totalCostOfGoods = monthlyData.reduce((sum, month) => sum + month.costOfGoods, 0);
    const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
    const totalGrossProfit = totalRevenue - totalCostOfGoods;
    const totalNetProfit = totalGrossProfit - totalExpenses;

    return {
      revenue: totalRevenue,
      costOfGoods: totalCostOfGoods,
      grossProfit: totalGrossProfit,
      expenses: totalExpenses,
      netProfit: totalNetProfit,
      grossMargin: totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0
    };
  }, [monthlyData]);

  const expenseBreakdown = useMemo(() => {
    const expenseMap = new Map<string, number>();
    
    state.expenses.forEach(expense => {
      const existing = expenseMap.get(expense.category);
      if (existing) {
        expenseMap.set(expense.category, existing + expense.amount);
      } else {
        expenseMap.set(expense.category, expense.amount);
      }
    });

    return Array.from(expenseMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [state.expenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1>
        <p className="text-gray-600">Analisis keuangan komprehensif untuk tahun {selectedYear}</p>
      </div>

      {/* Year Selection */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Pilih Tahun:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-field max-w-xs"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {yearlySummary.revenue.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Harga Pokok Penjualan</p>
          <p className="text-2xl font-bold text-blue-600">
            Rp {yearlySummary.costOfGoods.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Laba Kotor</p>
          <p className={`text-2xl font-bold ${yearlySummary.grossProfit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            Rp {yearlySummary.grossProfit.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
            <TrendingDown className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600">Laba Bersih</p>
          <p className={`text-2xl font-bold ${yearlySummary.netProfit >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
            Rp {yearlySummary.netProfit.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Margin Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analisis Margin</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Margin Kotor:</span>
              <span className={`font-semibold ${yearlySummary.grossMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yearlySummary.grossMargin.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Margin Bersih:</span>
              <span className={`font-semibold ${yearlySummary.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {yearlySummary.netMargin.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(Math.max(yearlySummary.grossMargin, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              Margin kotor yang sehat biasanya di atas 50%
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown Pengeluaran</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) => `${category}: Rp ${amount.toLocaleString('id-ID')}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tren Bulanan</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Pendapatan" />
              <Line type="monotone" dataKey="grossProfit" stroke="#3B82F6" strokeWidth={2} name="Laba Kotor" />
              <Line type="monotone" dataKey="netProfit" stroke="#F59E0B" strokeWidth={2} name="Laba Bersih" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Perbandingan Bulanan</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
              />
              <Bar dataKey="revenue" fill="#10B981" name="Pendapatan" />
              <Bar dataKey="costOfGoods" fill="#EF4444" name="HPP" />
              <Bar dataKey="expenses" fill="#F59E0B" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Monthly Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Bulanan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bulan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendapatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HPP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laba Kotor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengeluaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laba Bersih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((month, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    Rp {month.revenue.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    Rp {month.costOfGoods.toLocaleString('id-ID')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    month.grossProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    Rp {month.grossProfit.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                    Rp {month.expenses.toLocaleString('id-ID')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Rp {month.netProfit.toLocaleString('id-ID')}
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
