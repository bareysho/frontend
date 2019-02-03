import {Component, Input, OnInit} from '@angular/core';
import {
  FooService,
  ConfigService,
  UserService, AuthService
} from '../service';
import {DisplayMessage} from '../shared/models/display-message';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {CropperSettings} from 'ngx-img-cropper';
import {InstagramRequests} from '../service/instagram/instagram-requests';
import {InstagramUserProxy} from '../service/instagram-user.proxy';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() value: string;
  fooResponse = {};
  whoamIResponse = {};
  allUserResponse = {};
  notification: DisplayMessage;

  userPosts;
  data: any;
  cropperSettings: CropperSettings;


  constructor(
    private config: ConfigService,
    private fooService: FooService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private instagramRequests: InstagramRequests,
    private userProxy: InstagramUserProxy
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 500;
    this.data = {};
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
  }

  makeRequest(path) {
    if (path === ConfigService.FOO_URL) {
      this.fooService.getFoo()
        .subscribe(res => {
          this.forgeResonseObj(this.fooResponse, res, path);
        }, err => {
          this.forgeResonseObj(this.fooResponse, err, path);
        });
    } else if (path === ConfigService.WHOIAM_URL) {
      this.userService.getMyInfo()
        .subscribe(res => {
          this.forgeResonseObj(this.whoamIResponse, res, path);
        }, err => {
          this.forgeResonseObj(this.whoamIResponse, err, path);
        });
    } else {
      this.userService.getAll()
        .subscribe(res => {
          this.forgeResonseObj(this.allUserResponse, res, path);
        }, err => {
          this.forgeResonseObj(this.allUserResponse, err, path);
        });
    }
  }

  public getMedia() {
    this.instagramRequests.getUserPosts(this.value, this.userProxy.getUser().getValue()).subscribe(posts => {
      this.userPosts = posts;
      console.log(posts)
    });
    console.log(this.userPosts)
  }

  public hasSignedIn() {
    return this.userService.hasSignedIn();
  }

  public likePost(post) {
    const id = post.id.split('_')[0];
    return this.instagramRequests.instagramLikePost(id, this.userProxy.getUser().getValue())
      .subscribe();
  }

  forgeResonseObj(obj, res, path) {
    obj['path'] = path;
    obj['method'] = 'GET';
    if (res.ok === false) {
      // err
      obj['status'] = res.status;
      try {
        obj['body'] = JSON.stringify(JSON.parse(res._body), null, 2);
      } catch (err) {
        console.log(res);
        obj['body'] = res.error.message;
      }
    } else {
      // 200
      obj['status'] = 200;
      obj['body'] = JSON.stringify(res, null, 2);
    }
  }
}
