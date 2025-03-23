import { CacheEntry } from "@/types";

class CacheManager {
    private cache = new Map<string, CacheEntry<any>>();

    get<T>(key: string): CacheEntry<T> | null {
        return this.cache.get(key) || null;
    }

    set<T>(key: string, data: T, lastModified: string): void {
        this.cache.set(key, { data, lastModified });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }
}

export const cache = new CacheManager();