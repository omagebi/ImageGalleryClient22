import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {

  @Input() selectedImage: string='';
  @Input() imageList: string[] = [];

    constructor(public activeModal: NgbActiveModal) { }



}
