import { Component, Input, OnInit } from '@angular/core';
import { IFullName, PhotoService } from '../photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@UntilDestroy()
@Component({
    selector: 'app-photo-list',
    templateUrl: './photo-list.component.html',
    styleUrls: ['./photo-list.component.css'],
    standalone: true,
    imports: [NgbTypeaheadModule,NgIf, NgFor, HttpClientModule],
    providers: [PhotoService]

})
export class PhotoListComponent implements OnInit {
  rowIndexArray: any[] = [];
  imageList: any[] = [];
  imageUrls: IFullName[] = [];
  imageUrls$: Observable<IFullName[]>= of([]); // Initialize with an empty array
  id = ''  //'001/000000013';

  constructor(public service: PhotoService) { }

  selectedItem(fullName: string) {
     // Check if fullName is ''
      if (fullName == '' || fullName == undefined) {
        alert('invalid fullname');
        return;
      }

      const idStart = fullName?.indexOf("[");
      const namePart = fullName?.substring(0, idStart).trim();

      // Check if idStart is 0
      if (!idStart) {
        alert('invalid fullname');
        return;
      }

      // Check if idStart is null or undefined
      if (idStart === null || idStart === undefined) {
        alert('Invalid full name');
        return;
      }

      const idPart = idStart !== -1 ? fullName?.substring(idStart! + 1, fullName.length - 1).trim() : null;
      const idPart2 = fullName?.indexOf("[") !== -1 ? fullName?.substring(fullName?.indexOf("[")! + 1, fullName.length - 1).trim() : null;

    // this.id = idPart!;
    this.getImageurls(idPart!);

  }

  getImageurls(idX: string) {
    if (idX == '' || idX == undefined) {
      return;
    }
    idX=idX.replace('-','/')
    this.service.getLinksByID(idX).subscribe(
      (data) => {
        this.imageUrls = data;
      },
      (error) => {
        console.error('Error fetching photos', error);
      }
    );

  }

  ngOnInit() {
    if (this.id == '' || this.id == undefined) {
      return;
    }
    this.getImageurls(this.id);

    // this.imageList = [
    // { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/GoodSmile22.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/slider11.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/facility.jpg', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // { imageUrl: '/assets/img/NgModule.png', caption: 'Patient' },
    // ];
    // this.rowIndexArray = Array.from(Array(Math.ceil((this.imageList.length + 1) / 3)).keys());

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
