// Em: src/components/ComboboxSearch.tsx

import { useState, useMemo } from 'react';

type Item = {
  value: string; // O valor a ser retornado (ex: "nome|elo")
  label: string; // O texto que aparece na lista (ex: "1. Federer (2200 Elo)")
};

type ComboboxProps = {
  label: string;
  items: Item[]; // A lista de jogadores que vamos buscar
  selectedValue: string;
  onSelect: (value: string) => void;
};

// Este é o componente que faremos o MatchSimulator usar
export function ComboboxSearch({ label, items, selectedValue, onSelect }: ComboboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 1. Lógica de Filtragem (Minimalista e Rápido)
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items.slice(0, 50); // Limita a 50 se não houver busca
    
    return items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Limita a 50 resultados na busca
  }, [searchTerm, items]);

  // 2. Determina o label do item selecionado
  const selectedLabel = useMemo(() => {
      const item = items.find(i => i.value === selectedValue);
      return item ? item.label : '';
  }, [selectedValue, items]);


  const handleSelect = (value: string) => {
    onSelect(value); // Retorna o valor completo
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative z-10"> {/* z-10 para o dropdown ficar por cima de tudo */}
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        
        {/* Input de Busca (Onde o usuário digita) */}
        <input
            type="text"
            placeholder={selectedLabel || "Digite para buscar o jogador..."}
            value={searchTerm || selectedLabel}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                onSelect(''); // Limpa a seleção enquanto digita
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Pequeno delay
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
        />

        {/* Dropdown de Resultados */}
        {isOpen && (
            <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {filteredItems.length === 0 && (
                    <div className="p-3 text-sm text-gray-400">Nenhum jogador encontrado.</div>
                )}
                
                {filteredItems.map(item => (
                    <div
                        key={item.value}
                        onMouseDown={() => handleSelect(item.value)} // Usa onMouseDown para evitar o onBlur
                        className={`p-3 text-sm cursor-pointer hover:bg-gray-700 ${item.value === selectedValue ? 'bg-gray-700 text-green-500' : 'text-gray-300'}`}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}