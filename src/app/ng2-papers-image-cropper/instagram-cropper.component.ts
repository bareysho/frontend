import { Component, ViewChild } from '@angular/core';
import {ImageCropperComponent} from 'app/ng2-papers-image-cropper/ImageCropperComponent';
import {InstagramRequests} from '../service/instagram/instagram-requests';
import {InstagramUserProxy} from '../service/instagram-user.proxy';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../service';

@Component({
  selector: 'instagram-cropper',
  templateUrl: './instagram-cropper.component.html'
})

export class InstagramCropperComponent {

  constructor(
    private instagramRequests: InstagramRequests,
    private instagramAccountProxy: InstagramUserProxy
  ) {}

  @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

  private dataSrc;
  private showGrid = true;

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const fileReader: FileReader = new FileReader();

    this.imageCropper.setExportQuality(1);
    this.imageCropper.setExportType('image/jpeg');

    fileReader.onloadend = (loadEvent: any) => {
      if (loadEvent.target) {
        image.src = loadEvent.target.result;
        this.imageCropper.setImage(image);
      }
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  setType(type: string) {
    this.imageCropper.setExportType(type);
  }

  zoomIn() {
    this.imageCropper.zoomCenter(0.1);
  }

  zoomOut() {
    this.imageCropper.zoomCenter(-0.1);
  }

  reset() {
    this.imageCropper.reset();
  }

  zoomReset() {
    this.imageCropper.zoomFactor = 1;
    this.imageCropper.zoomCenter(0);
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  getOriginalCrop() {
    const originalCrop = this.imageCropper.getOriginalCrop();
    this.dataSrc = originalCrop;
  }
  getSmallCrop() {
    const smallCrop = this.imageCropper.getSizedCrop(1024, 1024);
    this.dataSrc = smallCrop;
  }

  uploadFile() {
    const uuid = this.instagramAccountProxy.getUser().getValue();
    this.setType('image/jpeg');
    this.getSmallCrop();
    this.instagramRequests.uploadFile(this.dataSrc, uuid).subscribe();
  }
}
