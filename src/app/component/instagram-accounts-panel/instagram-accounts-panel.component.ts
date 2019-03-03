import {Component, OnInit} from '@angular/core';
import {InstagramRequests} from '../../service/instagram/instagram-requests';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InstagramUserProxy} from '../../service/instagram-user.proxy';
import {UserService} from '../../service';

@Component({
  selector: 'instagram-accounts-panel',
  templateUrl: './instagram-accounts-panel.component.html',
  styleUrls: ['./instagram-accounts-panel.component.scss']
})
export class InstagramAccountsPanelComponent implements OnInit {

  public notification: Object;
  public instagramUsers;
  submitted = false;

  private form: FormGroup;

  constructor(
    private instagramRequests: InstagramRequests,
    private instagramAccountProxy: InstagramUserProxy,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  public onSubmit(): void {
    this.submitted = true;
    this.instagramRequests.claimInstagramAccount(this.form.value)
    // show me the animation
      .subscribe(data => {
          this.instagramUsers.push(data.body);
          console.log(data.body);
          this.submitted = false;
        },
        error => {
          this.submitted = false;
          this.notification = {msgType: 'error', msgBody: 'Incorrect username or password.'};
        });
  }
  public select(uuid): void {
    this.instagramAccountProxy.setUser(uuid);
  }

  public isAccountSelected(account): string {
    if (account.uuid === this.instagramAccountProxy.getUser().value) {
      return 'chat_list active_chat';
    } else {
      return 'chat_list';
    }
  }

  public hasSignedIn() {
    return this.userService.hasSignedIn();
  }

  public ngOnInit(): void {
    this.instagramRequests.getUserInstagramAccounts()
      .subscribe(data => {
        this.instagramAccountProxy.setUser(data[0].uuid)
        this.instagramUsers = data;
      });
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])]
    });
  }
}
