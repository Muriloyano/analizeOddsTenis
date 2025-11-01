// Em: src/pages/Login.tsx (LÓGICA REAL DE VERIFICAÇÃO DE BANCO)

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redireciona imediatamente se já estiver logado
    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    // FUNÇÃO handleLogin ADAPTADA PARA O BANCO DE DADOS
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Preencha e-mail e senha.');
            return;
        }

        try {
            // CHAMADA PARA A API DE LOGIN (VERIFICAÇÃO NO BANCO)
            const response = await fetch('/api/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Se a API retornar 401 (Credenciais Inválidas) ou 500 (Erro de Servidor)
                setError(data.error || 'Falha na comunicação com o servidor.');
                return;
            }

            // SUCESSO: Chama o login do Context com os dados do banco
            login({ id: data.user.id, name: data.user.firstName }); 

            // Não precisa de navigate aqui; o PrivateRoute cuidará da navegação para '/'
            
        } catch (err) {
            console.error(err);
            setError('Erro de rede ou servidor de autenticação inacessível.');
        }
    };
    
    // ... (restante do código JSX) ...

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-green-400">
                    Acesso Restrito
                </h2>
                
                {/* Formulário */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* CAMPO 1: E-mail */}
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

                    {/* CAMPO 2: Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500"
                            placeholder="******"
                            required
                        />
                    </div>
                    
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="text-red-400 text-center text-sm p-3 bg-red-900/30 rounded">
                            {error}
                        </div>
                    )}

                    {/* Botão de Login */}
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-gray-900 bg-green-500 rounded-lg hover:bg-green-600 transition duration-150 shadow-lg"
                    >
                        Entrar no Simulador
                    </button>
                </form>

                {/* Link para Cadastro */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Ainda não tem conta? 
                    <a onClick={() => navigate('/cadastro')} className="text-green-400 hover:underline cursor-pointer ml-1 font-medium">
                        Cadastre-se aqui.
                    </a>
                </p>
            </div>
        </div>
    );
};
export default Login;