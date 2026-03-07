import React from 'react';

const ApiDocumentation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Documentação da API</h1>
        <p className="text-gray-400 mt-2">Endpoints principais, exemplos de uso e padrões de autenticação.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-3">Autenticação</h2>
          <p className="text-gray-300">Utilize o header <span className="font-mono">Authorization: Bearer &lt;token&gt;</span>. Tokens expiram em 24 horas por padrão.</p>
          <ul className="mt-4 text-sm text-gray-400 space-y-2">
            <li><strong>POST</strong> /auth/login — obtém token JWT.</li>
            <li><strong>POST</strong> /auth/refresh — renova token.</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-3">Rate Limit & Headers</h2>
          <p className="text-gray-300">Respeite as headers de limite e utilize compressão gzip nas requisições grandes.</p>
          <ul className="mt-4 text-sm text-gray-400 space-y-2">
            <li><span className="font-mono">X-RateLimit-Limit</span>, <span className="font-mono">X-RateLimit-Remaining</span></li>
            <li>Content-Type: application/json</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">Endpoints de exemplo</h3>

        <div className="space-y-6 text-sm text-gray-300">
          <div className="bg-gray-800 p-4 rounded">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400 font-semibold">GET</span>
              <span className="font-mono">/vehicles</span>
            </div>
            <p className="mt-2 text-gray-400">Lista veiculos com paginação e filtros por status/tenant.</p>
            <pre className="mt-3 bg-gray-700 p-3 rounded text-xs overflow-auto"><code>{`curl -H "Authorization: Bearer <token>" https://api.example.com/vehicles?page=1&limit=20`}</code></pre>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400 font-semibold">POST</span>
              <span className="font-mono">/transports</span>
            </div>
            <p className="mt-2 text-gray-400">Cria um novo transporte; corpo JSON com origem/destino e carga.</p>
            <pre className="mt-3 bg-gray-700 p-3 rounded text-xs overflow-auto"><code>{`curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"origin":"...","destination":"..."}' https://api.example.com/transports`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mt-8 text-gray-400">
        <h4 className="text-sm font-semibold text-white mb-2">Formato de data</h4>
        <p className="text-sm">Usamos ISO 8601 em UTC: <span className="font-mono">2026-02-27T14:30:00Z</span></p>
      </section>
    </div>
  );
};

export default ApiDocumentation;
