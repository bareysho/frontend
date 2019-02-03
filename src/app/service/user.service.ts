import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {

  public currentUser;

  constructor(
    private apiService: ApiService
  ) { }

  public hasSignedIn(): boolean {
    return !!this.currentUser;
  }

  public initUser(): Promise<any> {
    const promise = this.apiService.get(ConfigService.REFRESH_TOKEN_URL).toPromise()
      .then(res => {
        if (res.access_token !== null) {
          return this.getMyInfo().toPromise()
            .then(user => {
              this.currentUser = user;
            });
        }
      })
      .catch(() => null);
    return promise;
  }

  public resetCredentials(): Observable<any> {
    return this.apiService.get(ConfigService.RESET_CREDENTIALS_URL);
  }

  public getMyInfo(): Observable<any> {
    return this.apiService.get(ConfigService.WHOIAM_URL).map(user => this.currentUser = user);
  }

  public getAll(): Observable<any> {
    return this.apiService.get(ConfigService.USERS_URL);
  }

}
