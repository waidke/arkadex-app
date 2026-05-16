export interface ParsedCard {
  set_code: string;
  card_number: string;
  card_name: string;
  rarity: string;
  supertype: string;
  element?: string;
  image_url?: string;
}

export interface ParsedSet {
  code: string;
  name: string;
  release_date?: string;
  total_cards?: string;
}

export type DryRunStatus = 'NEW' | 'OVERWRITE' | 'ERROR';

export interface DryRunRow {
  rowIndex: number;        // 1-based
  status: DryRunStatus;
  setCode: string;
  cardNumber?: string;
  name: string;
  rarity?: string;
  errors?: string[];
}

export interface IngestionStats {
  total: number;
  newCount: number;
  overwriteCount: number;
  errorCount: number;
}
