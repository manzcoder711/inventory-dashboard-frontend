import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerWake } from './shared/server-wake/server-wake';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, ServerWake, Toast],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
