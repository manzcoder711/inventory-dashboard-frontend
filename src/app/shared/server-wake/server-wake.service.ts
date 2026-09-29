import { computed, Injectable, signal } from '@angular/core';

// How long an API call may take before we assume the free-tier server is waking up.
export const SLOW_REQUEST_MS = 3000;

@Injectable({
  providedIn: 'root',
})
export class ServerWakeService {
  private readonly slowRequests = signal(0);
  readonly waking = computed(() => this.slowRequests() > 0);

  requestBecameSlow(): void {
    this.slowRequests.update((count) => count + 1);
  }

  slowRequestFinished(): void {
    this.slowRequests.update((count) => count - 1);
  }
}
