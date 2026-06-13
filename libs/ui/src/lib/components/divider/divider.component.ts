import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-divider',
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
})
export class DividerComponent {
   @Input() color:string='#E4E4E7';

}
