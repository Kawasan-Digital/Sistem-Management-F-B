import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function CashFlow() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const periods = [
    { value: 'monthly', label: 'Bulanan' },
    { value: 'yearly', label: 'Tahunan' }
  ];

  const getDateRange = (period: 'monthly' | 'yearly', date: Date) => {
    if (period === 'monthly') {
      return { start: startOfMonth(date), end: endOfMonth(date) };
    } else {
      return { start: startOfYear(date), end: endOfYear(date) };
    }
  };

  const cashFlowData = useMemo(() => {
    if (selectedPeriod === 'monthly') {
      // Generate last 12 months data
      const data = Array.from({ length: 12 }, (_, i) => {
        const monthDate = subMonths(selectedDate, 11 - i);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

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

        const income = monthOrders.reduce((sum, order) => sum + order.total, 0);
        const expenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const purchases = monthPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
        const totalOutflow = expenses + purchases;
        const netCashFlow = income - totalOutflow;

        return {
          month: format(monthDate, 'MMM yyyy', { locale: id }),
          income,
          expenses,
          purchases,
          totalOutflow,
          netCashFlow
        };
      });

      return data;
    } else {
      // Generate yearly data for selected year
      const data = Array.from({ length: 12 }, (_, month) => {
        const monthDate = new Date(selectedDate.getFullYear(), month);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

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

        const income = monthOrders.reduce((sum, order) => sum + order.total, 0);
        const expenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const purchases = monthPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
        const totalOutflow = expenses + purchases;
        const netCashFlow = income - totalOutflow;

        return {
          month: format(monthDate, 'MMM', { locale: id }),
          income,
          expenses,
          purchases,
          totalOutflow,
          netCashFlow
        };
      });

      return data;
    }
  }, [state.orders, state.expenses, state.purchases, selectedPeriod, selectedDate]);

  const summary = useMemo(() => {
    const totalIncome = cashFlowData.reduce((sum, month) => sum + month.income, 0);
    const totalExpenses = cashFlowData.reduce((sum, month) => sum + month.expenses, 0);
    const totalPurchases = cashFlowData.reduce((sum, month) => sum + month.purchases, 0);
    const totalOutflow = totalExpenses + totalPurchases;
    const netCashFlow = totalIncome - totalOutflow;

    return {
      totalIncome,
      totalExpenses,
      totalPurchases,
      totalOutflow,
      netCashFlow
    };
  }, [cashFlowData]);

  const positiveMonths = cashFlowData.filter(month => month.netCashFlow > 0).length;
  const negativeMonths = cashFlowData.filter(month => month.netCashFlow < 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Arus Kas</h1>
        <p className="text-gray-600">Analisis arus kas masuk dan keluar bisnis</p>
      </div>

      {/* Period Selection */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex space-x-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as 'monthly' | 'yearly')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPeriod === period.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              {selectedPeriod === 'monthly' ? 'Pilih Bulan:' : 'Pilih Tahun:'}
            </label>
            {selectedPeriod === 'monthly' ? (
              <input
                type="month"
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value + '-01'))}
                className="input-field max-w-xs"
              />
            ) : (
              <select
                value={selectedDate.getFullYear()}
                onChange={(e) => setSelectedDate(new Date(Number(e.target.value), 0))}
                className="input-field max-w-xs"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <ArrowUpRight className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {summary.totalIncome.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
            <ArrowDownRight className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">
            Rp {summary.totalExpenses.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Total Pembelian</p>
          <p className="text-2xl font-bold text-blue-600">
            Rp {summary.totalPurchases.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
            <TrendingDown className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600">Total Arus Keluar</p>
          <p className="text-2xl font-bold text-orange-600">
            Rp {summary.totalOutflow.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card text-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
            summary.netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <TrendingUp className={`h-6 w-6 ${
              summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
          <p className="text-sm text-gray-600">Arus Kas Bersih</p>
          <p className={`text-2xl font-bold ${
            summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Rp {summary.netCashFlow.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Cash Flow Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tren Arus Kas</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
              />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Pemasukan" />
              <Line type="monotone" dataKey="totalOutflow" stroke="#EF4444" strokeWidth={2} name="Arus Keluar" />
              <Line type="monotone" dataKey="netCashFlow" stroke="#3B82F6" strokeWidth={2} name="Arus Kas Bersih" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Perbandingan Bulanan</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
              />
              <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
              <Bar dataKey="expenses" fill="#EF4444" name="Pengeluaran" />
              <Bar dataKey="purchases" fill="#3B82F6" name="Pembelian" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analisis Arus Kas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bulan Positif:</span>
              <span className="font-semibold text-green-600">{positiveMonths} bulan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bulan Negatif:</span>
              <span className="font-semibold text-red-600">{negativeMonths} bulan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rasio Positif:</span>
              <span className="font-semibold text-blue-600">
                {((positiveMonths / cashFlowData.length) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Status Arus Kas:</h4>
              <div className={`p-3 rounded-lg ${
                summary.netCashFlow >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  summary.netCashFlow >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  {summary.netCashFlow >= 0 
                    ? 'Arus kas positif - bisnis menghasilkan lebih banyak uang daripada yang dikeluarkan'
                    : 'Arus kas negatif - bisnis mengeluarkan lebih banyak uang daripada yang dihasilkan'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Area Chart Arus Kas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah']}
                />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="totalOutflow" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Monthly Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Arus Kas Bulanan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemasukan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengeluaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembelian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Arus Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arus Kas Bersih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cashFlowData.map((month, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    Rp {month.income.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    Rp {month.expenses.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    Rp {month.purchases.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                    Rp {month.totalOutflow.toLocaleString('id-ID')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    month.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Rp {month.netCashFlow.toLocaleString('id-ID')}
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
