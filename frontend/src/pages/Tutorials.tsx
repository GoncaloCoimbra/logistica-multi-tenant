import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTutorials } from '../hooks/useTutorials';

const Tutorials: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 3; // 3 tutoriais por página

  const { data, loading, error } = useTutorials(page, limit);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-900 text-red-100 p-4 rounded">Erro: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-gray-400">Carregando tutoriais...</div>
      </div>
    );
  }

  const tutorials = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Tutoriais</h1>
        <p className="text-gray-400 mt-2">Vídeos curtos e guias passo a passo para usuários e administradores.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {tutorials.map(t => (
          <article key={t.id} className="bg-gray-900 rounded-lg p-4 shadow-sm">
            <div className="h-36 bg-gradient-to-r from-blue-700 to-purple-700 rounded-md flex items-center justify-center text-white font-semibold text-sm text-center p-2">{t.category}</div>
            <h3 className="mt-3 text-white font-semibold text-sm">{t.title}</h3>
            <p className="text-xs text-gray-400 mt-1">Duração: {t.duration}</p>
            <p className="text-xs text-gray-500 mt-2">{t.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <Link to={`/tutorials/${t.id}`} className="bg-blue-600 px-3 py-1 rounded text-sm text-white">Ver tutorial</Link>
              <a href={`/tutorials/${t.id}#transcript`} className="text-xs text-gray-400">Transcrição</a>
            </div>
          </article>
        ))}
      </div>

      {pagination && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-gray-400">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNext}
            className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      )}

      <section className="mt-8 text-gray-400">
        <h4 className="text-white font-semibold">Sugestões</h4>
        <p className="text-sm mt-2">Se quiser um tutorial específico, solicite via centro de ajuda e priorizaremos o conteúdo.</p>
      </section>
    </div>
  );
};

export default Tutorials;
