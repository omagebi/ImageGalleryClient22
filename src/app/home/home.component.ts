/* eslint-disable max-len */

export interface IImageList {
  imageUrl: string;
  caption: string;
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app.config';
import { Router } from '@angular/router';
// import { AuthService } from '../core/auth.service';
import { PhotoComponent } from '../Gallery/photo/photo.component';
import { PhotoListComponent } from '../Gallery/photo-list/photo-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PhotoService } from '../Gallery/photo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[PhotoComponent,PhotoListComponent, HttpClientModule,CommonModule],
  providers: [PhotoService], // Ensure that all required services are provided
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home.component.scss'],
})
export class HomeComponent implements OnInit{
  title = 'Dashboard';
  coyID = environment.coyID;
  isAuthenticated  ?: Observable<boolean>;
  isDoneLoading?: Observable<boolean>;
  canActivateProtectedRoutes?: Observable<boolean>;

  rowIndexArray: any[] = [];
  imageList: IImageList[] = [];

  constructor(
    // private authService: AuthService,
    private http: HttpClient,
        private router: Router) {
    // this.isAuthenticated = this.authService.isAuthenticated$;
    // this.isDoneLoading = this.authService.isDoneLoading$;
    // this.canActivateProtectedRoutes =      this.authService.canActivateProtectedRoutes$;

    // this.authService.runInitialLoginSequence();
  }
  ngOnInit(): void {
    this.imageList = [
    { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/slider11.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    ];
    this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());

    // this.service.imageDetailList.snapshotChanges().subscribe((list: any) => {
    //   this.imageList = list.map((item: any) => {
    //     return item.payload.val();
    //   });
    //   this.rowIndexArray = Array.from(
    //     Array(Math.ceil((this.imageList.length + 1) / 3)).keys()
    //   );
    // });

  }


}





