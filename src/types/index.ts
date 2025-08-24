export interface Menu {
  id: string;
  name: string;
  price: number;
  category: string;
  ingredients: Ingredient[];
  isAvailable: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  stock: number;
  unit: string;
  costPerUnit: number;
  minStock: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  supplier: string;
  purchaseDate: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export interface SalesReport {
  date: Date;
  totalSales: number;
  totalOrders: number;
  topProducts: TopProduct[];
}

export interface TopProduct {
  menuId: string;
  menuName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface CashFlow {
  date: Date;
  income: number;
  expenses: number;
  netCashFlow: number;
}

export interface ProfitLoss {
  period: string;
  revenue: number;
  costOfGoods: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
}
