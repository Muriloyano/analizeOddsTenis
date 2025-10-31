// Em: src/components/ComboboxSearch.tsx (CORRIGIDO: Imports e Classes)

import React, { useState, Fragment, useMemo } from 'react';
// CORREÇÃO: Importar Headless UI (Assumindo que está instalado, se não, rode npm install @headlessui/react)
import { Combobox, Transition } from '@headlessui/react';
// CORREÇÃO: Importar o ícone (Assumindo que @heroicons/react está instalado, se não, rode npm install @heroicons/react)
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'; 


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
  // Nova prop para estilizar o input
  inputClassName?: string; 
};

export function ComboboxSearch({ label, items, selectedValue, onSelect, inputClassName }: ComboboxSearchProps) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (query === '') {
      // Limita a 50 itens se não houver busca, para performance
      return items.slice(0, 50); 
    }
    return items.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, items]);

  const displayValue = useMemo(() => {
    const selectedItem = items.find(item => item.value === selectedValue);
    if (selectedItem) {
        const parts = selectedItem.label.split(' (');
        return parts[0].replace(/^\d+\.\s*/, ''); 
    }
    return '';
  }, [selectedValue, items]);

  return (
    <div className="relative z-10 w-full"> 
      <Combobox value={selectedValue} onChange={onSelect}>
        <Combobox.Label className="block text-sm font-medium text-gray-400 mb-1">
          {label}
        </Combobox.Label>
        <div className="relative">
          <Combobox.Input
            // CORREÇÃO: Aplicar as classes de tamanho p-4 e text-lg 
            // e garantir que a cor do texto do placeholder esteja correta
            className={inputClassName || "w-full p-4 bg-gray-700 text-lg text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-400"} 
            displayValue={() => displayValue}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Digite para buscar o jogador..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm custom-scrollbar z-50">
            {filteredItems.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nenhum jogador encontrado.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-green-600 text-white' : 'text-gray-200'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                  }
                  value={item.value}
                  disabled={item.disabled}
                >
                  {({ selected, active }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {item.label}
                    </span>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}