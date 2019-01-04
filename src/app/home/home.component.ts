import { Component, OnInit } from '@angular/core';
import {
  FooService,
  ConfigService,
  UserService, AuthService, ApiService
} from '../service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DisplayMessage} from '../shared/models/display-message';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  instagramUser;
  fooResponse = {};
  whoamIResponse = {};
  allUserResponse = {};
  notification: DisplayMessage;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  form: FormGroup;

  constructor(
    private config: ConfigService,
    private fooService: FooService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }


  ngOnInit() {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=unauth&password=unauth`;
    this.apiService.post(this.config.instagram_login_url, body, loginHeaders).subscribe( data => {
      this.instagramUser = data;
    });

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])]
    });
  }

  onSubmit() {
    this.authService.loginInstagram(this.form.value)
    // show me the animation
      .subscribe(data => {
        console.log(data);
          this.instagramUser = data;
        },
        error => {
          this.notification = { msgType: 'error', msgBody: 'Incorrect username or password.' };
        });
  }

  hasSignedIn() {
    return !!this.userService.currentUser;
  }

  makeRequest(path) {
    if (path === this.config.foo_url) {
      this.fooService.getFoo()
      .subscribe(res => {
        this.forgeResonseObj(this.fooResponse, res, path);
      }, err => {
        this.forgeResonseObj(this.fooResponse, err, path);
      });
    } else if (path === this.config.whoami_url) {
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
