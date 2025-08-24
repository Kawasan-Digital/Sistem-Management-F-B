# Sistem Manajemen F&B

Aplikasi manajemen restoran dan bisnis F&B yang lengkap dengan fitur kasir, inventori otomatis, dan laporan komprehensif.

## 🚀 Fitur Utama

### 1. **Kasir (Point of Sale)**
- Interface kasir yang user-friendly
- **Pengurangan stok bahan baku otomatis** saat pesanan dibuat
- Keranjang belanja dengan kalkulasi total otomatis
- Kategori menu yang mudah dinavigasi
- Riwayat pesanan real-time

### 2. **Manajemen Menu**
- Tambah, edit, dan hapus menu
- Kategorisasi menu (Makanan Utama, Minuman, Snack, Dessert)
- Status ketersediaan menu
- Harga dan deskripsi menu

### 3. **Manajemen Inventori**
- Tracking stok bahan baku real-time
- Alert stok menipis otomatis
- Satuan pengukuran yang fleksibel
- Harga per satuan dan total nilai inventori
- Stok minimum yang dapat dikustomisasi

### 4. **Laporan Penjualan**
- **Laporan harian, bulanan, dan tahunan**
- Grafik penjualan interaktif
- **Laporan produk terlaris**
- Analisis tren penjualan
- Detail pesanan lengkap

### 5. **Laporan Pembelian**
- Tracking pembelian bahan baku
- Analisis per supplier
- Breakdown per bahan baku
- Grafik pembelian bulanan

### 6. **Laporan Pengeluaran**
- Kategorisasi pengeluaran
- Analisis pengeluaran harian
- Breakdown per kategori
- Grafik dan statistik pengeluaran

### 7. **Arus Kas**
- Analisis arus kas masuk dan keluar
- Tren arus kas bulanan dan tahunan
- Perbandingan pemasukan vs pengeluaran
- Status arus kas real-time

### 8. **Laporan Laba Rugi**
- Analisis keuangan komprehensif
- Margin kotor dan bersih
- Breakdown pengeluaran
- Tren profitabilitas bulanan

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **State Management**: React Context + useReducer

## 📦 Instalasi

### Prerequisites
- Node.js 16+ 
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd fnb-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan aplikasi**
```bash
npm run dev
```

4. **Buka browser**
```
http://localhost:3000
```

## 🏗️ Struktur Proyek

```
src/
├── components/          # Komponen UI yang dapat digunakan kembali
│   └── Layout.tsx      # Layout utama dengan sidebar
├── context/            # State management
│   └── AppContext.tsx  # Context untuk global state
├── data/               # Data dummy untuk testing
│   └── dummyData.ts    # Data contoh menu, bahan baku, dll
├── pages/              # Halaman-halaman aplikasi
│   ├── Dashboard.tsx           # Dashboard utama
│   ├── Cashier.tsx             # Halaman kasir
│   ├── MenuManagement.tsx      # Manajemen menu
│   ├── Inventory.tsx           # Manajemen inventori
│   ├── SalesReport.tsx         # Laporan penjualan
│   ├── PurchaseReport.tsx      # Laporan pembelian
│   ├── ExpenseReport.tsx       # Laporan pengeluaran
│   ├── CashFlow.tsx            # Laporan arus kas
│   └── ProfitLoss.tsx          # Laporan laba rugi
├── types/              # TypeScript interfaces
│   └── index.ts        # Definisi tipe data
├── App.tsx             # Komponen utama dengan routing
├── main.tsx            # Entry point aplikasi
└── index.css           # Styles global
```

## 🔧 Fitur Teknis

### **Pengurangan Stok Otomatis**
Sistem secara otomatis mengurangi stok bahan baku saat pesanan dibuat:

```typescript
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
  
  addOrder(order);
};
```

### **State Management**
Menggunakan React Context dengan useReducer untuk state management yang efisien:

```typescript
interface AppState {
  menus: Menu[];
  ingredients: Ingredient[];
  orders: Order[];
  purchases: Purchase[];
  expenses: Expense[];
}
```

### **Responsive Design**
Aplikasi fully responsive dengan Tailwind CSS:
- Mobile-first approach
- Sidebar yang dapat di-collapse
- Grid layout yang adaptif

## 📊 Fitur Laporan

### **Laporan Penjualan**
- Filter berdasarkan periode (harian/bulanan/tahunan)
- Grafik penjualan interaktif
- Top 10 produk terlaris
- Analisis tren penjualan

### **Laporan Laba Rugi**
- Margin kotor dan bersih
- Breakdown pengeluaran per kategori
- Analisis profitabilitas bulanan
- Grafik tren keuangan

### **Arus Kas**
- Analisis arus kas masuk vs keluar
- Tren 12 bulan terakhir
- Status arus kas real-time
- Perbandingan bulanan

## 🎯 Cara Penggunaan

### **1. Dashboard**
- Lihat ringkasan bisnis secara keseluruhan
- Monitor stok bahan baku yang menipis
- Quick view pesanan terbaru

### **2. Kasir**
- Pilih menu dari kategori yang tersedia
- Tambahkan ke keranjang dengan quantity yang diinginkan
- Proses pesanan (stok otomatis berkurang)
- Lihat riwayat pesanan

### **3. Manajemen Menu**
- Tambah menu baru dengan kategori dan harga
- Edit menu yang sudah ada
- Set status ketersediaan menu

### **4. Inventori**
- Monitor stok bahan baku real-time
- Set stok minimum untuk alert otomatis
- Track nilai inventori

### **5. Laporan**
- Pilih periode laporan yang diinginkan
- Analisis data dengan grafik interaktif
- Export data untuk analisis lebih lanjut

## 🔒 Keamanan & Validasi

- Validasi input form yang ketat
- Type safety dengan TypeScript
- Error handling yang komprehensif
- Data validation sebelum processing

## 🚀 Deployment

### **Build untuk Production**
```bash
npm run build
```

### **Preview Build**
```bash
npm run preview
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ untuk bisnis F&B Indonesia**
