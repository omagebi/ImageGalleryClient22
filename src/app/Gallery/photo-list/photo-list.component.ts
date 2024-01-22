import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IFullName, PhotoService } from '../photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
    selector: 'app-photo-list',
    templateUrl: './photo-list.component.html',
    styleUrls: ['./photo-list.component.css'],
    standalone: true,
    imports: [NgbTypeaheadModule,NgIf, NgFor, HttpClientModule],
    providers: [PhotoService]

})
export class PhotoListComponent implements OnInit, OnDestroy {

  imageUrls: IFullName[] = [];
  imageUrls2: any[] = [];
  imageUrls$: Observable<IFullName[]>= of([]); // Initialize with an empty array
  subscr?: Subscription

  constructor(public service: PhotoService,
    private router: ActivatedRoute) { }


  ngOnDestroy(): void {
    this.subscr?.unsubscribe();
  }

  ngOnInit() {
    this.subscr = this.router.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id === '' || id === undefined || id === null || id === '00') {
        return;
      }
      this.getImageurls(id);
    });
  }

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
    idX = idX.replace('-', '/')
    try {
      this.service.getLinksByID(idX).subscribe(
        (data) => {
          this.imageUrls = data;
        },
        (error) => {
          console.error('Error fetching photos', error);
        }
      );
    } catch (error) {
      console.error('Error fetching records', error);
    }
  }


}
