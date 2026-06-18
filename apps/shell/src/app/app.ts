import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@rose/i18n';
@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App implements OnInit {
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.languageService.initialize();
  }
}
