import {BehaviorSubject} from 'rxjs/Rx';

export class InstagramUserProxy {

  private userUUID: BehaviorSubject<string> = new BehaviorSubject(null);

  public setUser(uuid: string): void {
    this.userUUID.next(uuid);
  }

  public getUser(): BehaviorSubject<string> {
    return this.userUUID;
  }
}
