import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {}
