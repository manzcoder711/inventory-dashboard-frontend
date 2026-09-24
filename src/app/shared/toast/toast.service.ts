import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, durationMs = 3000): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, text }]);

    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, durationMs);
  }
}
