// Em: src/pages/Cadastro.tsx (APLICANDO A COR DO TÍTULO AO BOTÃO E LINK)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cadastro = () => {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleCadastro = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        // Lógica de simulação de registro
        if (name && email && password) {
            toast.success('Cadastro simulado com sucesso! Redirecionando para o Login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 1500); 
        } else {
            setError('Por favor, preencha todos os campos.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-green-400">
                    Criar Conta {/* COR: text-green-400 */}
                </h2>
                
                {/* Formulário (campos omitidos por brevidade - mantidos no seu código) */}
                <form onSubmit={handleCadastro} className="space-y-4">
                    
                    {/* ... (Campos de Nome, E-mail, Senha e Confirmação) ... */}
                    
                    {/* Botão de Cadastro - CORREÇÃO AQUI */}
                    <button
                        type="submit"
                        // Corrigido para usar bg-green-500, que harmoniza com text-green-400 no tema Dark
                        className="w-full py-3 font-bold text-gray-900 bg-green-500 rounded-lg hover:bg-green-600 transition duration-150 shadow-lg mt-6"
                    >
                        Cadastrar
                    </button>
                    
                    {/* Mensagem de Erro (Mantida) */}
                    {error && (
                        <div className="text-red-400 text-center text-sm p-3 bg-red-900/30 rounded">
                            {error}
                        </div>
                    )}
                </form>

                {/* Link para Login - CORREÇÃO AQUI */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Já tem conta? 
                    {/* Corrigido para usar text-green-400 para combinar com o título */}
                    <a onClick={() => navigate('/login')} className="text-green-400 hover:underline cursor-pointer ml-1 font-medium">
                        Entrar agora.
                    </a>
                </p>
            </div>
        </div>
    );
};
export default Cadastro;