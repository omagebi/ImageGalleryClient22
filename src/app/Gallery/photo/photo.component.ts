import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Photo, PhotoService } from '../photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface IFullName {
  FullName: string;
  PNo: string
}

export interface IResult{
  results: IFullName[];
  totalCount: number;
  currentPage: number;
  pageSize: number
}
@UntilDestroy()
@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [NgbTypeaheadModule,
    ReactiveFormsModule,
    CommonModule],
  providers: [PhotoService,HttpClient],
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css'],
})
export class PhotoComponent implements OnInit {
  imgSrc: string = '';
  idx = 0;
  selectedImage: any = null;
  selectedFiles: File[] = [];
  isSubmitted: boolean = false;

  //angular image upload & firebase
  //https://www.youtube.com/watch?v=SZlt8VdWAIE

   constructor(
     public service: PhotoService,
     private http: HttpClient ) {}

  ngOnInit() {
    this.resetForm();
  }

  search3(text$: Observable<string>): Observable<string[]> {
    return text$.pipe(
      debounceTime(300), // optional: debounce time to wait for user to stop typing
      distinctUntilChanged(), // optional: only emit if the value has changed
      switchMap((searchText: string) => {
        if (!searchText || searchText.trim() === '') {
          // If searchText is empty, return an observable with an empty array
          return of(['']);
        } else {
          // Your actual search logic here
          // For example, make an HTTP request to a search API
          // Replace the following line with your actual search logic
          return this?.http.get<string[]>(`https://localhost:7293/api/imagegallery/search?name=${searchText}`).pipe(
            catchError(() => of([])) // Handle errors gracefully
          );
        }
      })
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

  formTemplate = new FormGroup({
    FullName: new FormControl('', Validators.required),
    Category: new FormControl('CaseNote'),
    ImageUrl: new FormControl('', Validators.required),
    Remarks: new FormControl('OK'),
  });

  updateFields(ctrl: any) {
    // console.log(ctrl)
    // if (ctrl == null) {
    //   //.selectedIndex == 0
    //   this.formTemplate.patchValue({
    //     FullName: '',
    //     ImageUrl: '',
    //     Category: 'CaseNote',
    //     Remarks: '',
    //   });
    //   //this.form.controls['your form control name'].value;
    // } else {
    //     //new entry
    //     if (this.itemList) {
    //       this.formTemplate.patchValue({
    //         FullName: this.itemList[this.idx - 1].FullName
    //           ? this.itemList[this.idx - 1].FullName
    //           : '',
    //         Category:'CaseNote'
    //       });
    //     }
    // }
  }

  urls = [];
  showPreviewMultiple(e: any) {
    if (e.target.files) {
      for (let i = 0; i < File.length; i++){
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result as never);
        }
      }
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = <File>event.target.files;
      //this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue: any) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      // const filePath = `${this.selectedImage.name //${formValue.category}/
      //   .split('.')
      //   .slice(0, -1)
      //   .join('.')}_${new Date().getTime()}`;
      // console.log(filePath);
      // formValue['ImageUrl'] = filePath;

      // const fileNameWithoutExt = this.selectedImage.name
      //   .split('.')
      //   .slice(0, -1)
      //   .join('_'); // Replace spaces with underscores
      // const filePathWithExt = `${fileNameWithoutExt}_${new Date().getTime()}${this.selectedImage.name.substring(this.selectedImage.name.lastIndexOf('.'))}`;
      // console.log(filePathWithExt);

        // var fullName = "omage femi [001-1234]";
        //   var regex = /([^[\]]+)(?:\[([^\]]+)\])?/;
        //   var match = fullName.match(regex);

        //   if (match) {
        //     var namePart = match[1].trim();
        //     var idPart = match[2] ? match[2].trim() : null;

        //     console.log("Name: " + namePart);
        //     console.log("ID: " + (idPart || "No ID"));
        //   } else {
        //     console.log("No match found");
        //   }

      const fullName = this.formTemplate.controls['FullName'].value?.toString();
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

      // console.log("Name: " + namePart);
      // console.log("ID: " + (idPart ?? "No ID"));
      // console.log("ID2: " + (idPart2 ?? "No ID2"));

      const photoObj = new Photo(
      formValue['FullName'],
      formValue['Category'],
      formValue['ImageUrl'],
      formValue['Remarks'],
      this.selectedImage);

        const payload = new FormData();
        payload.append('fullName', formValue['FullName']);
        payload.append('category', formValue['Category']);
        payload.append('imageUrl', idPart!);
        payload.append('remarks', formValue['Remarks']);

        for (const img of this.selectedImage) {
          payload.append('photo', img, img.name);
        }

        // for (let i = 0; i < this.selectedImage.length; i++) {
        //   payload.append('Photo', this.selectedImage[i], this.selectedImage[i].name);
        // }

        this.service.insertImageDetails(payload).subscribe((res) => {
        this.resetForm();
        });

     // const fileRef = this.storage.ref(filePath);
      // this.storage
      //   .upload(filePath, this.selectedImage)
      //   .snapshotChanges()
      //   .pipe(
      //     finalize(() => {
      //       fileRef.getDownloadURL()

    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      FullName: '',
      ImageUrl: '',
      Category: 'CaseNote',
      Remarks: 'OK'
    });
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }
}

