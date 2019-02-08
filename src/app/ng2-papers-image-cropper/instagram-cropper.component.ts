import {Component, ViewChild} from '@angular/core';
import {ImageCropperComponent} from 'ng2-papers-image-cropper';

@Component({
  selector: 'instagram-cropper',
  template: `
    <div>
      <h1>Image Cropper</h1>
      <button (click)="reset()">Reset Cropper</button>
      <button (click)="changeMode()">{{mode}}</button>
      <br>
      <br>
      <button (click)="zoomIn()">Zoom In</button>
      <button (click)="zoomOut()">Zoom Out</button>
      <br>
      <button (click)="getOriginalCrop()">Original</button>
      <button (click)="getOriginalBlob()">Blob (Original)</button>
      <button (click)="fitCrop()">Fit</button>
      <button (click)="defaultView()">Fit</button>
      <br>
      <button (click)="setType('image/jpeg')">JPEG</button>
      <button (click)="setType('image/png')">PNG</button>
      <input id="custom-input" type="file" (change)="fileChangeListener($event)">
      <div style="width: 1024px; height: 1024px; transform: scale(0.5); transform-origin: top left;background-color: transparent;
                   border: 1px solid black;    margin-bottom: -512px;">
        <image-cropper #imageCropper [image]="data" [showGrid]="showGrid"></image-cropper>
      </div>
      <img *ngIf="dataSrc" [src]="dataSrc">
    </div>`
})

export class InstagramCropperComponent {

  @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

  private dataSrc;
  private showGrid: boolean = true;
  private mode: string = "fit";

  fileChangeListener($event) {
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let fileReader: FileReader = new FileReader();

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
    this.imageCropper.drawDefault();
  }

  setType(type: string) {
    this.imageCropper.setExportType(type);
  }

  zoomIn() {
    this.imageCropper.zoomCenter(1.25);
  }

  zoomOut() {
    this.imageCropper.zoomCenter(0.75);
  }

  reset() {
    this.imageCropper.reset();
  }

  defaultView() {
    this.imageCropper.drawDefault();
  }

  rotateLeft() {
    this.imageCropper.rotateLeft();
  }

  rotateRight() {
    this.imageCropper.rotateRight();
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  getSmallCrop() {
    let smallCrop = this.imageCropper.getSizedCrop(200, 200);
    this.dataSrc = smallCrop;
  }

  getOriginalCrop() {
    let originalCrop = this.imageCropper.getOriginalCrop();
    this.dataSrc = originalCrop;
  }

  fitCrop() {
    let originalCrop = this.imageCropper.getFitCrop();
    this.dataSrc = originalCrop;
  }

  getBlob() {
    this.imageCropper.getSizedBlob(200, 200).then((blob) => {
      let reader = new FileReader();

      reader.addEventListener('load', (evt) => {
        this.dataSrc = (evt.target as any).result;
      });

      reader.readAsDataURL(blob);
    });
  }

  getOriginalBlob() {
    this.imageCropper.getOriginalCropAsBlob().then((blob) => {
      let reader = new FileReader();

      reader.addEventListener('load', (evt) => {
        this.dataSrc = (evt.target as any).result;
      });

      reader.readAsDataURL(blob);
    });
  }

  changeMode() {
    if (this.mode === "fit") {
      this.mode = 'fill';
    } else {
      this.mode = "fit";
    }
  }
}
