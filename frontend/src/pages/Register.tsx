import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyNif: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.userPassword !== formData.confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    if (formData.userPassword.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
     
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/registration/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Criar Nova Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Registe a sua empresa e crie a conta de administrador
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Dados da Empresa</h3>
            
            <input
              name="companyName"
              type="text"
              required
              placeholder="Nome da Empresa *"
              value={formData.companyName}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="companyNif"
              type="text"
              required
              placeholder="NIF da Empresa *"
              value={formData.companyNif}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="companyEmail"
              type="email"
              required
              placeholder="Email da Empresa *"
              value={formData.companyEmail}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="companyPhone"
              type="tel"
              placeholder="Telefone da Empresa"
              value={formData.companyPhone}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="companyAddress"
              type="text"
              placeholder="Morada da Empresa"
              value={formData.companyAddress}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Conta de Administrador</h3>
            
            <input
              name="userName"
              type="text"
              required
              placeholder="Nome Completo *"
              value={formData.userName}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="userEmail"
              type="email"
              required
              placeholder="Email *"
              value={formData.userEmail}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="userPassword"
              type="password"
              required
              placeholder="Password *"
              value={formData.userPassword}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirmar Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};