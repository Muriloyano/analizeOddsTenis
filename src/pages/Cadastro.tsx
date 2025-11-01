// Em: src/pages/Cadastro.tsx (FINAL E CORRIGIDO PARA O TESTE COMPLETO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cadastro = () => {
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [source, setSource] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessKey, setAccessKey] = useState(''); // Estado para a Chave de Acesso
    const [error, setError] = useState('');

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !birthDate || !email || !password || !accessKey) { 
            setError('Por favor, preencha todos os campos obrigatórios, incluindo a Chave de Acesso.');
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            password,
            birthDate,
            source: source || undefined,
            accessKey // Campo enviado para a API
        };

        try {
            const response = await fetch('/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro desconhecido ao cadastrar.');
                toast.error(`Falha no Cadastro: ${data.error || 'Erro de rede'}`);
                return;
            }

            toast.success('Usuário cadastrado com sucesso! Faça login.');
            setTimeout(() => {
                navigate('/login');
            }, 1500); 

        } catch (err) {
            console.error(err);
            setError('Erro de conexão. Servidor de autenticação inacessível.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
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
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 appearance-none"
                                >
                                    <option value="">Selecione uma opção...</option>
                                    <option value="Redes Sociais">Redes Sociais</option>
                                    <option value="Indicacao">Indicação de Conhecido</option>
                                    <option value="Busca">Busca Orgânica</option>
                                    <option value="Outros">Outros</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
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

                    {/* CAMPO NOVO E ESSENCIAL: CHAVE DE ACESSO (Largura total) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Chave de Acesso / Convite</label>
                        <input
                            type="text"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                            placeholder="Insira seu código de ativação aqui"
                            required
                        />
                    </div>
                    
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