// Em: src/components/ComboboxSearch.tsx (VERSÃO FINAL SIMPLIFICADA E COM TAMANHO AJUSTADO)

import React, { useState, useMemo } from 'react';
// REMOVIDO: import { Combobox, Transition } from '@headlessui/react';
// REMOVIDO: import { ChevronUpDownIcon } from '@heroicons/react/20/solid'; 


// --- TIPOS ---
type Item = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxSearchProps = {
  label: string;
  items: Item[];
  selectedValue: string;
  onSelect: (value: string) => void;
  // A classe para o input, passada pelo MatchSimulator
  inputClassName?: string; 
};

export function ComboboxSearch({ label, items, selectedValue, onSelect, inputClassName }: ComboboxSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!query) return items.slice(0, 500); // Limite aumentado para 500
    
    return items.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, items]);

  const selectedLabel = useMemo(() => {
      const selectedItem = items.find(i => i.value === selectedValue);
      return selectedItem ? selectedItem.label.replace(/^\d+\.\s*/, '') : '';
  }, [selectedValue, items]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setQuery('');
    setIsOpen(false);
  };

  // Garante que o inputClassName seja aplicado no input
  const inputClasses = inputClassName || "w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500";
  // Adicione p-4 e text-lg manualmente para garantir o tamanho
  const finalInputClasses = `${inputClasses} p-4 text-lg`;


  return (
    <div className="relative z-10 w-full"> 
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        
        {/* Input de Busca (Onde o usuário digita) */}
        <input
            type="text"
            // Exibe a busca ou o valor selecionado
            value={query || selectedLabel}
            onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                // Limpa a seleção ao começar a digitar
                if (e.target.value === '') onSelect(''); 
            }}
            onFocus={() => setIsOpen(true)}
            // Pequeno delay para permitir o clique antes de fechar
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
            placeholder="Digite para buscar o jogador..."
            // APLICAMOS AS NOVAS CLASSES DE TAMANHO AQUI
            className={finalInputClasses}
        />

        {/* Dropdown de Resultados (Usando HTML/Tailwind simples) */}
        {isOpen && filteredItems.length > 0 && (
            <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                {filteredItems.map(item => (
                    <div
                        key={item.value}
                        onMouseDown={() => handleSelect(item.value)} 
                        className={`p-3 text-sm cursor-pointer hover:bg-gray-700 ${item.value === selectedValue ? 'bg-gray-700 text-green-500' : 'text-gray-300'} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        )}
         {isOpen && filteredItems.length === 0 && query !== '' && (
              <div className="absolute w-full mt-1 p-3 text-sm text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
                Nenhum jogador encontrado.
              </div>
         )}
    </div>
  );
}