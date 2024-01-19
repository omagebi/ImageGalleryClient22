import { Component, OnInit, inject } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Photo, PhotoService } from '../photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [NgbTypeaheadModule,
    CommonModule],
  providers: [PhotoService,HttpClient],
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css'],
})
export class PhotoComponent implements OnInit {

  imageUrl: string = '';
  name: string = 'femi';
  category: string = 'teacher';


  //angular image upload & firebase
  //https://www.youtube.com/watch?v=SZlt8VdWAIE

   constructor(
     public service: PhotoService,
     private http: HttpClient ) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


}

