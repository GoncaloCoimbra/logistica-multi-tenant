import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';  // ← ADICIONE ESTA IMPORTAÇÃO
import Footer from './Footer'; 

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <Header />

      {/* Container principal com Sidebar + Conteúdo */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo da página */}
        <main className="flex-1 md:ml-64 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;