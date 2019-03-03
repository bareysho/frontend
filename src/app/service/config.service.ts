import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {

  private static API_URL = '/api';

  public static LOGIN_URL = ConfigService.API_URL + '/login';
  public static LOGOUT_URL = ConfigService.API_URL + '/logout';
  public static SIGNUP_URL = ConfigService.API_URL + '/signup';
  public static REFRESH_TOKEN_URL = ConfigService.API_URL + '/refresh';

  public static RESET_CREDENTIALS_URL = ConfigService.API_URL + '/reset-credentials';
  public static CHANGE_PASSWORD_URL = ConfigService.API_URL + '/changePassword';

  public static USERS_URL = ConfigService.API_URL + '/all';
  public static USER_URL = ConfigService.API_URL + '/user';

  public static WHOIAM_URL = ConfigService.API_URL + '/whoami';
  public static FOO_URL = ConfigService.API_URL + '/foo';

  public static CLIAM_INSTAGRAM_ACCOUNT_URL = ConfigService.API_URL + '/claim-instagram';
  public static GET_INSTAGRAM_ACCOUNTS_URL = ConfigService.API_URL + '/user-instagram-accounts';
  public static GET_USER_POSTS_URL = ConfigService.API_URL + '/user-posts';
  public static LIKE_POST_URL = ConfigService.API_URL + '/instagram/like-post';

  public static UPLOAD_FILE_URL = ConfigService.API_URL + '/instagram/upload';

  public static ADD_SCHEDULED_POST_URL = ConfigService.API_URL + '/add-scheduled-post';
  public static DELETE_SCHEDULED_POST_URL = ConfigService.API_URL + '/delete-scheduled-post';
  public static GET_SCHEDULED_POSTS_URL = ConfigService.API_URL + '/user-scheduled-posts';
}
