import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-welcome-message',
  imports: [],
  templateUrl: './welcome-message.component.html',
  styleUrl: './welcome-message.component.scss',
})
export class WelcomeMessageComponent {
    @Input() title = 'Welcome back!';

}
