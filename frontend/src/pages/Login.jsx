import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Credenciais inválidas.');
        return;
      }

      navigate('/painel');
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-fusion-bg overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-fusion-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-fusion-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass-card max-w-[420px] w-full p-8 flex flex-col items-center relative z-10">
        <div className="mb-8">
          <div className="w-16 h-16 bg-fusion-primary rounded-2xl flex items-center justify-center shadow-fusion-purple-glow">
            <span className="text-3xl font-bold text-white uppercase italic">F</span>
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight">Fusion Gym</h1>
        <p className="text-white/60 mb-8 text-center">Bem-vindo ao seu portal de membro</p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="floating-label-group">
            <input 
              type="email" 
              placeholder=" "
              className="input-field w-full group"
              id="email"
              required
            />
            <label htmlFor="email" className="floating-label">E-mail</label>
          </div>

          <div className="floating-label-group">
            <input 
              type="password" 
              placeholder=" "
              className="input-field w-full"
              id="password"
              required
            />
            <label htmlFor="password" className="floating-label">Senha</label>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-fusion-primary text-sm hover:underline">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary w-full shadow-lg shadow-fusion-accent/20 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-white/60">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-fusion-accent font-bold hover:underline">
            Criar conta &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
