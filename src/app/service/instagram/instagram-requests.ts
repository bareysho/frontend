import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import {ApiService} from '../api.service';

@Injectable()
export class InstagramRequests {

  constructor(
    private apiService: ApiService
  ) { }

  public instagramLikePost(postId, uuid) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `postId=${postId}&uuid=${uuid}`;
    console.log(body);
    return this.apiService.post(ConfigService.LIKE_POST_URL, body, loginHeaders).map(response => {
      console.log('Like success');
      return response;
    });
  }

  public claimInstagramAccount(user) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=${user.username}&password=${user.password}`;
    return this.apiService.post(ConfigService.CLIAM_INSTAGRAM_ACCOUNT_URL, body, loginHeaders).map(response => {
      console.log('Claim success');
      return response;

    });
  }

  public getUserPosts(username, uuid) {
    return this.apiService.get(ConfigService.GET_USER_POSTS_URL + '/' + username + '/' + uuid).map(response => {
      console.log('Get posts success');
      return response;
    });
  }

  public getUserInstagramAccounts() {
    return this.apiService.get(ConfigService.GET_INSTAGRAM_ACCOUNTS_URL).map(response => {
      console.log('Get accounts success');
      return response;
    });
  }
}