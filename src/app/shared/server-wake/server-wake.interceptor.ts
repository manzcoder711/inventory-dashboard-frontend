import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { defer, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SLOW_REQUEST_MS, ServerWakeService } from './server-wake.service';

export const serverWakeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const serverWake = inject(ServerWakeService);

  // defer: the timer starts when the request is actually sent, once per subscription.
  return defer(() => {
    let slow = false;
    const timer = setTimeout(() => {
      slow = true;
      serverWake.requestBecameSlow();
    }, SLOW_REQUEST_MS);

    // finalize runs on success, error and cancellation alike, so the message can't get stuck.
    return next(req).pipe(
      finalize(() => {
        clearTimeout(timer);
        if (slow) {
          serverWake.slowRequestFinished();
        }
      }),
    );
  });
};
