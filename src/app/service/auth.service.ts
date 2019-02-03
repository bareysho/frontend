import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthService {

  private loginHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  private signupHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) {}

  public login(user): Observable<void> {
    const body = `username=${user.username}&password=${user.password}`;
    return this.apiService.post(ConfigService.LOGIN_URL, body, this.loginHeaders).map(() => {
      console.log('Login success');
      this.userService.getMyInfo().subscribe();
    });
  }

  public signup(user): Observable<void> {
    return this.apiService.post(ConfigService.SIGNUP_URL, JSON.stringify(user), this.signupHeaders).map(() => {
      console.log('Sign up success');
    });
  }

  public logout(): Observable<void> {
    return this.apiService.post(ConfigService.LOGOUT_URL, {})
      .map(() => {
        this.userService.currentUser = null;
      });
  }

  public changePassowrd(passwordChanger): Observable<any> {
    return this.apiService.post(ConfigService.CHANGE_PASSWORD_URL, passwordChanger);
  }
}
