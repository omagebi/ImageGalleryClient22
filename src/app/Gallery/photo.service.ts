import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../app.config';
import {Observable, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';


export interface IFullName {
  FullName: string;
  PNo: string;
  ImageURL: string;
}

export interface IResult{
  results: IFullName[];
  totalCount: number;
  currentPage: number;
  pageSize: number
}


@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private router: Router, private http: HttpClient) {}

  imageDetailList: any;
  firebase: any;

  appURL = environment.appURL; //'https://localhost:7293/api/imagegallery' //
  baseUrl = `${environment.appURL}/uploads`;

    getLinksByID(id: string,page: number=1,pageSize: number=10): Observable<IFullName[]> {
      id = encodeURIComponent(id);
      const url = `https://localhost:7293/api/imagegallery/${id}/list?page=${page}&pageSize=${pageSize}`;
      return this.http.get<IResult>(url).pipe(
        tap(res => console.log(res)),
        map(resp => resp.results)
    );
  }

  search = (text$: Observable<string>):Observable<string[]> =>
    text$.pipe(
      debounceTime(500), // debounce time to wait after each keystroke
      distinctUntilChanged(), // only emit if the value has changed
      tap(term => console.log('Searching for:', term)), // Log search terms for debugging      // switchMap(term => this.getSearchResults(term)) // switch to a new observable for each term
      switchMap(term =>
        term.length > 2
          ? this.getSearchResults(term).pipe(
              map(results => results.slice(0, 10))
            )
          : of([]) // Emit an empty array if term is less than 3 characters
      )
    );

  getSearchResults(term: string): Observable<string[]> {
      // Implement your logic to fetch and return search results based on the input term
      return this?.http.get<IResult>(`https://localhost:7293/api/imagegallery/search?name=${term}`).pipe(
      map(resp => resp.results.map(result => result.FullName + ' [' +  result.PNo.replace('/','-') + ']' ))
    );
  }

    getSearchResults2(term: string): Observable<string[]> {
      // Implement your logic to fetch and return search results based on the input term
      // This could be an HTTP request or any other asynchronous operation
      //const results: string[] =['femi','omage','babafemi'];
      return this?.http.get<IFullName[]>(`https://localhost:7293/api/imagegallery/search?name=${term}`).pipe(
      map(results => results.map(result => result.FullName + ' [' +  result.PNo.replace('/','-') + ']' ))
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

  //   search3(text$: Observable<string>): Observable<string[]> {
  //   return text$.pipe(
  //     debounceTime(300), // optional: debounce time to wait for user to stop typing
  //     distinctUntilChanged(), // optional: only emit if the value has changed
  //     switchMap((searchText: string) => {
  //       if (!searchText || searchText.trim() === '') {
  //         // If searchText is empty, return an observable with an empty array
  //         return of(['']);
  //       } else {
  //         // Your actual search logic here
  //         // For example, make an HTTP request to a search API
  //         // Replace the following line with your actual search logic
  //         return this?.http.get<string[]>(`https://localhost:7293/api/imagegallery/search?name=${searchText}`).pipe(
  //           catchError(() => of([])) // Handle errors gracefully
  //         );
  //       }
  //     })
  //   );
  // }

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
