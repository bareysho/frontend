import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs/Rx';

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

  public uploadFile(file, uuid) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `file=${file}&uuid=${uuid}`;
    return this.apiService.post(ConfigService.UPLOAD_FILE_URL, body, loginHeaders).map(response => {
      console.log('Upload Secceed!');
      return response;
    })
  }

  public getScheduledPosts(uuid) {
    return this.apiService.get(ConfigService.GET_SCHEDULED_POSTS_URL + '/' + uuid).map(response => {
      console.log('Get scheduled posts success');
      return response;
    });
  }

  public  addScheduledPost(file, date, comment, uuid) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `file=${file}&date=${date}&comment=${comment}&uuid=${uuid}`;
    return this.apiService.post(ConfigService.ADD_SCHEDULED_POST_URL, body, loginHeaders).map(response => {
      console.log('Add post Secceed!');
      return response;
    });
  }

  public deleteScheduledPost(id) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `id=${id}`;
    return this.apiService.post(ConfigService.DELETE_SCHEDULED_POST_URL, body, loginHeaders).map(response => {
      console.log('Delete post' + id + 'Secceed!');
      return response;
    });
  }
}
