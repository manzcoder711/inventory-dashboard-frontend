import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'Demo123!';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly demoEmail = DEMO_EMAIL;
  readonly demoPassword = DEMO_PASSWORD;

  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Drives both the visible message and the input's aria-invalid / aria-describedby.
  showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.attemptLogin(raw.email!, raw.password!);
  }

  loginAsDemo(): void {
    this.attemptLogin(DEMO_EMAIL, DEMO_PASSWORD);
  }

  private attemptLogin(email: string, password: string): void {
    this.submitting.set(true);
    this.error.set(null);

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(loginErrorMessage(err.status));
          this.submitting.set(false);
        },
      });
  }
}

function loginErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Invalid email or password.';
    case 429:
      return 'Too many sign-in attempts. Please wait a minute and try again.';
    default:
      return "Couldn't reach the server. Please try again in a moment.";
  }
}
