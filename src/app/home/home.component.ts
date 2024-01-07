/* eslint-disable max-len */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app.config';
import { Router } from '@angular/router';
// import { AuthService } from '../core/auth.service';
import { PhotoComponent } from '../Gallery/photo/photo.component';
import { PhotoListComponent } from '../Gallery/photo-list/photo-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PhotoService } from '../Gallery/photo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[PhotoComponent,PhotoListComponent, HttpClientModule],
  providers: [PhotoService], // Ensure that all required services are provided
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home.component.scss'],
})
export class HomeComponent {
  title = 'Dashboard';
  coyID = environment.coyID;
  isAuthenticated  ?: Observable<boolean>;
  isDoneLoading?: Observable<boolean>;
  canActivateProtectedRoutes?: Observable<boolean>;

  constructor(
    // private authService: AuthService,
    private http: HttpClient,
        private router: Router) {
    // this.isAuthenticated = this.authService.isAuthenticated$;
    // this.isDoneLoading = this.authService.isDoneLoading$;
    // this.canActivateProtectedRoutes =      this.authService.canActivateProtectedRoutes$;

    // this.authService.runInitialLoginSequence();
  }
}
