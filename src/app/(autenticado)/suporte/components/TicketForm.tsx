'use client';

import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';

interface TicketFormProps {
  onClose: () => void;
}

export function TicketForm({ onClose }: TicketFormProps) {
  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">+ ABRIR TICKET DE SUPORTE</h2>
        <Button variant="outline" onClick={onClose}>
          ✕ FECHAR
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assunto: <span className="text-red-600">*</span>
          </label>
          <Input placeholder="Descreva resumidamente o problema" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria: <span className="text-red-600">*</span>
          </label>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>Selecionar</option>
            <option>Problema técnico</option>
            <option>Dúvida sobre funcionalidade</option>
            <option>Solicitação de feature</option>
            <option>Problema de faturamento</option>
            <option>Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade:</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="prioridade" />
              <span>🔴 Alta (sistema parado, problema crítico)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="prioridade" defaultChecked />
              <span>🟡 Média (problema que impacta uso, mas não urgente)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="prioridade" />
              <span>🟢 Baixa (dúvida ou sugestão)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição detalhada: <span className="text-red-600">*</span>
          </label>
          <textarea
            className="w-full border rounded-lg p-3"
            rows={6}
            placeholder="Seja o mais detalhado possível para recebermos uma resposta rápida"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📎 ANEXOS (Opcional):
          </label>
          <Button variant="outline">
            📁 SELECIONAR ARQUIVOS
          </Button>
          <p className="text-xs text-gray-500 mt-1">(Screenshots, vídeos, logs - máx 10MB)</p>
        </div>

        <div className="border-t pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">⏰ TEMPO ESTIMADO DE RESPOSTA:</p>
            <p className="text-sm text-gray-700">🎯 Seu plano: Professional</p>
            <p className="text-sm text-gray-700">📨 Resposta em até 4 horas</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            CANCELAR
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            ABRIR TICKET
          </Button>
        </div>
      </div>
    </Card>
  );
}
