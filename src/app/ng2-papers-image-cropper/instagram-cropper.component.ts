import {Component, Input, ViewChild} from '@angular/core';
import {ImageCropperComponent} from 'app/ng2-papers-image-cropper/ImageCropperComponent';
import {InstagramRequests} from '../service/instagram/instagram-requests';
import {InstagramUserProxy} from '../service/instagram-user.proxy';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service';
import {MatDatetimepickerFilterType} from '@mat-datetimepicker/core';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'instagram-cropper',
  templateUrl: './instagram-cropper.component.html'
})

export class InstagramCropperComponent {

  submitted = false;
  group: FormGroup;
  type = 'native';
  today = new Date();
  min = new Date();
  start = new Date();
  filter: (date: Date, type: MatDatetimepickerFilterType) => boolean;

  constructor(
    public datepipe: DatePipe,
    private instagramRequests: InstagramRequests,
    private instagramAccountProxy: InstagramUserProxy,
    private fb: FormBuilder,
  ) {
    this.min.setFullYear(2018, 10, 3);
    this.min.setHours(11);
    this.min.setMinutes(10);

    this.filter = (date: Date, type: MatDatetimepickerFilterType) => {
      switch (type) {
        case MatDatetimepickerFilterType.DATE:
          return date.getUTCFullYear() % 2 === 0 &&
            date.getMonth() % 2 === 0 &&
            date.getDate() % 2 === 0;
        case MatDatetimepickerFilterType.HOUR:
          return date.getHours() % 2 === 0;
        case MatDatetimepickerFilterType.MINUTE:
          return date.getMinutes() % 2 === 0;
      }
    };
    this.group = fb.group({
      dateTime: [new Date(), Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      month: [null, Validators.required],
      mintest: [this.today, Validators.required],
      filtertest: [this.today, Validators.required],
      touch: [null, Validators.required]
    });
  }

  @ViewChild('imageCropper') imageCropper: ImageCropperComponent;
  @ViewChild('comment') comment;

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
    const smallCrop = this.imageCropper.getSizedCrop(1023, 1023);
    this.dataSrc = smallCrop;
  }

  uploadFile() {
    this.submitted = true;
    const uuid = this.instagramAccountProxy.getUser().getValue();
    this.setType('image/jpeg');
    this.getSmallCrop();
    const date = this.datepipe.transform(this.group.value.dateTime, 'yyyy-MM-dd HH:mm');
    const comment = this.comment.nativeElement.value;
    this.instagramRequests.addScheduledPost(this.dataSrc, date, comment, uuid).subscribe(response => {
      if (response.status === 200) {
        this.instagramAccountProxy.setUser(uuid);
      }
      this.submitted = false;
      return response;
    });
  }
}
