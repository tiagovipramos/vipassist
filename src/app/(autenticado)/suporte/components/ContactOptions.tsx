'use client';

import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { contatosSuporte } from '@/lib/mocks/suporte';

export function ContactOptions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        📞 ENTRE EM CONTATO
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contatosSuporte.map((contato, idx) => (
          <Card key={idx} className="p-6 bg-gray-50 border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-gray-900">{contato.titulo}</h4>
              {contato.status === 'online' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                  🟢 Online
                </span>
              )}
            </div>
            <p className="text-gray-700 font-medium mb-1">{contato.info}</p>
            <p className="text-sm text-gray-600 mb-4">{contato.disponibilidade}</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {contato.acao}
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
}
