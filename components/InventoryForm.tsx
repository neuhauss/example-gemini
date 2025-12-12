import React, { useState, useEffect } from 'react';
import { InventoryItem, ItemCategory } from '../types';
import { enrichItemData } from '../services/geminiService';
import { Sparkles, Plus, Save, X, Loader2 } from 'lucide-react';

interface InventoryFormProps {
  onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  initialData?: InventoryItem | null;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(ItemCategory.OTHER);
  const [quantity, setQuantity] = useState<number>(1);
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setValue(initialData.value);
      setDescription(initialData.description);
    } else {
        resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
      setName('');
      setCategory(ItemCategory.OTHER);
      setQuantity(1);
      setValue(0);
      setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      quantity: Number(quantity),
      value: Number(value),
      description,
    });
    if (!initialData) resetForm();
  };

  const handleAiAutoFill = async () => {
    if (!name) return;
    setIsAiLoading(true);
    try {
      const prediction = await enrichItemData(name);
      if (prediction) {
        setCategory(prediction.category);
        setValue(prediction.estimatedValue);
        setDescription(prediction.description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Editar Item' : 'Novo Item'}
        </h2>
        {initialData && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Ex: Cadeira de Escritório"
            />
            <button
              type="button"
              onClick={handleAiAutoFill}
              disabled={!name || isAiLoading}
              className={`px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${(!name || isAiLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              title="Preencher com IA"
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              <span className="hidden sm:inline text-sm font-medium">IA Magic</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Digite um nome e clique em "IA Magic" para sugerir detalhes.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              {Object.values(ItemCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 border p-2.5 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Detalhes adicionais..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            {initialData ? <Save size={20} /> : <Plus size={20} />}
            {initialData ? 'Salvar Alterações' : 'Adicionar ao Inventário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
