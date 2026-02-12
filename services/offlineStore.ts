
export interface PendingDetection {
  id: string;
  image: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
}

const DB_NAME = 'agri_detect_offline';
const STORE_NAME = 'pending_syncs';

export const offlineStore = {
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async addPending(detection: PendingDetection) {
    const db: any = await this.init();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(detection);
    return tx.complete;
  },

  async getAllPending(): Promise<PendingDetection[]> {
    const db: any = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async removePending(id: string) {
    const db: any = await this.init();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    return tx.complete;
  },

  async clearAll() {
    const db: any = await this.init();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    return tx.complete;
  }
};
