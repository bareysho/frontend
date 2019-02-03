import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class FooService {

  constructor(
    private apiService: ApiService,
  ) {}

  public getFoo(): Observable<any> {
    return this.apiService.get(ConfigService.FOO_URL);
  }
}
