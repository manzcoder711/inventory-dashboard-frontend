import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ServerWake } from './shared/server-wake/server-wake';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, ServerWake, Toast],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected auth = inject(AuthService);
  private router = inject(Router);

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
