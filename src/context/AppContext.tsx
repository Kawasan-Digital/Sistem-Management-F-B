import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Menu, Ingredient, Order, Purchase, Expense } from '../types';
import { dummyMenus, dummyIngredients, dummyOrders, dummyPurchases, dummyExpenses } from '../data/dummyData';

interface AppState {
  menus: Menu[];
  ingredients: Ingredient[];
  orders: Order[];
  purchases: Purchase[];
  expenses: Expense[];
}

type AppAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'ADD_PURCHASE'; payload: Purchase }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_INGREDIENT_STOCK'; payload: { ingredientId: string; quantity: number } };

const initialState: AppState = {
  menus: dummyMenus,
  ingredients: dummyIngredients,
  orders: dummyOrders,
  purchases: dummyPurchases,
  expenses: dummyExpenses,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };

    case 'ADD_PURCHASE':
      return {
        ...state,
        purchases: [...state.purchases, action.payload],
        ingredients: state.ingredients.map(ingredient =>
          ingredient.id === action.payload.ingredientId
            ? { ...ingredient, stock: ingredient.stock + action.payload.quantity }
            : ingredient
        ),
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case 'UPDATE_INGREDIENT_STOCK':
      return {
        ...state,
        ingredients: state.ingredients.map(ingredient =>
          ingredient.id === action.payload.ingredientId
            ? { ...ingredient, stock: Math.max(0, ingredient.stock - action.payload.quantity) }
            : ingredient
        ),
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addPurchase: (purchase: Purchase) => void;
  addExpense: (expense: Expense) => void;
  processOrder: (order: Order) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const addPurchase = (purchase: Purchase) => {
    dispatch({ type: 'ADD_PURCHASE', payload: purchase });
  };

  const addExpense = (expense: Expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const processOrder = (order: Order) => {
    // Kurangi stok bahan baku berdasarkan pesanan
    order.items.forEach(item => {
      const menu = state.menus.find(m => m.id === item.menuId);
      if (menu) {
        menu.ingredients.forEach(ingredient => {
          const totalQuantity = ingredient.stock * item.quantity;
          dispatch({
            type: 'UPDATE_INGREDIENT_STOCK',
            payload: { ingredientId: ingredient.id, quantity: totalQuantity }
          });
        });
      }
    });

    // Tambahkan pesanan
    addOrder(order);
  };

  const value: AppContextType = {
    state,
    dispatch,
    addOrder,
    updateOrderStatus,
    addPurchase,
    addExpense,
    processOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
