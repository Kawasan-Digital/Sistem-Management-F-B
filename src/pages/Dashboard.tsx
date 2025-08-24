import { useApp } from '../context/AppContext';
import { 
  ShoppingCart, 
  Utensils, 
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();

  const totalSales = state.orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = state.orders.length;
  const completedOrders = state.orders.filter(order => order.status === 'completed').length;
  const pendingOrders = state.orders.filter(order => order.status === 'pending').length;

  const lowStockIngredients = state.ingredients.filter(
    ingredient => ingredient.stock <= ingredient.minStock
  );

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPurchases = state.purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

  const stats = [
    {
      name: 'Total Penjualan',
      value: `Rp ${totalSales.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Pesanan',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Pesanan Selesai',
      value: completedOrders.toString(),
      icon: Utensils,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Pesanan Pending',
      value: pendingOrders.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas bisnis F&B Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pesanan Terbaru</h3>
          <div className="space-y-3">
            {state.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item • Rp {order.total.toLocaleString('id-ID')}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stok Menipis</h3>
          {lowStockIngredients.length > 0 ? (
            <div className="space-y-3">
              {lowStockIngredients.map((ingredient) => (
                <div key={ingredient.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{ingredient.name}</p>
                    <p className="text-sm text-red-600">
                      Stok: {ingredient.stock} {ingredient.unit} (Min: {ingredient.minStock})
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Semua stok bahan baku mencukupi</p>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ringkasan Keuangan</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pendapatan</p>
            <p className="text-2xl font-bold text-green-600">
              Rp {totalSales.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">
              Rp {totalExpenses.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pembelian</p>
            <p className="text-2xl font-bold text-blue-600">
              Rp {totalPurchases.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
