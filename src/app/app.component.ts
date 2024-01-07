import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { config } from './app.config.server';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent,
    HttpClientModule,MatToolbarModule],
  providers: [AppService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./app.component.scss']
})
export class AppComponent {
  title = 'ImageGalleryClient2';
  constructor(public appService: AppService) { }

  ngOnInit(): void {
    // this.appService.loadDefaults();
    // this.appService.clientLogo = this.appService.get('clientLogo');
  }
}
