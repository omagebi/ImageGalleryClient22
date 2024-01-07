import { Component, OnInit } from '@angular/core';
import { PhotoService } from './photo.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router, RouterModule } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports:[RouterModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  constructor(private service: PhotoService) {}

  ngOnInit() {
    this.service.getImageDetailList();
  }
}

