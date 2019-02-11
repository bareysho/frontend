import { Component, ViewChild } from '@angular/core';
import {ImageCropperComponent} from 'app/ng2-papers-image-cropper/ImageCropperComponent';

@Component({
  selector: 'instagram-cropper',
  templateUrl: './instagram-cropper.component.html'
})

export class InstagramCropperComponent {

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
    this.imageCropper.zoomCenter(1.1);
  }

  zoomOut() {
    this.imageCropper.zoomCenter(0.9);
  }

  reset() {
    this.imageCropper.reset();
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  getOriginalCrop() {
    const originalCrop = this.imageCropper.getOriginalCrop();
    this.dataSrc = originalCrop;
  }
  getSmallCrop() {
    const smallCrop = this.imageCropper.getSizedCrop(512, 512);
    this.dataSrc = smallCrop;
  }
}
