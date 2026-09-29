import { Component, inject } from '@angular/core';
import { ServerWakeService } from './server-wake.service';

@Component({
  selector: 'app-server-wake',
  styleUrl: './server-wake.scss',
  templateUrl: './server-wake.html',
})
export class ServerWake {
  protected serverWake = inject(ServerWakeService);
}
