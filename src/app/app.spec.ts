import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { App } from './app';
import { AuthService } from './auth/auth.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Toasts are mounted once at the root (not per page), which is what lets
  // "Product saved" survive the redirect back to the list.
  it('mounts the router outlet and a single toast host', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelectorAll('app-toast').length).toBe(1);
  });

  it('shows Sign out only when signed in, and signing out returns to the login page', async () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    const signOutButton = () =>
      Array.from(compiled.querySelectorAll('header button')).find(
        (b) => b.textContent?.trim() === 'Sign out',
      ) as HTMLButtonElement | undefined;

    await fixture.whenStable();
    expect(signOutButton()).toBeUndefined();

    const auth = TestBed.inject(AuthService);
    auth.login('demo@example.com', 'Demo123!').subscribe();
    TestBed.inject(HttpTestingController)
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush({ token: 'test-token', expiresAt: '2099-01-01T00:00:00Z' });
    await fixture.whenStable();
    expect(signOutButton()).toBeDefined();

    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    signOutButton()!.click();
    await fixture.whenStable();

    expect(auth.isAuthenticated()).toBe(false);
    expect(signOutButton()).toBeUndefined();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
