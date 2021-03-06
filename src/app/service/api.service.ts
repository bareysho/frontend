import {HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import {serialize} from 'app/shared/utilities/serialize';

export enum RequestMethod {
  Get = 'GET',
  Head = 'HEAD',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Options = 'OPTIONS',
  Patch = 'PATCH'
}

@Injectable()
export class ApiService {

  private headers: HttpHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  public get(path: string, args?: any): Observable<any> {
    const options = {
      headers: this.headers,
      withCredentials: true
    };

    if (args) {
      options['params'] = serialize(args);
    }

    return this.http.get(path, options)
      .catch(this.checkError.bind(this));
  }

  public post(path: string, body: any, customHeaders?: HttpHeaders): Observable<any> {
    return this.request(path, body, RequestMethod.Post, customHeaders);
  }

  public put(path: string, body: any): Observable<any> {
    return this.request(path, body, RequestMethod.Put);
  }

  public delete(path: string, body?: any): Observable<any> {
    return this.request(path, body, RequestMethod.Delete);
  }

  private request(path: string, body: any, method = RequestMethod.Post, custemHeaders?: HttpHeaders): Observable<any> {
    const req = new HttpRequest(method, path, body, {
      headers: custemHeaders || this.headers,
      withCredentials: true
    });

    return this.http.request(req)
      .filter(response => response instanceof HttpResponse)
      .map((response: HttpResponse<any>) => response)
      .catch(error => this.checkError(error));
  }

  // Display error if logged in, otherwise redirect to IDP
  private checkError(error: any): any {
    if (error && error.status === 401) {
      // this.redirectIfUnauth(error);
    } else {
      // this.displayError(error);
    }
    return error;
  }

}
