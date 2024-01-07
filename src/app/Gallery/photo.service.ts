import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../app.config';
import {Observable, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private router: Router, private http: HttpClient) {}

  imageDetailList: any;
  firebase: any;

  appURL = 'https://localhost:7293/api/imagegallery' //environment.appURL;
  // baseUrl = `${environment.appURL}/Upload2`;

   search2(text$: Observable<string>): Observable<string[]> {
     return text$.pipe(
       debounceTime(500),
       distinctUntilChanged(),
       switchMap(searchTerm => {
         if (!searchTerm) {
           return of([]); //as string[]); // return an empty array if searchTerm is falsy
         }
      const appSearch = `https://localhost:7293/api/imagegallery/search?name=${searchTerm}`; // adjust the query parameter as needed
      // return of(['result1', 'result2']); // Replace this with your actual HTTP call
         return this.http.get<string[]>(appSearch);
        //  return this.getNames(appSearch);
       })
     );

   }

    getNames(txt: string) :Observable<string[]>{
    return this.http.get<string[]>(txt);
  }



  getImageDetailList() {
    return this.http.get<Photo[]>(this.appURL);
  }

  insertImageDetails(formData: FormData) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' //'multipart/form-data'
      })
    }

    return this.http.post<any>(this.appURL + '/upload',
      formData,
      // {
      //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      //   reportProgress: true,
      //    observe: 'events',
      //   responseType: 'json',
      // }
    );

  //  const requestUrl = environment.apiUrl + 'parking' ;
  //   const headerOptions = new HttpHeaders();
  //   headerOptions.set('Content-Type', 'application/json');
  //   return this.http.post(requestUrl, parking, { headers: headerOptions })

  }

  getImageDetailListX() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }

  insertImageDetailsX(imageDetails: any) {
    this.imageDetailList.push(imageDetails);
  }
}

export class Photo {
    FullName: string;
    Category: string;
    ImageUrl: string;
    Remarks: string;
    Photo: any

    constructor(
      fullName : string,
      category : string,
      imageUrl: string,
      remarks: string,
      photo : any ) {
      this.FullName=fullName
      this.Category=category
      this.ImageUrl = imageUrl
      this.Remarks = remarks
      this.Photo=photo

      }
}

export class Photo2 {
  constructor(
    public caption: string,
    public category: string,
    public imageUrl: string,
    public photo: any
  ) {}
}

export class Person {
  constructor(
    public name: string,
    public lastName: string,
    public age: number
  ) {}
}
//now that we have the model class we can create arrays that contain Person class elements
// public people: Person[];
// constructor(){
//  this.people = [
//    new Person ('Carla','Smith', 20 ),
//     new Person ('Carlos','Smith', 25 ),
//     new Person ('Andrea','Johnson', 23 ),

//    ];
// }
