import {Component, ViewChild, AfterViewInit, Input, OnChanges} from '@angular/core';

import 'blueimp-canvas-to-blob'; // toBlob polyfill
import 'hammerjs';
import {Observable, Observer} from 'rxjs/Rx';
import {ChangeContext, Options} from 'ng5-slider';

declare function require(moduleName: string): any;

@Component({
  selector: 'image-cropper',
  styles: [`
    h1 {
      color: blue;
    }
  `],
  template: `
    <div style="width: 1024px; height: 1024px; border: 1px solid black; transform-origin: top left;
      transform: scale(0.5);background-color: transparent;margin-bottom: -512px;">
      <canvas (panend)="onPanEnd($event)"
              (panmove)="onPan($event)" (pinchmove)="onPinch($event)"
              (pinchend)="onPinchEnd($event)" #cropCanvas style="background: transparent;"></canvas>
    </div>
    <ng5-slider style="width: 512px" [(value)]="zoomFactor" (userChange)="onUserChange($event)" [options]="options"></ng5-slider>`
})

export class ImageCropperComponent implements AfterViewInit, OnChanges {

  options: Options = {
    floor: 1,
    ceil: 2,
    step: 0.02
  };

  private context: CanvasRenderingContext2D;

  @ViewChild('cropCanvas') canvas;
  @Input() image;

  @Input() gridAlpha = 0.1;
  @Input() showGrid = true;

  private exportQuality = 1;
  private exportType = 'image/jpeg';

  private canvasSize = 1024;

  private offsetX = 0;
  private offsetY = 0;

  private minOffsetX: number;
  private maxOffsetX: number;

  private minOffsetY: number;
  private maxOffsetY: number;

  private drawWidth: number;
  private drawHeight: number;

  private MAX_ZOOM_FACTOR = 10;
  private MIN_ZOOM_FACTOR = 1;

  public zoomFactor = 1;

  private pinchCenter: { x: number, y: number } = null;
  private pinchScale: { scale: number, initialZoomFactor: number } = null;

  private pinchObserver: Observer<any>;
  private panObserver: Observer<any>;

  private pinch: Observable<any>;
  private pan: Observable<any>;

  constructor() {
    this.pinch = Observable.create((observer) => {
      this.pinchObserver = observer;
    });

    this.pan = Observable.create((observer) => {
      this.panObserver = observer;
    });

    this.pinch.throttleTime(0).subscribe(event => {
      if (!this.pinchCenter) {
        this.pinchCenter = {x: event.center.x - event.target.offsetLeft, y: event.center.y - event.target.offsetTop};
        this.pinchScale = {scale: event.scale, initialZoomFactor: this.zoomFactor};
      }

      this.zoomAround(this.pinchScale.initialZoomFactor * event.scale, this.pinchCenter.x, this.pinchCenter.y);
    });

    this.pan.throttleTime(0).subscribe(event => {
      const offsetValues = this.determineOffsetValues(event);
      this.drawImage(offsetValues.x, offsetValues.y);
    });
  }

  onUserChange(changeContext: ChangeContext): void {
    this.zoomCenter(changeContext.value);
  }

  ngOnChanges(changes) {
    if (this.image) {
      this.drawImage(this.offsetX, this.offsetY);
    }
  }

  ngAfterViewInit() {
    this.reset();
  }

  onPan(event: any): void {
    this.panObserver.next(event);
  }

  onPanEnd(event: any): void {
    const offsetValues = this.determineOffsetValues(event);

    // update offset values (they are allowed now)
    this.offsetX = offsetValues.x;
    this.offsetY = offsetValues.y;
  }

  onPinchEnd(event: any): void {
    this.pinchCenter = null;
    this.pinchScale = null;
  }

  onPinch(event: any): void {
    this.pinchObserver.next(event);
  }

  private determineOffsetValues(event: any) {
    const newOffsetX = this.quarantineOffsetX(this.offsetX + event.deltaX);
    const newOffsetY = this.quarantineOffsetY(this.offsetY + event.deltaY);

    if (this.drawHeight > this.canvasSize) {
      return {x: newOffsetX, y: newOffsetY}
    }

    return {x: newOffsetX, y: (this.canvasSize - this.drawHeight) / 2};
  }

  private quarantineOffsetX(offsetX: number): number {
    if (offsetX <= this.minOffsetX) {
      return this.minOffsetX;
    } else if (offsetX >= this.maxOffsetX) {
      return this.maxOffsetX;
    }

    return offsetX;
  }

  private quarantineOffsetY(offsetY: number): number {
    if (offsetY <= this.minOffsetY) {
      return this.minOffsetY;
    } else if (offsetY >= this.maxOffsetY) {
      return this.maxOffsetY;
    }

    return offsetY;
  }

  zoomCenter(zoom: number): void {

    // determine center of image in canvas
    const preZoomCenterX = this.canvasSize / 2;
    const preZoomCenterY = this.canvasSize / 2;

    this.zoomAround(this.zoomFactor * zoom, preZoomCenterX, preZoomCenterY);

  }

  zoomAround(zoom: number, x: number, y: number): void {

    // calculate distances from center to edge of image
    const distanceX = -this.offsetX + x;
    const distanceY = -this.offsetY + y;

    // get ratios relative to size of image
    const ratioX = distanceX / this.drawWidth;
    const ratioY = distanceY / this.drawHeight;

    // zoom the image
    this.zoomFactor = Math.max(Math.min(zoom, this.MAX_ZOOM_FACTOR), this.MIN_ZOOM_FACTOR);
    this.determineBoundingBox();

    // calculate the new distance to center from edge of image
    const postDistanceX = ratioX * this.drawWidth;
    const postDistanceY = ratioY * this.drawHeight;

    // get the delta of the two distances
    const deltaX = postDistanceX - distanceX;
    const deltaY = postDistanceY - distanceY;

    // move the center point akin to the delta
    this.offsetX -= deltaX;
    this.offsetY -= deltaY;


    const off = this.canvasSize - (this.drawWidth + this.offsetX);
    if (off > 0) {
      this.offsetX += off;
    }
    if (this.offsetX > 0) {
      this.offsetX = 0;
    }

    if (this.offsetY < (this.canvasSize - this.drawHeight) / 2) {
      this.offsetY = (this.canvasSize - this.drawHeight) / 2;
    }
    if (this.offsetY > (this.canvasSize - this.drawHeight) / 2) {
      this.offsetY = (this.canvasSize - this.drawHeight) / 2;
    }


    this.drawImage(this.offsetX, this.offsetY);

  }

  setImage(img: any) {
    if (!img) {
      throw new Error('Image is null. Check your Upload.');
    }

    this.image = img;
    this.determineBoundingBox();
  }

  setExportQuality(exportQuality: number) {
    this.exportQuality = Math.max(Math.min(1, exportQuality), 0);
  }

  setExportType(type: string) {
    if (type !== 'image/png' && type !== 'image/jpeg') {
      throw new Error('Type must be either "image/png" or "image/jpeg"');
    }
    this.exportType = type;
  }

  getOriginalCrop(): string {
    const canvas = this.renderInCanvas(this.image.width, this.image.height);
    return canvas.toDataURL(this.exportType, this.exportQuality);
  }

  getSizedCrop(width = this.drawWidth, height = this.drawHeight): string {
    const canvas = this.renderInCanvas(width, height) as any;
    return canvas.toDataURL(this.exportType, this.exportQuality);
  }

  /**
   * reset - resets the cropper to its original state, without any image loaded
   *
   * @return {type}  description
   */
  reset() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');

    // set canvas to fill parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // set new size of canvas to match parent
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // reset image offset
    this.offsetX = 0;
    this.offsetY = 0;

    this.canvasSize = canvas.width;
  }

  private renderInCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const scale = Math.max(width, height) / this.canvasSize;

    canvas.width = this.canvasSize * scale;
    canvas.height = this.canvasSize * scale;

    console.log(this.offsetX, this.offsetX);

    canvasContext.drawImage(this.image, this.offsetX * scale, this.offsetY * scale, this.drawWidth * scale, this.drawHeight * scale);

    return this.trimCanvas(canvas);
  }

  private determineBoundingBox() {
    const width = this.image.width;
    const height = this.image.height;

    const scale = this.canvasSize / this.image.width;

    this.drawWidth = width;
    this.drawHeight = height;

    if (width > height) {
      this.drawHeight = height * this.zoomFactor * scale;
      this.drawWidth = width * this.zoomFactor * scale;
    } else if (height > width) {
      this.drawHeight = height * this.zoomFactor * scale;
      this.drawWidth = width * this.zoomFactor * scale;
    } else {
      this.drawHeight = this.canvasSize * this.zoomFactor;
      this.drawWidth = this.canvasSize * this.zoomFactor;
    }

    this.maxOffsetX = 0;
    this.maxOffsetY = 0;
    this.minOffsetX = this.canvasSize - this.drawWidth;
    this.minOffsetY = this.canvasSize - this.drawHeight;
  }

  private drawGrid() {
    const gridPadding = 0;

    for (let x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
      this.context.moveTo(0.5 + x + gridPadding, gridPadding);
      this.context.lineTo(0.5 + x + gridPadding, this.canvasSize + gridPadding);
    }

    for (let x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
      this.context.moveTo(gridPadding, 0.5 + x + gridPadding);
      this.context.lineTo(this.canvasSize + gridPadding, 0.5 + x + gridPadding);
    }

    this.context.strokeStyle = 'rgba(0,0,0,' + this.gridAlpha + ')';
    this.context.lineWidth = 2;
    this.context.stroke();

  }

  private drawImage(x: number, y: number) {
    this.context.clearRect(0, 0, this.canvasSize, this.canvasSize);
    this.context.save();
    this.context.drawImage(this.image, x, y, this.drawWidth, this.drawHeight);
    this.context.restore();

    if (this.showGrid) {
      this.drawGrid();
    }
  }

  public trimCanvas(c) {
    const ctx = c.getContext('2d'),
      copy = document.createElement('canvas').getContext('2d'),
      pixels = ctx.getImageData(0, 0, c.width, c.height),
      l = pixels.data.length,
      bound = {
        top: null,
        left: null,
        right: null,
        bottom: null
      };

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (let i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        const x = (i / 4) % c.width;
        const y = ~~((i / 4) / c.width);

        if (bound.top === null) {
          bound.top = y;
        }

        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }

        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }

        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }

    // Calculate the height and width of the content
    const trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);

    // Return trimmed canvas
    return copy.canvas;
  }
}
