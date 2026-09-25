import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
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

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 401
            ? 'Invalid email or password.'
            : "Couldn't reach the server. Please try again in a moment.",
        );
        this.submitting.set(false);
      },
    });
  }
}
