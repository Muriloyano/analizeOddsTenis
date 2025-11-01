// Em: src/pages/Login.tsx (Com Link de Cadastro)

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate(); // Hook de navegação

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redireciona imediatamente se já estiver logado
    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Lógica de simulação de login
        if (email === 'teste@email.com' && password === '123456') {
            login({ id: 'user-123', name: 'Testador' });
            // Não precisa de navigate aqui, o PrivateRoute no App.tsx cuidará disso.
        } else {
            setError('Credenciais incorretas. Use: teste@email.com / 123456');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-green-400">
                    Acesso Restrito
                </h2>
                
                {/* Formulário */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
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

                {/* NOVO LINK DE CADASTRO */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Ainda não tem conta? 
                    <a onClick={() => navigate('/cadastro')} 
                       className="text-indigo-400 hover:underline cursor-pointer ml-1 font-medium">
                        Cadastre-se aqui.
                    </a>
                </p>
            </div>
        </div>
    );
};
export default Login;