import type { Config } from 'chessgroundx';
import type { Piece } from 'chessgroundx/types';
import { writable } from "svelte/store";
import type { AuthUser } from './auth';

const chessStore = writable<ChessStore>({
  color: '',
  capturedPieces: [],
  fen: '',
  opponent: null,
})

export function updateChessStore(data: ChessStore) {
  chessStore.set(data);
}

export interface ChessStore {
  color?: '' | 'white' | 'black';
  capturedPieces?: Piece[];
  fen?: Config['fen'];
  me?: AuthUser,
  opponent?: string | null
}

export const chessStoreSub = chessStore.subscribe;