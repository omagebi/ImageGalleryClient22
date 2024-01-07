import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@UntilDestroy()
@Component({
    selector: 'app-photo-list',
    templateUrl: './photo-list.component.html',
    styleUrls: ['./photo-list.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, HttpClientModule],
    providers: [PhotoService]

})
export class PhotoListComponent implements OnInit {
  rowIndexArray: any[] = [];
  imageList: Gallery[] = [];


  constructor(private service: PhotoService) {}

  ngOnInit() {
  this.imageList = [
    { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/slider11.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
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

export interface Gallery {
    caption: string;
    imageUrl: string;
}
