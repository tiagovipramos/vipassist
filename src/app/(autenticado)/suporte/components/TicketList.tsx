'use client';

import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { ticketsSuporte } from '@/lib/mocks/suporte';

interface TicketListProps {
  onSelectTicket: (id: string) => void;
  onNewTicket: () => void;
}

export function TicketList({ onSelectTicket, onNewTicket }: TicketListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">🎫 MEUS TICKETS DE SUPORTE</h2>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onNewTicket}
        >
          + ABRIR TICKET
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm">▼ Todos</Button>
          <Button variant="outline" className="text-sm">🟢 Abertos</Button>
          <Button variant="outline" className="text-sm">⏳ Em andamento</Button>
          <Button variant="outline" className="text-sm">✅ Resolvidos</Button>
        </div>
      </Card>

      {/* Lista de Tickets */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ticketsSuporte.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {ticket.status === 'aberto' && <span className="text-green-600">🟢</span>}
                    {ticket.status === 'em_andamento' && <span className="text-yellow-600">⏳</span>}
                    {ticket.status === 'resolvido' && <span className="text-gray-600">✅</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{ticket.numero}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.assunto}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {ticket.status === 'aberto' && 'Aguardando resposta'}
                        {ticket.status === 'em_andamento' && 'Time analisando'}
                        {ticket.status === 'resolvido' && 'Resolvido'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.prioridade === 'alta' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                        🔴 Alta
                      </span>
                    )}
                    {ticket.prioridade === 'media' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                        🟡 Média
                      </span>
                    )}
                    {ticket.prioridade === 'baixa' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                        🟢 Baixa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.criado}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTicket(ticket.id)}
                    >
                      VER
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
