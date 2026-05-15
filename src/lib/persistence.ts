/**
 * Persistence Manager for ArkaDex
 * Handles encrypted local storage for anonymous users.
 * Uses Web Crypto API for AES-GCM encryption.
 */

const STORAGE_KEY = 'ark_collection';
const ENTROPY_KEY = 'ark_e';

export interface LocalCollectionItem {
  cardId: string;
  quantity: number;
  addedAt: string;
}

export interface LocalCollection {
  version: string;
  items: LocalCollectionItem[];
}

class PersistenceManager {
  private key: CryptoKey | null = null;

  private async getEncryptionKey(): Promise<CryptoKey> {
    if (this.key) return this.key;

    let entropy = localStorage.getItem(ENTROPY_KEY);
    if (!entropy) {
      entropy = crypto.randomUUID();
      localStorage.setItem(ENTROPY_KEY, entropy);
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(entropy),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('arkadex-salt-2026'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return this.key;
  }

  async saveCollection(items: LocalCollectionItem[]): Promise<void> {
    const collection: LocalCollection = {
      version: '1.0',
      items
    };

    const key = await this.getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(collection));
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combine IV and Encrypted Data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    const base64 = btoa(String.fromCharCode(...combined));
    localStorage.setItem(STORAGE_KEY, base64);
  }

  async loadCollection(): Promise<LocalCollectionItem[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      const key = await this.getEncryptionKey();
      const combined = new Uint8Array(
        atob(stored).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      const collection: LocalCollection = JSON.parse(decoder.decode(decrypted));
      return collection.items;
    } catch (error) {
      console.error('Failed to decrypt local collection:', error);
      return [];
    }
  }

  async toggleCard(cardId: string): Promise<LocalCollectionItem[]> {
    const items = await this.loadCollection();
    const index = items.findIndex(i => i.cardId === cardId);

    if (index >= 0) {
      items.splice(index, 1);
    } else {
      items.push({
        cardId,
        quantity: 1,
        addedAt: new Uint8Array(new Date().toISOString().split('').map(c => c.charCodeAt(0))).toString() // Simulating secure date? No, just string
      });
      // Corrected:
      items[items.length - 1].addedAt = new Date().toISOString();
    }

    await this.saveCollection(items);
    return items;
  }

  async clearCollection(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    // Keep ENTROPY_KEY for future use if needed, or clear it if rotating keys.
    // For now, just clearing the data is enough to trigger sync completion.
  }
}

export const persistenceManager = new PersistenceManager();
