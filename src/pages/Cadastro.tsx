// Em: src/pages/Cadastro.tsx (CORRIGIDO E EXPANDIDO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cadastro = () => {
    const navigate = useNavigate();
    
    // NOVOS ESTADOS PARA OS NOVOS CAMPOS
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [source, setSource] = useState(''); // Como conheceu
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

        // Verifica se os campos obrigatórios estão preenchidos
        if (!firstName || !lastName || !birthDate || !email || !password) {
            setError('Por favor, preencha todos os campos obrigatórios (Nome, Sobrenome, Data de Nasc., E-mail, Senha).');
            return;
        }

        // Lógica de simulação de registro
        // Em um projeto real, você enviaria todos esses dados para o backend
        console.log({ 
            firstName, 
            lastName, 
            birthDate, 
            source, 
            email, 
            password 
        });

        toast.success('Cadastro simulado com sucesso! Redirecionando para o Login...');
        
        setTimeout(() => {
            navigate('/login');
        }, 1500); 
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-green-400">
                    Criar Conta
                </h2>
                
                <form onSubmit={handleCadastro} className="space-y-4">
                    
                    {/* Campo Nome (First Name) */}
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
                    
                    {/* Campo Sobrenome (Last Name) */}
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
                    
                    {/* Campo Data de Nascimento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    
                    {/* Campo Como Conheceu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Como conheceu nosso site? (Opcional)</label>
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                            placeholder="Ex: Amigo, Google, etc."
                        />
                    </div>
                    
                    {/* Campo E-mail */}
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

                    {/* Campo Senha */}
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

                    {/* Campo Confirmação de Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirme a Senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                            placeholder="Repita a senha"
                            required
                        />
                    </div>
                    
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="text-red-400 text-center text-sm p-3 bg-red-900/30 rounded">
                            {error}
                        </div>
                    )}

                    {/* Botão de Cadastro (Corrigido para green-500) */}
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-gray-900 bg-green-500 rounded-lg hover:bg-green-600 transition duration-150 shadow-lg mt-6"
                    >
                        Cadastrar
                    </button>
                </form>

                {/* Link para Login (Corrigido para text-green-400) */}
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