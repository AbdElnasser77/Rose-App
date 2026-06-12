import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'lib-callout-text',
  imports: [RouterLink],
  templateUrl: './callout-text.component.html',
  styleUrl: './callout-text.component.scss',
})
export class CalloutTextComponent {
  @Input() text = "Already have an account?";
  @Input() linkText = "Login";
  @Input() linkUrl = "/";
}
