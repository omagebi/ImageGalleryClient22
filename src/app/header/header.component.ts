import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
    this.appService.loadDefaults();
    // this.appService.screenDisplay = this.appService.get('screenDisplay');
    // this.appService.appName = this.appService.get('appName');
    // this.appService.clientName = this.appService.get('clientName');
    // this.appService.clientLogo = this.appService.get('clientLogo');

  }

}
