'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook para enviar heartbeat periódico ao servidor
 * Mantém o status do usuário como "online" enquanto estiver ativo
 */
export function useHeartbeat(usuarioId: string | null) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!usuarioId) return;

    // Função para enviar heartbeat
    const enviarHeartbeat = async () => {
      try {
        await fetch('/api/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuarioId }),
        });
      } catch (error) {
        console.error('Erro ao enviar heartbeat:', error);
      }
    };

    // Enviar heartbeat imediatamente ao montar
    enviarHeartbeat();

    // Configurar intervalo para enviar heartbeat a cada 60 segundos
    intervalRef.current = setInterval(enviarHeartbeat, 60 * 1000);

    // Cleanup ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [usuarioId]);

  // Enviar heartbeat quando a página for fechada/recarregada
  useEffect(() => {
    if (!usuarioId) return;

    const handleBeforeUnload = () => {
      // Usar sendBeacon para garantir que a requisição seja enviada mesmo ao fechar
      navigator.sendBeacon(
        '/api/heartbeat',
        JSON.stringify({ usuarioId })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [usuarioId]);
}
