import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { DollarSign, TrendingDown, FileText } from 'lucide-react';

export default function ExpenseReport() {
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthlyExpenses = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    
    return state.expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), { start, end })
    );
  }, [state.expenses, selectedMonth]);

  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenseCount = monthlyExpenses.length;
  const averageExpense = totalExpenseCount > 0 ? totalExpenses / totalExpenseCount : 0;

  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, { name: string; total: number; count: number }>();
    
    monthlyExpenses.forEach(expense => {
      const existing = categoryMap.get(expense.category);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      } else {
        categoryMap.set(expense.category, {
          name: expense.category,
          total: expense.amount,
          count: 1
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
  }, [monthlyExpenses]);

  const dailyExpenses = useMemo(() => {
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, day) => ({
      day: day + 1,
      expenses: 0,
      count: 0
    }));

    monthlyExpenses.forEach(expense => {
      const day = new Date(expense.date).getDate();
      dailyData[day - 1].expenses += expense.amount;
      dailyData[day - 1].count += 1;
    });

    return dailyData;
  }, [monthlyExpenses, selectedMonth]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Pengeluaran</h1>
        <p className="text-gray-600">Analisis pengeluaran operasional bisnis</p>
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
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">
            Rp {totalExpenses.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Jumlah Transaksi</p>
          <p className="text-2xl font-bold text-blue-600">{totalExpenseCount}</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <TrendingDown className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Rata-rata per Transaksi</p>
          <p className="text-2xl font-bold text-purple-600">
            Rp {averageExpense.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Expenses Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pengeluaran Harian</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pengeluaran']}
                />
                <Bar dataKey="expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown per Kategori</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, total }) => `${name}: Rp ${total.toLocaleString('id-ID')}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Expense Categories */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kategori Pengeluaran Teratas</h3>
        <div className="space-y-3">
          {categoryBreakdown.slice(0, 10).map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-600">{category.count} transaksi</p>
                </div>
              </div>
              <span className="font-medium text-red-600">
                Rp {category.total.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Expenses Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Pengeluaran</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(expense.date), 'dd/MM/yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    Rp {expense.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Insights */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analisis Pengeluaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Kategori Terbesar</h4>
            {categoryBreakdown.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-900 font-medium">{categoryBreakdown[0].name}</p>
                <p className="text-blue-700 text-sm">
                  Rp {categoryBreakdown[0].total.toLocaleString('id-ID')} 
                  ({((categoryBreakdown[0].total / totalExpenses) * 100).toFixed(1)}% dari total)
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rekomendasi</h4>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-900 text-sm">
                {totalExpenses > 1000000 
                  ? 'Pengeluaran bulan ini cukup tinggi. Pertimbangkan untuk mengoptimalkan biaya operasional.'
                  : 'Pengeluaran bulan ini dalam batas normal. Pertahankan efisiensi yang sudah ada.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
