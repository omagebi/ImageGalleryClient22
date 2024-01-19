import { Routes } from '@angular/router';
import { PhotoComponent } from './Gallery/photo/photo.component';
import { PhotoListComponent } from './Gallery/photo-list/photo-list.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './Gallery/gallery.component';
import { UploadComponent } from './Gallery/upload/upload.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'image/upload', pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'photo', component: PhotoComponent },
  {
    path: 'image', component: GalleryComponent, children: [
      { path: 'upload', component: UploadComponent },
      { path: ':id/list', component: PhotoListComponent }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
