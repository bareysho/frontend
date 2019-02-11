import { NgModule } from '@angular/core';
import { ImageCropperComponent } from './ImageCropperComponent';
import {Ng5SliderModule} from 'ng5-slider';

@NgModule({
  declarations: [ImageCropperComponent],
  imports: [Ng5SliderModule],
  exports: [ImageCropperComponent]
})

export class ImageCropperModule { }
