import { Menu, Ingredient, Order, Purchase, Expense } from '../types';

export const dummyIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Nasi',
    stock: 50,
    unit: 'kg',
    costPerUnit: 12000,
    minStock: 10
  },
  {
    id: '2',
    name: 'Ayam',
    stock: 30,
    unit: 'kg',
    costPerUnit: 35000,
    minStock: 5
  },
  {
    id: '3',
    name: 'Sayur',
    stock: 20,
    unit: 'kg',
    costPerUnit: 15000,
    minStock: 8
  },
  {
    id: '4',
    name: 'Bumbu',
    stock: 15,
    unit: 'kg',
    costPerUnit: 25000,
    minStock: 3
  },
  {
    id: '5',
    name: 'Minyak Goreng',
    stock: 25,
    unit: 'liter',
    costPerUnit: 18000,
    minStock: 5
  }
];

export const dummyMenus: Menu[] = [
  {
    id: '1',
    name: 'Nasi Goreng Ayam',
    price: 25000,
    category: 'Makanan Utama',
    ingredients: [
      { ...dummyIngredients[0], stock: 0.3 }, // 300g nasi
      { ...dummyIngredients[1], stock: 0.2 }, // 200g ayam
      { ...dummyIngredients[2], stock: 0.1 }, // 100g sayur
      { ...dummyIngredients[3], stock: 0.05 }, // 50g bumbu
      { ...dummyIngredients[4], stock: 0.02 } // 20ml minyak
    ],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Mie Goreng',
    price: 22000,
    category: 'Makanan Utama',
    ingredients: [
      { ...dummyIngredients[1], stock: 0.15 }, // 150g ayam
      { ...dummyIngredients[2], stock: 0.1 }, // 100g sayur
      { ...dummyIngredients[3], stock: 0.05 }, // 50g bumbu
      { ...dummyIngredients[4], stock: 0.02 } // 20ml minyak
    ],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    price: 5000,
    category: 'Minuman',
    ingredients: [
      { ...dummyIngredients[3], stock: 0.01 }, // 10g gula
    ],
    isAvailable: true
  }
];

export const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    items: [
      {
        menuId: '1',
        menuName: 'Nasi Goreng Ayam',
        quantity: 2,
        price: 25000,
        subtotal: 50000
      },
      {
        menuId: '3',
        menuName: 'Es Teh Manis',
        quantity: 2,
        price: 5000,
        subtotal: 10000
      }
    ],
    total: 60000,
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00'),
    completedAt: new Date('2024-01-15T10:45:00')
  }
];

export const dummyPurchases: Purchase[] = [
  {
    id: '1',
    ingredientId: '1',
    ingredientName: 'Nasi',
    quantity: 100,
    unit: 'kg',
    costPerUnit: 12000,
    totalCost: 1200000,
    supplier: 'PT Beras Sejahtera',
    purchaseDate: new Date('2024-01-10')
  }
];

export const dummyExpenses: Expense[] = [
  {
    id: '1',
    description: 'Biaya Listrik',
    amount: 500000,
    category: 'Operasional',
    date: new Date('2024-01-15')
  },
  {
    id: '2',
    description: 'Biaya Air',
    amount: 150000,
    category: 'Operasional',
    date: new Date('2024-01-15')
  }
];
