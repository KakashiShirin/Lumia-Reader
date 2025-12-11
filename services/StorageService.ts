import { Novel } from '../types';

const DB_NAME = 'LuminaReaderDB';
const STORE_NAME = 'local_books';
const DB_VERSION = 1;

export interface StoredBook extends Novel {
    data: ArrayBuffer;
    addedAt: number;
}

export const StorageService = {
    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    },

    async saveBook(novel: Novel, data: ArrayBuffer): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const storedBook: StoredBook = {
                ...novel,
                data,
                addedAt: Date.now()
            };

            const request = store.put(storedBook);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    },

    async getBooks(): Promise<StoredBook[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    async deleteBook(id: string): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    },

    async getBookData(id: string): Promise<ArrayBuffer | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const book = request.result as StoredBook;
                resolve(book ? book.data : undefined);
            };
        });
    }
};
