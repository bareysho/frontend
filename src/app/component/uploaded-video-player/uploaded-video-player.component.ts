import {Component} from '@angular/core';
import {VgAPI} from 'videogular2/core';
import {ChangeContext, Options} from 'ng5-slider';

@Component({
  selector: 'uploaded-video-player',
  templateUrl: './uploaded-video-player.component.html',
  styleUrls: ['./uploaded-video-player.component.scss']
})
export class UploadedVideoPlayerComponent {

  private api: VgAPI;

  private start: number;
  private end: number;

  public minValue: number = 0;
  public maxValue: number = 60;

  private isPlay;

  private options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    minRange: 3,
    maxRange: 60,
    pushRange: true
  };

  public onPlayerReady(api: VgAPI): void {
    this.isPlay = false;
    this.api = api;

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        this.api.getDefaultMedia().currentTime = 0;
      }
    );
    let duration;
    this.api.getDefaultMedia().subscriptions.loadedData.subscribe(
      event => {
        duration = Math.floor(event.target.duration);
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.ceil = duration;
        this.options = newOptions;
      }
    );
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      event => {
        if (Math.floor(event.target.currentTime) === this.end ) {
          this.api.pause();
        }
      }
    );
  }

  public playOrPause(): void {
    if (this.isPlay) {
      this.isPlay = false;
      this.pause()
    } else {
      this.isPlay = true;
      this.play();
    }
  }

  public pause(): void {
    this.api.pause();
  }

  public play(): void {
    this.api.play();
  }

  public onUserChangeEnd(changeContext: ChangeContext): void {
    this.start = changeContext.value;
    this.end = changeContext.highValue;
    this.api.currentTime = changeContext.value;
  }
}
