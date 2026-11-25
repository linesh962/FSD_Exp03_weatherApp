import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly storageKey = 'weatherwise.recent-cities';
  private readonly maxItems = 5;

  readonly recent = signal<string[]>(this.load());

  add(city: string): void {
    const next = [city, ...this.recent().filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(
      0,
      this.maxItems,
    );
    this.recent.set(next);
    this.save(next);
  }

  clear(): void {
    this.recent.set([]);
    this.save([]);
  }

  private load(): string[] {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string').slice(0, this.maxItems)
        : [];
    } catch {
      return [];
    }
  }

  private save(list: string[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {
      /* Storage unavailable (private mode or quota). Recent searches just won't persist. */
    }
  }
}
