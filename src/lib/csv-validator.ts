const RARITIES = ['C', 'U', 'R', 'RR', 'SR', 'SAR', 'SSAR', 'AR', 'IR', 'UR', 'PR'];
const SUPERTYPES = ['Pokémon', 'Pokemon', 'Trainer', 'Energy'];
const ELEMENTS = ['Fire', 'Grass', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Colorless', 'Fairy'];
const CARD_NUMBER_REGEX = /^\d{1,4}\/\d{1,4}[a-z]?$/;
const IMAGE_URL_REGEX = /^https:\/\/.+/;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CARD_ROWS = 500;
const MAX_SET_ROWS = 50;

/**
 * Hard limit check before processing
 */
export function checkHardLimits(
  rowCount: number,
  fileSizeBytes: number,
  mode: 'cards' | 'sets'
): string | null {
  if (fileSizeBytes > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit.';
  }
  
  if (mode === 'cards' && rowCount > MAX_CARD_ROWS) {
    return `Card ingestion limited to ${MAX_CARD_ROWS} rows per upload.`;
  }
  
  if (mode === 'sets' && rowCount > MAX_SET_ROWS) {
    return `Set ingestion limited to ${MAX_SET_ROWS} rows per upload.`;
  }

  return null;
}

/**
 * Validate one cards.csv row
 */
export function validateCardRow(
  row: Record<string, string>,
  rowIndex: number
): string[] {
  const errors: string[] = [];

  // Required fields
  if (!row.set_code || row.set_code.trim() === '') {
    errors.push(`Row ${rowIndex}: set_code is required.`);
  } else if (!/^[A-Za-z0-9]{1,10}$/.test(row.set_code.trim())) {
    errors.push(`Row ${rowIndex}: set_code must be alphanumeric (max 10 chars).`);
  }

  if (!row.card_number || row.card_number.trim() === '') {
    errors.push(`Row ${rowIndex}: card_number is required.`);
  } else if (!CARD_NUMBER_REGEX.test(row.card_number)) {
    errors.push(`Row ${rowIndex}: card_number format invalid (expected e.g. 123/456).`);
  }

  if (!row.card_name || row.card_name.trim() === '') {
    errors.push(`Row ${rowIndex}: card_name is required.`);
  }

  // Optional enums
  if (row.rarity && !RARITIES.includes(row.rarity)) {
    errors.push(`Row ${rowIndex}: Invalid rarity '${row.rarity}'.`);
  }

  if (row.supertype && !SUPERTYPES.includes(row.supertype)) {
    errors.push(`Row ${rowIndex}: Invalid supertype '${row.supertype}'.`);
  }

  if (row.element && !ELEMENTS.includes(row.element)) {
    errors.push(`Row ${rowIndex}: Invalid element '${row.element}'.`);
  }

  if (row.image_url && !IMAGE_URL_REGEX.test(row.image_url)) {
    errors.push(`Row ${rowIndex}: image_url must be a valid https link.`);
  }

  return errors;
}

/**
 * Validate one sets.csv row
 */
export function validateSetRow(
  row: Record<string, string>,
  rowIndex: number
): string[] {
  const errors: string[] = [];

  if (!row.code || row.code.trim() === '') {
    errors.push(`Row ${rowIndex}: code is required.`);
  } else if (!/^[A-Za-z0-9]{1,10}$/.test(row.code.trim())) {
    errors.push(`Row ${rowIndex}: code must be alphanumeric (max 10 chars).`);
  }

  if (!row.name || row.name.trim() === '') {
    errors.push(`Row ${rowIndex}: name is required.`);
  }

  if (row.release_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.release_date)) {
    errors.push(`Row ${rowIndex}: release_date must be YYYY-MM-DD.`);
  }

  if (row.total_cards && isNaN(parseInt(row.total_cards))) {
    errors.push(`Row ${rowIndex}: total_cards must be an integer.`);
  }

  return errors;
}
