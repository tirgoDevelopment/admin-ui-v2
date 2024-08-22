import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule,TranslateModule]
})

export class AppComponent implements OnInit {
  constructor( private translate: TranslateService) {  }
  ngOnInit(): void { 
    if(localStorage.getItem('lang') == null){
      localStorage.setItem('lang', 'RU')
    }
    this.translate.setDefaultLang('ru')
  }
}
