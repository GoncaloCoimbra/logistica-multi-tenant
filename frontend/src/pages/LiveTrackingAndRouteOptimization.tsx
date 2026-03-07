import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';
import TrackingMap from '../components/TrackingMap';
import RouteSimulator from '../components/RouteSimulator';
import { Trash2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Veiculo {
  id: string;
  placa: string;
  motorista: string;
  status: 'ativo' | 'inativo' | 'em_viagem' | 'manutencao' | 'carregando' | 'descarga';
  localizacao: {
    lat: number;
    lng: number;
  };
  velocidade: number;
  destino: string;
  ultimaAtualizacao: string;
  combustivel: number;
  temperatura: number;
  pressaoPneus: number;
  odometro: number;
  carga: number;
}

interface Rota {
  id: string;
  origem: string;
  destino: string;
  distancia: number;
  tempoEstimado: number;
  tempoOtimizado: number;
  combustivelEstimado: number;
  combustivelOtimizado: number;
  economia: number;
  paradas: Parada[];
  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada';
  dificuldade: 'baixa' | 'media' | 'alta';
  veiculoAtribuido: string;
}

interface Parada {
  id: string;
  endereco: string;
  tipo: 'coleta' | 'entrega' | 'ponto_interesse' | 'reabastecimento' | 'descanso';
  tempoEstimado: number;
  tempoReal: number;
  concluida: boolean;
  notas: string;
}

interface Geofence {
  id: string;
  nome: string;
  tipo: 'perigo' | 'restrito' | 'monitorado' | 'preferencial';
  raio: number;
  centro: {
    lat: number;
    lng: number;
  };
  horarios: {
    inicio: string;
    fim: string;
  };
  alertas: Alerta[];
}

interface Alerta {
  id: string;
  tipo: 'entrada' | 'saida' | 'velocidade' | 'parada_longa' | 'manutencao' | 'combustivel' | 'temperatura';
  veiculo: string;
  mensagem: string;
  timestamp: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  resolvido: boolean;
  acao: string;
}

interface Evento {
  id: string;
  tipo: 'inicio_viagem' | 'fim_viagem' | 'parada' | 'reabastecimento' | 'incidente' | 'manutencao' | 'alerta';
  veiculo: string;
  descricao: string;
  timestamp: string;
  localizacao: {
    lat: number;
    lng: number;
  };
  duracao?: number;
}

const LiveTrackingRouteOptimization: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alertasAtivos, setAlertasAtivos] = useState<Alerta[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [, setLiveDataError] = useState<string>('');
  const [, setLivePollError] = useState<string>('');

  const [abaAtiva, setAbaAtiva] = useState<'rastreamento' | 'rotas' | 'geofencing' | 'historico' | 'analytics'>('rastreamento');
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'mapa' | 'lista' | 'grid'>('mapa');
  const [selectedVeiculo, setSelectedVeiculo] = useState<string | null>(null);
  // selectedRota tracking handled via URL parameters
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [estatisticas, setEstatisticas] = useState({
    totalKm: 0,
    combustivelEconomizado: 0,
    tempoEconomizado: 0,
    co2Evitado: 0,
    alertasResolvidos: 0,
    eficienciaMedia: 0,
  });

  const [novaRota, setNovaRota] = useState({
    origem: '',
    destino: '',
    paradas: [] as string[],
    veiculo: '',
    prioridade: 'normal',
    parametros: {
      evitarPedagios: false,
      evitarCentrosUrbanos: false,
      priorizarTempo: true,
      otimizarCombustivel: true,
      considerarTransito: true,
      evitarEstradasPercursos: false,
    }
  });

  // Estados para rastreamento GPS
  const [trackingRoutes, setTrackingRoutes] = useState<any[]>([]);
  const [selectedTrackingRoute, setSelectedTrackingRoute] = useState<string | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    const loadLiveData = async () => {
      try {
        const [vRes, rRes, gRes, aRes, eRes] = await Promise.all([
          api.get('/vehicles').catch(() => ({ data: null })),
          api.get('/routes').catch(() => ({ data: null })),
          api.get('/geofences').catch(() => ({ data: null })),
          api.get('/alerts').catch(() => ({ data: null })),
          api.get('/events').catch(() => ({ data: null })),
        ]);

        let anyData = false;
        if (vRes?.data && Array.isArray(vRes.data) && vRes.data.length > 0) {
          // garantir que o ID seja sempre string para evitar problemas de comparação
          const vehiclesClean = vRes.data.map((v: any) => ({ ...v, id: String(v.id) }));
          setVeiculos(vehiclesClean);
          anyData = true;
        }
        if (rRes?.data && Array.isArray(rRes.data) && rRes.data.length > 0) { setRotas(rRes.data); anyData = true; }
        if (gRes?.data && Array.isArray(gRes.data) && gRes.data.length > 0) { setGeofences(gRes.data); anyData = true; }
        if (aRes?.data && Array.isArray(aRes.data) && aRes.data.length > 0) { setAlertasAtivos(aRes.data); anyData = true; }
        if (eRes?.data && Array.isArray(eRes.data) && eRes.data.length > 0) { setEventos(eRes.data); anyData = true; }
        if (!anyData) {
          setLiveDataError('Dados reais não disponíveis — sem dados locais. Configure o backend.');
        } else {
          setLiveDataError('');
        }
      } catch (err) {
        console.error('Erro ao carregar dados de LiveTracking do backend:', err);
      }
    };

    loadLiveData();

    const pollInterval = setInterval(async () => {
      try {
        const vRes = await api.get('/vehicles');
        if (vRes?.data && Array.isArray(vRes.data)) {
          setVeiculos(vRes.data);
          setLivePollError('');
        }
      } catch (err) {
        console.debug('Live vehicles poll falhou:', err);
        setLivePollError('Falha ao atualizar veículos em tempo real');
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // quando a lista chega do backend, escolhe o primeiro automaticamente
    if (!selectedVeiculo && veiculos.length > 0) {
      setSelectedVeiculo(String(veiculos[0].id));
      console.log('� Veículo selecionado (default):', veiculos[0].id);
    }
  }, [veiculos, selectedVeiculo]);

  // alterna aba com base na querystring (útil para links de footer/sidebar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const veh = params.get('vehicle');
    if (tab && ['rastreamento','rotas','geofencing','historico','analytics'].includes(tab)) {
      setAbaAtiva(tab as any);
      console.log('🔖 Aba definida por querystring:', tab);
    }
    if (veh && veiculos.length > 0) {
      const match = veiculos.find(v => String(v.id) === String(veh));
      if (match) {
        setSelectedVeiculo(String(match.id));
        console.log('🚗 Veículo selecionado via query:', match.id);
      }
    }
  }, [location.search]);

  useEffect(() => {
    const totalCombustivelEconomizado = rotas.reduce((acc, rota) => acc + (rota.combustivelEstimado - rota.combustivelOtimizado), 0);
    const totalTempoEconomizado = rotas.reduce((acc, rota) => acc + (rota.tempoEstimado - rota.tempoOtimizado), 0);
    const co2Evitado = totalCombustivelEconomizado * 2.68;
    const alertasResolvidos = alertasAtivos.filter(a => a.resolvido).length;
    const eficienciaMedia = veiculos.length > 0
      ? veiculos.reduce((acc, v) => acc + (v.combustivel / v.odometro * 100), 0) / veiculos.length
      : 0;

    setEstatisticas(prev => ({
      ...prev,
      combustivelEconomizado: parseFloat(totalCombustivelEconomizado.toFixed(1)),
      tempoEconomizado: Math.round(totalTempoEconomizado),
      co2Evitado: parseFloat(co2Evitado.toFixed(1)),
      alertasResolvidos,
      eficienciaMedia: parseFloat(eficienciaMedia.toFixed(2)),
    }));
  }, [rotas, alertasAtivos, veiculos]);

  // Carregar rotas de rastreamento GPS
  useEffect(() => {
    const loadTrackingRoutes = async () => {
      try {
        const res = await api.get('/transports/tracking-routes/all').catch(() => ({ data: [] }));
        if (res?.data && Array.isArray(res.data)) {
          setTrackingRoutes(res.data);
          console.log('✅ Rotas de rastreamento carregadas:', res.data.length);
        }
      } catch (err) {
        console.error('Erro ao carregar rotas de rastreamento:', err);
        setTrackingRoutes([]);
      }
    };

    loadTrackingRoutes();
  }, []);

  // Se há transport id na querystring, selecionar rota correspondente
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transportId = params.get('transport');
    const vehicleId = params.get('vehicle');
    
    if (transportId && trackingRoutes.length > 0) {
      // Procurar pela rota usando várias propriedades possíveis (id, transportId, transport.id)
      const match = trackingRoutes.find(r =>
        String(r.id) === String(transportId) ||
        String((r as any).transportId) === String(transportId) ||
        String((r as any).transport?.id) === String(transportId)
      );

      if (match) {
        setSelectedTrackingRoute(match.id);
        setAbaAtiva('historico'); // Mudar para aba de histórico/rastreamento
        console.log('🎯 Rota de transporte encontrada para simulação:', match.id);
        console.log('📍 Origem:', match.origin, '→ Destino:', match.destination);
        console.log('📊 Localizações:', match.locations?.length || 0);
      } else {
        console.warn(`⚠️ Transporte ${transportId} não encontrado nas rotas de rastreamento`);
        console.warn('Rotas disponíveis:', trackingRoutes.map(r => ({ id: r.id, transportId: (r as any).transportId || (r as any).transport?.id || null, name: r.name })));
      }
    }
    
    // Se há vehicleId, selecionar também o veículo
    if (vehicleId && veiculos.length > 0) {
      const vehicleMatch = veiculos.find(v => String(v.id) === String(vehicleId));
      if (vehicleMatch) {
        setSelectedVeiculo(String(vehicleMatch.id));
        console.log('🚗 Veículo selecionado via transporte:', vehicleMatch.id);
      }
    }
  }, [location.search, trackingRoutes, veiculos]);

  // Deletar todo o rastreamento GPS
  const handleClearAllTracking = async () => {
    setIsDeleteLoading(true);
    try {
      await api.delete('/transports/tracking-routes/clear-all');
      setTrackingRoutes([]);
      setSelectedTrackingRoute(undefined);
      setShowDeleteConfirm(false);
      alert('✅ Rastreamento GPS eliminado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao eliminar rastreamento:', error);
      const msg = error.response?.data?.message || 'Erro ao eliminar rastreamento GPS. Por favor, tente novamente.';
      alert('❌ ' + msg);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Deletar rastreamento de uma rota específica
  const handleDeleteRoute = async (routeId: string) => {
    try {
      await api.delete(`/transports/tracking-routes/${routeId}`);
      setTrackingRoutes(prev => prev.filter(r => r.id !== routeId));
      if (selectedTrackingRoute === routeId) {
        setSelectedTrackingRoute(undefined);
      }
      alert('Rota eliminada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao eliminar rota:', error);
      const msg = error.response?.data?.message || 'Erro ao eliminar rota. Por favor, tente novamente.';
      alert(msg);
    }
  };

  

  const getStatusColor = (status: Veiculo['status']) => {
    switch (status) {
      case 'ativo': return 'bg-emerald-500';
      case 'em_viagem': return 'bg-blue-500';
      case 'carregando': return 'bg-purple-500';
      case 'descarga': return 'bg-indigo-500';
      case 'inativo': return 'bg-gray-500';
      case 'manutencao': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Veiculo['status']) => {
    switch (status) {
      case 'ativo': return 'Disponível';
      case 'em_viagem': return 'Em Viagem';
      case 'carregando': return 'Carregando';
      case 'descarga': return 'Descarga';
      case 'inativo': return 'Inativo';
      case 'manutencao': return 'Manutenção';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: Alerta['prioridade']) => {
    switch (prioridade) {
      case 'baixa': return 'bg-blue-500';
      case 'media': return 'bg-amber-500';
      case 'alta': return 'bg-orange-500';
      case 'critica': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertaLabel = (tipo: Alerta['tipo']) => {
    switch (tipo) {
      case 'velocidade': return 'VEL';
      case 'entrada': return 'ENT';
      case 'saida': return 'SAI';
      case 'parada_longa': return 'PAR';
      case 'manutencao': return 'MAN';
      case 'combustivel': return 'COM';
      case 'temperatura': return 'TMP';
      default: return 'ALT';
    }
  };

  const getDificuldadeColor = (dificuldade: Rota['dificuldade']) => {
    switch (dificuldade) {
      case 'baixa': return 'bg-emerald-500';
      case 'media': return 'bg-amber-500';
      case 'alta': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventoLabel = (tipo: Evento['tipo']) => {
    switch (tipo) {
      case 'inicio_viagem': return 'INI';
      case 'fim_viagem': return 'FIM';
      case 'parada': return 'PAR';
      case 'reabastecimento': return 'REA';
      case 'incidente': return 'INC';
      case 'manutencao': return 'MAN';
      case 'alerta': return 'ALT';
      default: return '---';
    }
  };

  const getEventoColor = (tipo: Evento['tipo']) => {
    switch (tipo) {
      case 'inicio_viagem': return 'bg-blue-600';
      case 'fim_viagem': return 'bg-emerald-600';
      case 'parada': return 'bg-slate-600';
      case 'reabastecimento': return 'bg-amber-600';
      case 'incidente': return 'bg-red-600';
      case 'manutencao': return 'bg-orange-600';
      case 'alerta': return 'bg-red-700';
      default: return 'bg-slate-600';
    }
  };

  const getGeofenceTipoLabel = (tipo: Geofence['tipo']) => {
    switch (tipo) {
      case 'perigo': return 'PERIGO';
      case 'restrito': return 'RESTRITO';
      case 'preferencial': return 'PREFERENCIAL';
      case 'monitorado': return 'MONITORADO';
      default: return tipo;
    }
  };

  const getGeofenceColor = (tipo: Geofence['tipo']) => {
    switch (tipo) {
      case 'perigo': return 'bg-red-500';
      case 'restrito': return 'bg-amber-500';
      case 'preferencial': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  const handleOtimizarRota = () => {
    if (!novaRota.origem || !novaRota.destino || !novaRota.veiculo) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const distancia = 150 + Math.random() * 450;
    const tempoEstimado = (distancia / 60) * 60;
    const economia = novaRota.parametros.otimizarCombustivel ? 0.25 : 0.15;
    const tempoOtimizado = tempoEstimado * (1 - economia);
    const combustivelEstimado = distancia * 0.12;
    const combustivelOtimizado = combustivelEstimado * (1 - economia);

    const veiculoSelecionado = veiculos.find(v => v.placa === novaRota.veiculo);

    const novaRotaOtimizada: Rota = {
      id: Date.now().toString(),
      origem: novaRota.origem,
      destino: novaRota.destino,
      distancia: Math.round(distancia),
      tempoEstimado: Math.round(tempoEstimado),
      tempoOtimizado: Math.round(tempoOtimizado),
      combustivelEstimado: parseFloat(combustivelEstimado.toFixed(1)),
      combustivelOtimizado: parseFloat(combustivelOtimizado.toFixed(1)),
      economia: parseFloat((economia * 100).toFixed(1)),
      paradas: novaRota.paradas.map((parada, index) => ({
        id: (index + 1).toString(),
        endereco: parada,
        tipo: 'entrega',
        tempoEstimado: 15 + Math.random() * 30,
        tempoReal: 0,
        concluida: false,
        notas: novaRota.prioridade === 'alta' ? 'Prioridade máxima' : 'Entrega padrão'
      })),
      status: 'planejada',
      dificuldade: distancia > 400 ? 'alta' : distancia > 200 ? 'media' : 'baixa',
      veiculoAtribuido: novaRota.veiculo
    };

    setRotas([...rotas, novaRotaOtimizada]);
    setNovaRota({
      origem: '',
      destino: '',
      paradas: [],
      veiculo: '',
      prioridade: 'normal',
      parametros: {
        evitarPedagios: false,
        evitarCentrosUrbanos: false,
        priorizarTempo: true,
        otimizarCombustivel: true,
        considerarTransito: true,
        evitarEstradasPercursos: false,
      }
    });

    const novoEvento: Evento = {
      id: Date.now().toString(),
      tipo: 'inicio_viagem',
      veiculo: novaRota.veiculo,
      descricao: `Nova rota otimizada: ${novaRota.origem} → ${novaRota.destino}`,
      timestamp: new Date().toISOString(),
      localizacao: veiculoSelecionado?.localizacao || { lat: 0, lng: 0 }
    };

    setEventos(prev => [novoEvento, ...prev.slice(0, 9)]);
  };

  const handleResolverAlerta = (alertaId: string) => {
    setAlertasAtivos(prev => prev.map(alerta =>
      alerta.id === alertaId ? { ...alerta, resolvido: true } : alerta
    ));
  };

  const handleIniciarRota = (rotaId: string) => {
    const rota = rotas.find(r => r.id === rotaId);
    if (!rota) return;

    setRotas(prev => prev.map(r =>
      r.id === rotaId ? { ...r, status: 'em_andamento' } : r
    ));

    setVeiculos(prev => prev.map(v =>
      v.placa === rota.veiculoAtribuido ? { ...v, status: 'em_viagem', destino: rota.destino } : v
    ));
  };

  const veiculosFiltrados = filtroStatus === 'todos'
    ? veiculos
    : veiculos.filter(v => v.status === filtroStatus);

  const veiculoSelecionado = selectedVeiculo
    ? veiculos.find(v => String(v.id) === String(selectedVeiculo)) || null
    : null;

  return (
    <div style={{ fontFamily: "'Outfit', -apple-system, sans-serif", background: '#07090f', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: '#0d1117', borderBottom: '1px solid #1a2234' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f0f4ff' }}>
              Rastreamento GPS & Otimização de Rotas
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#3a4d63' }}>
              Monitorização em tempo real · Inteligência de rotas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: '#07090f', border: '1px solid #1a2234', color: '#7a8fa8' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#4f85f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Veículos Ativos: {veiculos.filter(v => v.status === 'em_viagem').length}/{veiculos.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-900/30 via-emerald-800/20 to-emerald-900/10 border-2 border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300">Economia Total</p>
                <p className="text-2xl font-bold text-white">{estatisticas.combustivelEconomizado}L</p>
                <p className="text-xs text-emerald-400/70 mt-1">Combustível economizado</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">ECO</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-blue-900/10 border-2 border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Tempo Economizado</p>
                <p className="text-2xl font-bold text-white">{estatisticas.tempoEconomizado}h</p>
                <p className="text-xs text-blue-400/70 mt-1">Horas otimizadas</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">TMP</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/10 border-2 border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">CO₂ Evitado</p>
                <p className="text-2xl font-bold text-white">{estatisticas.co2Evitado}kg</p>
                <p className="text-xs text-purple-400/70 mt-1">Redução ambiental</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">CO2</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-900/10 border-2 border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-300">Eficiência Média</p>
                <p className="text-2xl font-bold text-white">{estatisticas.eficienciaMedia}%</p>
                <p className="text-xs text-amber-400/70 mt-1">Performance da frota</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">EFI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Críticos */}
        {alertasAtivos.filter(a => !a.resolvido).length > 0 && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/20 border-2 border-red-500/40 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">ALT</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400">Alertas Ativos</h3>
                    <p className="text-sm text-slate-300">
                      {alertasAtivos.filter(a => !a.resolvido).length} alertas requerem atenção
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAlertasAtivos([])}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-medium"
                  >
                    Resolver Todos
                  </button>
                  <button
                    onClick={() => setAbaAtiva('rastreamento')}
                    className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-lg transition-all font-medium"
                  >
                    Ver Mapa
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {alertasAtivos.filter(a => !a.resolvido).map(alerta => (
                  <div key={alerta.id} className="bg-slate-900/60 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${getPrioridadeColor(alerta.prioridade)}`}>
                          <span className="text-xs font-bold text-white">{getAlertaLabel(alerta.tipo)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPrioridadeColor(alerta.prioridade)}`}>
                              {alerta.prioridade.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-400">{alerta.veiculo}</span>
                          </div>
                          <p className="text-sm font-medium text-white mb-1">{alerta.mensagem}</p>
                          <p className="text-xs text-slate-400">Ação: {alerta.acao}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleResolverAlerta(alerta.id)}
                        className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Resolver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          {/* Tabs */}
          <div style={{ background: '#0d1117', border: '1px solid #1a2234', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #1a2234' }} className="flex flex-wrap">
              {(['rastreamento', 'rotas', 'geofencing', 'historico', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAbaAtiva(tab)}
                  className={`flex-1 min-w-[140px] px-4 py-3 text-sm font-bold transition-all relative ${
                    abaAtiva === tab
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: abaAtiva === tab ? '#1a2a4a' : 'transparent',
                    borderBottom: abaAtiva === tab ? '2px solid #4f85f6' : 'none',
                    paddingBottom: abaAtiva === tab ? 'calc(0.75rem - 2px)' : '0.75rem'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tab === 'rastreamento' && 'Rastreamento Ao Vivo'}
                    {tab === 'rotas' && 'Inteligência de Rotas'}
                    {tab === 'geofencing' && 'Zonas de Controlo'}
                    {tab === 'historico' && 'Histórico & Eventos'}
                    {tab === 'analytics' && 'Analytics'}
                  </div>
                  {abaAtiva === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6">
              {abaAtiva === 'rastreamento' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Monitorização em Tempo Real</h3>
                      <p className="text-sm text-slate-400">Visualize rotas de rastreamento GPS</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                        <button
                          onClick={() => setViewMode('mapa')}
                          className={`px-4 py-2 text-sm ${viewMode === 'mapa' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                        >
                          Mapa
                        </button>
                        <button
                          onClick={() => setViewMode('lista')}
                          className={`px-4 py-2 text-sm ${viewMode === 'lista' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                        >
                          Lista
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`px-4 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                        >
                          Grid
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filtros */}
                  <div className="flex flex-wrap gap-4">
                    <select
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="px-4 py-2 bg-slate-800 border-2 border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="todos">Todos os Status</option>
                      <option value="em_viagem">Em Viagem</option>
                      <option value="ativo">Disponíveis</option>
                      <option value="carregando">Carregando</option>
                      <option value="descarga">Descarga</option>
                      <option value="manutencao">Manutenção</option>
                    </select>

                    <select
                      value={selectedVeiculo || ''}
                      onChange={(e) => setSelectedVeiculo(e.target.value || null)}
                      disabled={veiculos.length === 0}
                      className="px-4 py-2 bg-slate-800 border-2 border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {veiculos.length === 0 ? 'Nenhum veículo disponível' : 'Seleccionar Veículo...'}
                      </option>
                      {veiculos.map(v => (
                        <option key={v.id} value={String(v.id)}>
                          {v.placa} - {v.motorista} ({getStatusText(v.status)})
                        </option>
                      ))}
                    </select>

                    {selectedVeiculo && (
                      <button
                        onClick={() => {
                          if (selectedVeiculo) {
                            const rotasVeiculo = trackingRoutes.filter(r => 
                              String(r.vehicle?.id) === String(selectedVeiculo) || String(r.vehicleId) === String(selectedVeiculo)
                            );
                            if (rotasVeiculo.length > 0) {
                              setSelectedTrackingRoute(rotasVeiculo[0].id);
                              setViewMode('mapa');
                            } else {
                              alert('Nenhuma rota de rastreamento encontrada para este veículo');
                            }
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Ver Rota
                      </button>
                    )}
                  </div>

                  {/* Mapa */}
                  {viewMode === 'mapa' && (
                    <div className="relative bg-gradient-to-br from-slate-900 to-gray-950 rounded-xl h-[500px] border-2 border-blue-500/30 overflow-hidden">
                      {trackingRoutes.length > 0 ? (
                        <TrackingMap
                          routes={trackingRoutes.map(r => ({
                            id: r.id,
                            name: r.name || r.origin + ' → ' + r.destination,
                            locations: r.locations || [],
                            status: (r.status === 'in_transit' || r.status === 'pending' || r.status === 'completed') 
                              ? r.status as 'in_progress' | 'pending' | 'completed'
                              : 'pending' as const
                          }))}
                          selectedRouteId={selectedTrackingRoute}
                          onRouteSelect={setSelectedTrackingRoute}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-slate-400">Nenhuma rota de rastreamento disponível</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lista */}
                  {viewMode === 'lista' && (
                    <div className="space-y-4">
                      {veiculosFiltrados.map(veiculo => (
                        <div key={veiculo.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 ${getStatusColor(veiculo.status)} rounded-xl flex items-center justify-center`}>
                                <span className="text-xs font-bold text-white">VCL</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white text-lg">{veiculo.placa}</p>
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(veiculo.status)}`}>
                                    {getStatusText(veiculo.status)}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-300">{veiculo.motorista}</p>
                                <p className="text-xs text-slate-400">Destino: {veiculo.destino}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white text-xl">{veiculo.velocidade} km/h</p>
                              <p className="text-sm text-slate-400">{veiculo.combustivel}% combustível</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-slate-400">Temperatura</p>
                              <p className={`font-bold ${veiculo.temperatura > 90 ? 'text-red-400' : 'text-white'}`}>
                                {veiculo.temperatura}°C
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400">Pressão Pneus</p>
                              <p className="font-bold text-white">{veiculo.pressaoPneus} PSI</p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400">Odómetro</p>
                              <p className="font-bold text-white">{veiculo.odometro != null ? veiculo.odometro.toLocaleString() : 'N/A'} km</p>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-400">Última Atualização</p>
                              <p className="font-bold text-white">
                                {veiculo.ultimaAtualizacao ? `${Math.floor((Date.now() - new Date(veiculo.ultimaAtualizacao).getTime()) / 60000)} min` : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grid */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {veiculosFiltrados.map(veiculo => (
                        <div key={veiculo.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(veiculo.status)}`}></div>
                              <span className="font-bold text-white">{veiculo.placa}</span>
                            </div>
                            <span className="text-xs text-slate-400">{veiculo.velocidade} km/h</span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{veiculo.motorista}</p>
                          <p className="text-xs text-slate-400 mb-3">{veiculo.destino}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Combustível</span>
                              <span className="font-bold text-white">{veiculo.combustivel}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${veiculo.combustivel < 20 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${veiculo.combustivel}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detalhes do Veículo Selecionado */}
                  {veiculoSelecionado && (
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500/30">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-xl font-bold text-blue-400">Diagnóstico do Veículo</h4>
                          <p className="text-sm text-slate-400">Análise completa em tempo real</p>
                        </div>
                        <button
                          onClick={() => setSelectedVeiculo(null)}
                          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-slate-400">Identificação</p>
                            <div className="mt-2 space-y-2">
                              <p className="text-white font-medium">{veiculoSelecionado.placa}</p>
                              <p className="text-slate-300">{veiculoSelecionado.motorista}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Localização Atual</p>
                            <p className="text-white font-medium mt-2">
                              {veiculoSelecionado.localizacao?.lat != null ? veiculoSelecionado.localizacao.lat.toFixed(6) : 'N/A'}, {veiculoSelecionado.localizacao?.lng != null ? veiculoSelecionado.localizacao.lng.toFixed(6) : 'N/A'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Coordenadas GPS</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-slate-400">Performance</p>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-2xl font-bold text-white">{veiculoSelecionado.velocidade}</p>
                                <p className="text-xs text-slate-400">km/h</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-white">{veiculoSelecionado.combustivel}%</p>
                                <p className="text-xs text-slate-400">Combustível</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Odómetro</p>
                            <p className="text-xl font-bold text-white mt-2">
                              {veiculoSelecionado.odometro != null ? veiculoSelecionado.odometro.toLocaleString() : 'N/A'} km
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-slate-400">Condições</p>
                            <div className="mt-2 space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-slate-400">Temperatura Motor</span>
                                  <span className={`text-xs font-bold ${veiculoSelecionado.temperatura > 90 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {veiculoSelecionado.temperatura}°C
                                  </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${veiculoSelecionado.temperatura > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(100, veiculoSelecionado.temperatura)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-slate-400">Pressão Pneus</span>
                                  <span className="text-xs font-bold text-white">{veiculoSelecionado.pressaoPneus} PSI</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5">
                                  <div
                                    className="h-1.5 rounded-full bg-emerald-500"
                                    style={{ width: `${(veiculoSelecionado.pressaoPneus / 40) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="flex gap-3">
                          <button
                          onClick={() => alert('Funcionalidade de contactar motorista ainda não implementada')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                            Contactar Motorista
                          </button>
                          <button
                            onClick={() => alert('Ver histórico irá a página de histórico quando estiver disponível')}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                          >
                            Ver Histórico
                          </button>
                          <button
                            onClick={() => alert('Programação de manutenção ainda não habilitada')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Programar Manutenção
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {abaAtiva === 'rotas' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-900/20 via-emerald-800/15 to-emerald-900/10 rounded-xl p-6 border-2 border-emerald-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-emerald-400">Motor de Otimização</h4>
                        <p className="text-sm text-slate-400">Calcule a rota mais eficiente com IA</p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30">
                        IA ATIVA
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Origem *</label>
                        <input
                          type="text"
                          value={novaRota.origem}
                          onChange={(e) => setNovaRota({...novaRota, origem: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="Endereço de origem"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Destino *</label>
                        <input
                          type="text"
                          value={novaRota.destino}
                          onChange={(e) => setNovaRota({...novaRota, destino: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                          placeholder="Endereço de destino"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Veículo *</label>
                        <select
                          value={novaRota.veiculo}
                          onChange={(e) => setNovaRota({...novaRota, veiculo: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">Selecionar veículo</option>
                          {veiculos.filter(v => v.status === 'ativo' || v.status === 'em_viagem').map(v => (
                            <option key={v.id} value={v.placa}>
                              {v.placa} - {v.motorista} ({v.combustivel}%)
                            </option>
                          ))}
                        </select>
                        {veiculos.filter(v => v.status === 'ativo' || v.status === 'em_viagem').length === 0 && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Nenhum veículo ativo ou em viagem. Altere o status em <Link to="/veiculos" className="underline">Veículos</Link> para poder atribuir.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-300 mb-2">Paradas Intermédias</label>
                      <div className="space-y-3">
                        {novaRota.paradas.map((parada, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-300">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={parada}
                              onChange={(e) => {
                                const novasParadas = [...novaRota.paradas];
                                novasParadas[index] = e.target.value;
                                setNovaRota({...novaRota, paradas: novasParadas});
                              }}
                              className="flex-1 px-4 py-2 bg-slate-800 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                              placeholder={`Parada ${index + 1}`}
                            />
                            <button
                              onClick={() => {
                                const novasParadas = novaRota.paradas.filter((_, i) => i !== index);
                                setNovaRota({...novaRota, paradas: novasParadas});
                              }}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setNovaRota({...novaRota, paradas: [...novaRota.paradas, '']})}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                          + Adicionar Parada
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                      {[
                        { key: 'evitarPedagios', label: 'Evitar Pedágios' },
                        { key: 'evitarCentrosUrbanos', label: 'Evitar Centros' },
                        { key: 'priorizarTempo', label: 'Priorizar Tempo' },
                        { key: 'otimizarCombustivel', label: 'Otimizar Combustível' },
                        { key: 'considerarTransito', label: 'Tráfego Real' },
                        { key: 'evitarEstradasPercursos', label: 'Evitar Estradas Más' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={novaRota.parametros[key as keyof typeof novaRota.parametros]}
                            onChange={(e) => setNovaRota({
                              ...novaRota,
                              parametros: { ...novaRota.parametros, [key]: e.target.checked }
                            })}
                            className="w-4 h-4 accent-emerald-500"
                          />
                          <span className="text-sm text-slate-300">{label}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleOtimizarRota}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      CALCULAR ROTA OTIMIZADA
                      <div className="text-sm font-normal opacity-90 mt-1">
                        Economia estimada: 20–30% em custos operacionais
                      </div>
                    </button>
                  </div>

                  {/* Rotas Existentes */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">Rotas em Andamento</h3>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">Todas</button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Em Andamento</button>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">Planejadas</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {rotas.map(rota => (
                        <div key={rota.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-5 border border-slate-700 hover:border-blue-500/50 transition-all">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDificuldadeColor(rota.dificuldade)}`}>
                                  {rota.dificuldade.toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  rota.status === 'concluida' ? 'bg-emerald-900/30 text-emerald-300' :
                                  rota.status === 'em_andamento' ? 'bg-blue-900/30 text-blue-300' :
                                  rota.status === 'atrasada' ? 'bg-red-900/30 text-red-300' :
                                  'bg-slate-700 text-slate-300'
                                }`}>
                                  {rota.status === 'concluida' ? 'CONCLUÍDA' :
                                   rota.status === 'em_andamento' ? 'EM ANDAMENTO' :
                                   rota.status === 'atrasada' ? 'ATRASADA' : 'PLANEJADA'}
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-lg">
                                {rota.origem} → {rota.destino}
                              </h5>
                              <p className="text-sm text-slate-400">Veículo: {rota.veiculoAtribuido} · {rota.paradas.length} paradas</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-400">{rota.economia}%</p>
                              <p className="text-xs text-slate-400">Economia estimada</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                            <div className="text-center">
                              <p className="text-sm text-slate-400">Distância</p>
                              <p className="font-bold text-white text-xl">{rota.distancia} km</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-slate-400">Tempo Original</p>
                              <p className="font-bold text-white text-xl">{rota.tempoEstimado} min</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-slate-400">Tempo Otimizado</p>
                              <p className="font-bold text-emerald-400 text-xl">{rota.tempoOtimizado} min</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-slate-400">Combustível</p>
                              <p className="font-bold text-white text-xl">
                                <span className="line-through text-slate-500 mr-2">{rota.combustivelEstimado}L</span>
                                <span className="text-emerald-400">{rota.combustivelOtimizado}L</span>
                              </p>
                            </div>
                          </div>

                          <div className="mb-5">
                            <p className="text-sm font-bold text-slate-300 mb-3">Paradas Programadas:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {rota.paradas.map(parada => (
                                <div key={parada.id} className={`bg-slate-900/60 rounded-lg p-3 border ${parada.concluida ? 'border-emerald-500/30' : 'border-slate-700'}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${parada.concluida ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                      <span className="text-sm font-medium text-white">{parada.tipo.toUpperCase()}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{parada.tempoEstimado} min</span>
                                  </div>
                                  <p className="text-sm text-slate-300 mb-2">{parada.endereco}</p>
                                  <p className="text-xs text-slate-500">{parada.notas}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {rota.status === 'planejada' && (
                              <button
                                onClick={() => handleIniciarRota(rota.id)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium"
                              >
                                Iniciar Rota
                              </button>
                            )}
                            <button
                            onClick={() => alert('Funcionalidade "Ver Detalhes" ainda não disponível')}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
                          >
                              Ver Detalhes
                            </button>
                            <button
                              onClick={() => alert('Exportação indisponível no momento')}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium"
                            >
                              Exportar Rota
                            </button>
                            {rota.status === 'em_andamento' && (
                              <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg font-medium">
                                Acompanhar ao Vivo
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {abaAtiva === 'geofencing' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Gestão de Zonas</h3>
                      <p className="text-sm text-slate-400">Configure áreas de monitoramento e restrição</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">
                      Nova Zona
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geofences.map(geofence => (
                      <div key={geofence.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getGeofenceColor(geofence.tipo)}`}>
                              <span className="text-xs font-bold text-white">{getGeofenceTipoLabel(geofence.tipo).slice(0, 3)}</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-white">{geofence.nome}</h5>
                              <p className="text-xs text-slate-400">{getGeofenceTipoLabel(geofence.tipo)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{geofence.raio}m</p>
                            <p className="text-xs text-slate-400">raio</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Localização</p>
                            <p className="text-sm text-slate-300">
                              {geofence.centro?.lat != null ? geofence.centro.lat.toFixed(6) : 'N/A'}, {geofence.centro?.lng != null ? geofence.centro.lng.toFixed(6) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Horário Ativo</p>
                            <p className="text-sm text-slate-300">
                              {geofence.horarios.inicio} - {geofence.horarios.fim}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Alertas Recentes</p>
                            {geofence.alertas.length > 0 ? (
                              <div className="space-y-1">
                                {geofence.alertas.slice(0, 2).map(alerta => (
                                  <div key={alerta.id} className="text-xs bg-slate-900/50 rounded p-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-300">{alerta.veiculo}</span>
                                      <span className="text-slate-500">{new Date(alerta.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-400 mt-1">{alerta.mensagem}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500">Nenhum alerta registado</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm">Editar</button>
                          <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">Monitorar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {abaAtiva === 'historico' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Histórico de Rastreamento GPS</h3>
                      <p className="text-sm text-slate-400">Visualize e gerencie o histórico de rotas de transportes</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
                      >
                        <Trash2 size={16} /> Apagar Tudo
                      </button>
                    </div>
                  </div>

                  {/* Modal de Confirmação */}
                  {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm">
                        <p className="text-white font-bold mb-4">Confirmar Eliminação</p>
                        <p className="text-slate-300 mb-6">Tem certeza que deseja eliminar todo o rastreamento GPS? Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleClearAllTracking}
                            disabled={isDeleteLoading}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                          >
                            {isDeleteLoading ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mapa de Rotas */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 overflow-hidden" style={{ height: '400px' }}>
                    {trackingRoutes.length > 0 ? (
                      <TrackingMap
                        routes={trackingRoutes.map(r => ({
                          id: r.id,
                          name: r.name || r.origin + ' → ' + r.destination,
                          locations: r.locations || [],
                          status: r.status || 'pending'
                        }))}
                        selectedRouteId={selectedTrackingRoute}
                        onRouteSelect={setSelectedTrackingRoute}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-slate-400">Nenhuma rota de rastreamento disponível</p>
                      </div>
                    )}
                  </div>

                  {/* Simulador de Rota */}
                  {selectedTrackingRoute && trackingRoutes.find(r => r.id === selectedTrackingRoute) && (
                    <RouteSimulator
                      route={trackingRoutes.find(r => r.id === selectedTrackingRoute)}
                      onSimulationUpdate={(progress, location) => {
                        console.log('Simulação em progresso:', progress, location);
                      }}
                    />
                  )}

                  {/* Lista de Rotas */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-sm">Rotas Rastreadas ({trackingRoutes.length})</h4>
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                      {trackingRoutes.map(rota => (
                        <div
                          key={rota.id}
                          onClick={() => setSelectedTrackingRoute(rota.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedTrackingRoute === rota.id
                              ? 'bg-blue-600/20 border-blue-500'
                              : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-400" />
                                <p className="font-medium text-white">{rota.origin} → {rota.destination}</p>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">ID: {rota.id}</p>
                              <div className="flex gap-4 mt-2">
                                <span className="text-xs text-slate-400">
                                  <strong>Pontos:</strong> {rota.locations?.length || 0}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  rota.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                  rota.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {rota.status}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoute(rota.id);
                              }}
                              className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registo de Eventos */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700">
                    <div className="p-4 border-b border-slate-700">
                      <h4 className="text-lg font-bold text-white">Registo de Eventos</h4>
                      <p className="text-sm text-slate-400">Histórico completo de atividades</p>
                    </div>
                    <div className="p-4 border-b border-slate-700">
                      <div className="grid grid-cols-12 text-xs font-bold text-slate-400">
                        <div className="col-span-1">Tipo</div>
                        <div className="col-span-3">Veículo</div>
                        <div className="col-span-4">Descrição</div>
                        <div className="col-span-2">Horário</div>
                        <div className="col-span-2">Duração</div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                      {eventos.map(evento => (
                        <div key={evento.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                          <div className="grid grid-cols-12 items-center">
                            <div className="col-span-1">
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${getEventoColor(evento.tipo)}`}>
                                <span className="text-xs font-bold text-white">{getEventoLabel(evento.tipo)}</span>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <p className="font-medium text-white">{evento.veiculo}</p>
                            </div>
                            <div className="col-span-4">
                              <p className="text-slate-300">{evento.descricao}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-slate-400">
                                {new Date(evento.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-slate-400">
                                {evento.duracao ? `${evento.duracao} min` : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {abaAtiva === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Análise de Desempenho</h3>
                    <p className="text-sm text-slate-400">Métricas avançadas e insights preditivos</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <h4 className="text-lg font-bold text-white mb-4">Eficiência por Veículo</h4>
                      <div className="space-y-4">
                        {veiculos.map(veiculo => (
                          <div key={veiculo.id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-300">{veiculo.placa}</span>
                              <span className="text-sm font-bold text-white">
                                {((veiculo.odometro / veiculo.combustivel) * 10).toFixed(2)} km/L
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                style={{ width: `${Math.min(100, (veiculo.odometro / 200000) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <h4 className="text-lg font-bold text-white mb-4">Distribuição de Alertas</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Velocidade', pct: 45, color: 'bg-red-500' },
                          { label: 'Zonas', pct: 30, color: 'bg-amber-500' },
                          { label: 'Manutenção', pct: 15, color: 'bg-blue-500' },
                          { label: 'Outros', pct: 10, color: 'bg-purple-500' },
                        ].map(({ label, pct, color }) => (
                          <div key={label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-300">{label}</span>
                              <span className="text-sm font-bold text-white">{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h4 className="text-lg font-bold text-white mb-4">Previsões e Insights</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-400">MAN</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">Manutenção Preditiva</p>
                            <p className="text-sm text-slate-400">Veículo DD-33-33 requer manutenção em 7 dias</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm">
                          Agendar
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-400">OTI</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">Otimização de Rotas</p>
                            <p className="text-sm text-slate-400">Potencial de economia adicional: 12%</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                          Otimizar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>{/* fecha p-4 md:p-6 */}
          </div>{/* fecha tabs container */}
        </div>{/* fecha space-y-6 Conteúdo Principal */}
      </div>{/* fecha max-w-7xl stats+content wrapper */}
    </div>/* fecha wrapper principal */
  );
};

export default LiveTrackingRouteOptimization;