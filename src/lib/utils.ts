import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarData(data: string | Date): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dataObj);
}

export function formatarDataHora(data: string | Date): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
}

export function formatarHora(data: string | Date): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatarTelefone(telefone: string): string {
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  if (numeroLimpo.length === 11) {
    return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeroLimpo.length === 10) {
    return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}

export function tempoRelativo(data: string | Date): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  const agora = new Date();
  const diff = agora.getTime() - dataObj.getTime();
  
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (segundos < 60) return 'Agora há pouco';
  if (minutos < 60) return `Há ${minutos} min`;
  if (horas < 24) return `Há ${horas}h`;
  if (dias < 7) return `Há ${dias}d`;
  
  return formatarData(dataObj);
}

export function gerarId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
}

export function getInitials(nome: string): string {
  const palavras = nome.split(' ');
  if (palavras.length === 1) {
    return palavras[0].substring(0, 2).toUpperCase();
  }
  return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
}

export function calcularPorcentagem(valor: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
}
