import React, { useMemo, useState } from 'react';

const HelpCenter: React.FC = () => {
  const [query, setQuery] = useState('');

  const articles = [
    { id: 1, title: 'Como configurar o rastreamento em tempo real', tags: ['rastreamento', 'gps'] },
    { id: 2, title: 'Gerenciamento de múltiplos tenants', tags: ['tenants', 'multi-tenant'] },
    { id: 3, title: 'Melhores práticas para otimização de rotas', tags: ['rotas', 'otimização'] },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)));
  }, [query]);

  const openTicket = () => {
    window.location.href = 'mailto:suporte@exemplo.com?subject=Suporte%20Logistica%20Multi-Tenant';
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Centro de Ajuda</h1>
        <p className="text-gray-400 mt-2">Artigos, FAQs e formas de contato para suporte.</p>
      </header>

      <div className="bg-gray-900 p-6 rounded-lg grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm text-gray-400">Pesquisar artigos</label>
          <div className="mt-2 flex">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por palavra-chave ou endpoint"
              className="flex-1 p-3 rounded-l bg-gray-800 text-gray-100 focus:outline-none"
            />
            <button
              onClick={() => { /* mantemos para acessibilidade, busca já reativa */ }}
              className="bg-blue-600 px-4 rounded-r"
            >Pesquisar</button>
          </div>

          <h3 className="text-lg font-semibold text-white mt-6">Artigos</h3>
          <ul className="mt-3 space-y-3 text-gray-300">
            {filtered.map(a => (
              <li key={a.id} className="py-2 border-b border-gray-800">{a.title}</li>
            ))}
            {filtered.length === 0 && <li className="text-sm text-gray-500">Nenhum artigo encontrado.</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">FAQ rápido</h3>
          <dl className="mt-3 space-y-4 text-gray-300">
            <div>
              <dt className="font-medium text-white">Como obtenho um token?</dt>
              <dd className="text-sm">Use <span className="font-mono">POST /auth/login</span> com suas credenciais.</dd>
            </div>
            <div>
              <dt className="font-medium text-white">Posso simular uma rota?</dt>
              <dd className="text-sm">Sim — vá até a lista de transportes e clique em <em>Simular</em> para abrir o rastreamento.</dd>
            </div>
          </dl>

          <div className="mt-6 bg-gray-800 p-4 rounded">
            <h4 className="text-sm text-white font-semibold">Precisa de ajuda direta?</h4>
            <p className="text-gray-400 text-sm mt-2">Abra um ticket para suporte técnico ou envie um e-mail para <span className="font-mono">suporte@exemplo.com</span>.</p>
            <button onClick={openTicket} className="mt-4 bg-green-600 px-4 py-2 rounded">Abrir ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
