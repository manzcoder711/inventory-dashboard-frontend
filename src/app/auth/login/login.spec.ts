import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    fixture = TestBed.createComponent(Login);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it.each([
    [401, 'Invalid email or password.'],
    [429, 'Too many sign-in attempts. Please wait a minute and try again.'],
    [500, "Couldn't reach the server. Please try again in a moment."],
  ])('shows the right message when sign-in fails with %i', async (status, expected) => {
    const demoButton = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[type="button"]',
    )!;
    demoButton.click();

    httpMock
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush({ message: 'server message' }, { status, statusText: 'Error' });
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent?.trim()).toBe(expected);
  });
});
