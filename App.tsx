import React, { useState, useEffect } from 'react';
import { InventoryItem, ItemCategory } from './types';
import InventoryForm from './components/InventoryForm';
import StatsChart from './components/StatsChart';
import { Package, Trash2, Edit2, Search, TrendingUp, AlertCircle } from 'lucide-react';

// Initial dummy data for demonstration
const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'MacBook Pro M3',
    category: ItemCategory.ELECTRONICS,
    quantity: 1,
    value: 12500,
    description: 'Notebook principal de trabalho.',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Cadeira Ergonômica',
    category: ItemCategory.FURNITURE,
    quantity: 2,
    value: 850,
    description: 'Cadeiras para o escritório home office.',
    createdAt: Date.now() - 100000
  }
];

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  useEffect(() => {
    localStorage.setItem('inventory_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    if (!editingItem) return;
    
    setItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...updatedData } 
        : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Derived state for filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = items.reduce((acc, item) => acc + (item.value * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Inventário<span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Gerenciamento Inteligente de Ativos
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Stats Overview */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-28">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs font-semibold uppercase">Total Itens</span>
                    <Package className="text-indigo-500" size={18} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{totalItems}</span>
                    <span className="text-xs text-gray-400 block">unidades registradas</span>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-28">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs font-semibold uppercase">Valor Total</span>
                    <TrendingUp className="text-green-500" size={18} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalValue)}
                    </span>
                    <span className="text-xs text-gray-400 block">patrimônio estimado</span>
                  </div>
               </div>
            </div>

            {/* Form */}
            <InventoryForm 
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              initialData={editingItem}
              onCancel={() => setEditingItem(null)}
            />

            {/* Chart */}
            <StatsChart items={items} />
          </div>

          {/* Right Column: List & Filters */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar itens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <button 
                  onClick={() => setFilterCategory('Todos')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === 'Todos' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Todos
                </button>
                {Object.values(ItemCategory).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Nenhum item encontrado</h3>
                  <p className="text-gray-500 mt-1">Tente ajustar seus filtros ou adicione um novo item.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredItems.map(item => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-semibold text-gray-900">{item.name}</h3>
                           <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide font-medium">
                             {item.category}
                           </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">{item.quantity}</span> unid.
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1">
                            Unit: <span className="font-medium text-gray-900">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                            </span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                           <span className="flex items-center gap-1">
                            Total: <span className="font-medium text-emerald-600">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value * item.quantity)}
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-center">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-center text-xs text-gray-400 pb-8 flex items-center justify-center gap-1">
              <AlertCircle size={12} />
              <span>Dica: Use o botão "IA Magic" no formulário para preencher dados automaticamente.</span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
