import { Routes } from '@angular/router';
import { PhotoComponent } from './Gallery/photo/photo.component';
import { PhotoListComponent } from './Gallery/photo-list/photo-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'uploadimages', component: PhotoComponent },
  { path: 'viewimages', component: PhotoListComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
