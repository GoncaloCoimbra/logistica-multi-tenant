import React from 'react';

const SystemStatus: React.FC = () => {
  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Banco de Dados', status: 'degraded' },
    { name: 'Worker de rotas', status: 'operational' },
    { name: 'Serviço de mapas', status: 'maintenance' },
  ];

  const badge = (s: string) => {
    if (s === 'operational') return <span className="px-2 py-1 text-xs bg-green-600 rounded">Operacional</span>;
    if (s === 'degraded') return <span className="px-2 py-1 text-xs bg-yellow-500 rounded">Degradado</span>;
    if (s === 'maintenance') return <span className="px-2 py-1 text-xs bg-red-600 rounded">Manutenção</span>;
    return <span className="px-2 py-1 text-xs bg-gray-600 rounded">Desconhecido</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header>
        <h1 className="text-3xl font-extrabold text-white">Status do Sistema</h1>
        <p className="text-gray-400 mt-2">Visão geral da disponibilidade dos componentes principais.</p>
      </header>

      <main className="mt-6 bg-gray-900 p-6 rounded-lg">
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.name} className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <div>
                <div className="text-white font-medium">{s.name}</div>
                <div className="text-sm text-gray-400">Última verificação: há 2 minutos</div>
              </div>
              <div>{badge(s.status)}</div>
            </div>
          ))}
        </div>
      </main>

      <section className="mt-6 text-gray-400 text-sm">
        <p>Se houver interrupções, verificaremos automaticamente e publicaremos atualizações nesta página. Para suporte imediato, abra um ticket.</p>
      </section>
    </div>
  );
};

export default SystemStatus;
