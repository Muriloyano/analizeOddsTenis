// Em: src/pages/Cadastro.tsx (FINAL: GRID DE 2 COLUNAS E ESTILO CUSTOMIZADO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cadastro = () => {
    const navigate = useNavigate();
    
    // NOVOS ESTADOS PARA OS NOVOS CAMPOS
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [source, setSource] = useState(''); // Valor do SELECT
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // REMOVIDO: const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleCadastro = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Verificação de Campos (sem Confirmação de Senha)
        if (!firstName || !lastName || !birthDate || !email || !password || !source) {
            setError('Por favor, preencha todos os campos obrigatórios, incluindo "Como Conheceu".');
            return;
        }

        // 2. Lógica de simulação de registro
        console.log({ firstName, lastName, birthDate, source, email, password });

        toast.success('Cadastro simulado com sucesso! Redirecionando para o Login...');
        
        setTimeout(() => {
            navigate('/login');
        }, 1500); 
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700"> {/* Max-w-2xl para o grid caber */}
                <h2 className="text-4xl font-extrabold mb-8 text-center text-green-400">
                    Criar Conta
                </h2>
                
                <form onSubmit={handleCadastro} className="space-y-6">
                    
                    {/* ESTRUTURA DE GRID: 2 COLUNAS E 3 LINHAS */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        
                        {/* 1A. Nome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                                placeholder="Seu primeiro nome"
                                required
                            />
                        </div>
                        
                        {/* 1B. Sobrenome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Sobrenome</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                                placeholder="Seu sobrenome"
                                required
                            />
                        </div>
                        
                        {/* 2A. Data de Nascimento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Data de Nascimento</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 appearance-none" 
                                required
                            />
                        </div>
                        
                        {/* 2B. Como Conheceu (SELECT ESTILIZADO) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Como conheceu nosso site?</label>
                            <div className="relative">
                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    // CLASSES CRUCIAIS: appearance-none + padding + cores de input
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 appearance-none"
                                    required
                                >
                                    <option value="" disabled>Selecione uma opção...</option>
                                    <option value="Redes Sociais">Redes Sociais</option>
                                    <option value="Indicacao">Indicação de Conhecido</option>
                                    <option value="Busca">Busca Orgânica (Google, etc.)</option>
                                    <option value="Outros">Outros</option>
                                </select>
                                {/* Flecha de Dropdown Customizada para manter o estilo uniforme */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                     {/* Ícone SVG de seta para baixo */}
                                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* 3A. E-mail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                                placeholder="seuemail@exemplo.com"
                                required
                            />
                        </div>

                        {/* 3B. Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                    </div>
                    {/* FIM DA ESTRUTURA DE GRID */}
                    
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="text-red-400 text-center text-sm p-3 bg-red-900/30 rounded mt-4">
                            {error}
                        </div>
                    )}

                    {/* Botão de Cadastro */}
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-gray-900 bg-green-500 rounded-lg hover:bg-green-600 transition duration-150 shadow-lg mt-6"
                    >
                        Cadastrar
                    </button>
                </form>

                {/* Link para Login */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Já tem conta? 
                    <a onClick={() => navigate('/login')} className="text-green-400 hover:underline cursor-pointer ml-1 font-medium">
                        Entrar agora.
                    </a>
                </p>
            </div>
        </div>
    );
};
export default Cadastro;