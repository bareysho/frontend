import {Injectable} from '@angular/core';
import {InstagramRequests} from './instagram-requests';
import {Observable, Subscription} from 'rxjs/Rx';

@Injectable()
export class InstagramService {

  constructor(
    private instagramRequests: InstagramRequests
  ) {}

  public likePost(post, uuid): Subscription {
    const id = post.id.split('_')[0];
    return this.instagramRequests.instagramLikePost(id, uuid)
      .subscribe();
  }

  public getMedia(username, uuid): Observable<any> {
    return this.instagramRequests.getUserPosts(username, uuid);
  }

  public uploadFile(file, uuid): Observable<any> {
    return this.instagramRequests.uploadFile(file, uuid);
  }
}
