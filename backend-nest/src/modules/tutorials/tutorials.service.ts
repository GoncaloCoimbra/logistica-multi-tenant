import { Injectable, Logger } from '@nestjs/common';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  transcript: string;
  videoUrl?: string;
}

@Injectable()
export class TutorialsService {
  private readonly logger = new Logger(TutorialsService.name);

  // Mock data — em produção, viria de um banco de dados
  private tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Início rápido: criar primeiro transporte',
      description: 'Aprenda os passos básicos para criar seu primeiro transporte no sistema.',
      duration: '6 min',
      category: 'Começar',
      transcript: 'Passo 1: Clique em "Transportes" no menu lateral.\nPasso 2: Clique em "Novo transporte".\nPasso 3: Preencha os detalhes de origem, destino e carga.\nPasso 4: Selecione um veículo disponível.\nPasso 5: Clique em "Criar" para confirmar.',
      videoUrl: 'https://example.com/video1.mp4'
    },
    {
      id: 2,
      title: 'Configurar rastreamento em tempo real',
      description: 'Siga este guia para ativar e monitorar transportes em tempo real.',
      duration: '8 min',
      category: 'Rastreamento',
      transcript: 'O rastreamento em tempo real utiliza GPS para monitorar a posição dos veículos.\nPasso 1: Vá para "Rastreamento e Otimização de Rotas".\nPasso 2: Selecione um transporte em trânsito.\nPasso 3: Observe o mapa em tempo real com atualização a cada 5 segundos.\nPasso 4: Use os filtros para refinar a visualização.',
      videoUrl: 'https://example.com/video2.mp4'
    },
    {
      id: 3,
      title: 'Otimização de rotas básica',
      description: 'Discover how to optimize routes for better efficiency and cost savings.',
      duration: '10 min',
      category: 'Otimização',
      transcript: 'A otimização de rotas reduz tempo de viagem e combustível.\nPasso 1: Acesse a seção de "Rastreamento".\nPasso 2: Selecione múltiplos pontos de entrega.\nPasso 3: Clique em "Otimizar rota".\nPasso 4: Compare as rotas sugeridas com a original.\nPasso 5: Aplique a melhor opção.',
      videoUrl: 'https://example.com/video3.mp4'
    },
    {
      id: 4,
      title: 'Gerenciando múltiplos tenants',
      description: 'Para Super Admins: estabeleça e gerencie múltiplas empresas.',
      duration: '12 min',
      category: 'Admin',
      transcript: 'Em um sistema multi-tenant, cada empresa tem seus próprios dados isolados.\nPasso 1: Como Super Admin, acesse "Empresas".\nPasso 2: Clique em "Criar nova empresa".\nPasso 3: Configure os detalhes e permissões.\nPasso 4: Atribua usuários à empresa.\nPasso 5: Cada empresa terá seu próprio dashboard.',
      videoUrl: 'https://example.com/video4.mp4'
    },
    {
      id: 5,
      title: 'Relatórios e análises avançadas',
      description: 'Gere relatórios detalhados e analise métricas de performance.',
      duration: '9 min',
      category: 'Relatórios',
      transcript: 'Os relatórios ajudam a entender padrões e melhorar operações.\nPasso 1: Vá para o Dashboard Avançado.\nPasso 2: Selecione o período de análise.\nPasso 3: Escolha as métricas que deseja visualizar.\nPasso 4: Exporte o relatório em PDF.\nPasso 5: Compartilhe com sua equipe.',
      videoUrl: 'https://example.com/video5.mp4'
    }
  ];

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = this.tutorials.length;
    const totalPages = Math.ceil(total / limit);

    const tutorials = this.tutorials.slice(skip, skip + limit);

    this.logger.log(`📚 GET /tutorials - Page: ${page}, Limit: ${limit}, Total: ${total}`);

    return {
      data: tutorials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const tutorial = this.tutorials.find(t => t.id === id);

    if (!tutorial) {
      this.logger.warn(`📚 GET /tutorials/${id} - Not found`);
      return null;
    }

    this.logger.log(`📚 GET /tutorials/${id} - Found`);
    return tutorial;
  }

  async findByCategory(category: string, page: number = 1, limit: number = 10) {
    const filtered = this.tutorials.filter(t => t.category.toLowerCase() === category.toLowerCase());
    const skip = (page - 1) * limit;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const tutorials = filtered.slice(skip, skip + limit);

    this.logger.log(`📚 GET /tutorials/category/${category} - Found ${total} tutorials`);

    return {
      data: tutorials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
