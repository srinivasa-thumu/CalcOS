import type {
  CalculationHistoryRecord,
  HistoryRepository,
} from '@calcos/domain-types';

const DATABASE_NAME = 'calcos';
const DATABASE_VERSION = 1;
const STORE_NAME = 'calculation-history';

export class IndexedDbHistoryRepository implements HistoryRepository {
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: 'id',
          });
        }
      };
    });
  }

  async save(record: CalculationHistoryRecord): Promise<void> {
    const database = await this.openDatabase();

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(
          STORE_NAME,
          'readwrite',
        );

        const request = transaction.objectStore(STORE_NAME).put(record);

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(transaction.error);
        };
      });
    } finally {
      database.close();
    }
  }

  async getAll(): Promise<CalculationHistoryRecord[]> {
    const database = await this.openDatabase();

    try {
      return await new Promise<CalculationHistoryRecord[]>(
        (resolve, reject) => {
          const transaction = database.transaction(
            STORE_NAME,
            'readonly',
          );

          const request = transaction.objectStore(STORE_NAME).getAll();

          request.onsuccess = () => {
            resolve(request.result);
          };

          request.onerror = () => {
            reject(request.error);
          };
        },
      );
    } finally {
      database.close();
    }
  }

  async getById(
    id: string,
  ): Promise<CalculationHistoryRecord | null> {
    const database = await this.openDatabase();

    try {
      return await new Promise<CalculationHistoryRecord | null>(
        (resolve, reject) => {
          const transaction = database.transaction(
            STORE_NAME,
            'readonly',
          );

          const request = transaction.objectStore(STORE_NAME).get(id);

          request.onsuccess = () => {
            resolve(request.result ?? null);
          };

          request.onerror = () => {
            reject(request.error);
          };
        },
      );
    } finally {
      database.close();
    }
  }

  async delete(id: string): Promise<void> {
    const database = await this.openDatabase();

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(
          STORE_NAME,
          'readwrite',
        );

        transaction.objectStore(STORE_NAME).delete(id);

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(transaction.error);
        };
      });
    } finally {
      database.close();
    }
  }

  async clear(): Promise<void> {
    const database = await this.openDatabase();

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(
          STORE_NAME,
          'readwrite',
        );

        transaction.objectStore(STORE_NAME).clear();

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(transaction.error);
        };
      });
    } finally {
      database.close();
    }
  }
}