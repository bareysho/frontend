import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private config: ConfigService,
  ) {
  }

  login(user) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=${user.username}&password=${user.password}`;
    return this.apiService.post(this.config.login_url, body, loginHeaders).map(() => {
      console.log('Login success');
      this.userService.getMyInfo().subscribe();
    });
  }

  instagramLikePost(postId, uuid) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `postId=${postId}&uuid=${uuid}`;
    return this.apiService.post(this.config.get_like_instagram_post_url, body, loginHeaders).map(response => {
      console.log('Like success');
      return response;
    });
  }

  claimInstagramAccount(user) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=${user.username}&password=${user.password}`;
    return this.apiService.post(this.config.claim_instagram_url, body, loginHeaders).map(response => {
      console.log('Claim success');
      return response;

    });
  }

  getUserPosts(username, uuid) {
    console.log(this.config.get_user_posts_url + '/' + username + '/' + uuid);
    return this.apiService.get(this.config.get_user_posts_url + '/' + username + '/' + uuid).map(response => {
      console.log('Get posts success');
      return response;
    });
  }

  getUserInstagramAccounts() {
    return this.apiService.get(this.config.get_instagram_accounts_url).map(response => {
      console.log('Get accounts success');
      return response;
    });
  }

  signup(user) {
    const signupHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.apiService.post(this.config.signup_url, JSON.stringify(user), signupHeaders).map(() => {
      console.log('Sign up success');
    });
  }

  logout() {
    return this.apiService.post(this.config.logout_url, {})
      .map(() => {
        this.userService.currentUser = null;
      });
  }

  changePassowrd(passwordChanger) {
    return this.apiService.post(this.config.change_password_url, passwordChanger);
  }

}
