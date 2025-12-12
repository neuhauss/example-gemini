export enum ItemCategory {
  ELECTRONICS = 'Eletrônicos',
  FURNITURE = 'Móveis',
  CLOTHING = 'Roupas',
  BOOKS = 'Livros',
  TOOLS = 'Ferramentas',
  OTHER = 'Outros'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory | string;
  quantity: number;
  value: number;
  description: string;
  createdAt: number;
}

export interface AIPrediction {
  category: string;
  estimatedValue: number;
  description: string;
}
