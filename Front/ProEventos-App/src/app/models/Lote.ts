import { Evento } from "./Evento";

export interface Lote {
  id: number;
  nome: string;
  preco: number;
  dataInicio?: Date | null;
  dataFim?: Date | null;
  quantidade: number;
  eventoId: number;
  evento: Evento;
}
