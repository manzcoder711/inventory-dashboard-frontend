import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ServerWake } from './server-wake';
import { serverWakeInterceptor } from './server-wake.interceptor';
import { SLOW_REQUEST_MS } from './server-wake.service';

const url = `${environment.apiUrl}/products`;

describe('ServerWake', () => {
  let fixture: ComponentFixture<ServerWake>;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ServerWake],
      providers: [
        provideHttpClient(withInterceptors([serverWakeInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(ServerWake);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  // Rendered text of the live region, after letting any pending timers fire.
  function statusText(advanceMs: number): string {
    vi.advanceTimersByTime(advanceMs);
    fixture.detectChanges();
    const status = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
    return status?.textContent?.trim() ?? '';
  }

  it('stays hidden for API calls that answer within 3 seconds', () => {
    http.get(url).subscribe();

    expect(statusText(SLOW_REQUEST_MS - 1)).toBe('');
    httpMock.expectOne(url).flush([]);
    expect(statusText(SLOW_REQUEST_MS)).toBe('');
  });

  it('appears after 3 seconds and disappears when the call succeeds', () => {
    http.get(url).subscribe();

    expect(statusText(SLOW_REQUEST_MS)).toContain('Waking up the free-tier server');
    httpMock.expectOne(url).flush([]);
    expect(statusText(0)).toBe('');
  });

  it('disappears when a slow call fails', () => {
    http.get(url).subscribe({ error: () => undefined });

    expect(statusText(SLOW_REQUEST_MS)).toContain('Waking up the free-tier server');
    httpMock.expectOne(url).flush(null, { status: 500, statusText: 'Server Error' });
    expect(statusText(0)).toBe('');
  });
});
