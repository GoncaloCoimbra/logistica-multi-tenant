/**
 * Extrai mensagem de erro de forma segura
 * Converte erros de qualquer tipo em string
 */
export function getErrorMessage(error: any, defaultMessage?: string): string {
  const fallback = defaultMessage || 'Erro desconhecido. Tente novamente.';
  
  // Se for string, retorna direto
  if (typeof error === 'string') {
    return error;
  }

  // Se for erro de axios response
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Tentar várias possibilidades comuns
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }
    
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    
    if (data.error?.message && typeof data.error.message === 'string') {
      return data.error.message;
    }
    
    // Se for array de erros
    if (Array.isArray(data) && data[0]?.message) {
      return data[0].message;
    }
  }

  // Se for erro padrão de JavaScript
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // Fallback
  return fallback;
}

/**
 * Log de erro para debug
 */
export function logError(context: string, error: any): void {
  console.error(` [${context}]`, error);
  if (error?.response?.data) {
    console.error('📥 Response data:', error.response.data);
  }
}
