import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// material
import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatIconRegistry,
  MatProgressSpinnerModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { LoginGuard, GuestGuard, AdminGuard } from './guard';
import { NotFoundComponent } from './not-found';
import { AccountMenuComponent } from './component/header/account-menu/account-menu.component';
import {
  HeaderComponent,
  ApiCardComponent,
  FooterComponent,
  GithubComponent
} from './component';

import {
  ApiService,
  AuthService,
  UserService,
  FooService,
  ConfigService
} from './service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminComponent } from './admin/admin.component';
import { SignupComponent } from './signup/signup.component';
import {VgBufferingModule} from 'videogular2/buffering';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgControlsModule} from 'videogular2/controls';
import {VgCoreModule} from 'videogular2/core';
import {Ng5SliderModule} from 'ng5-slider';
import {InstagramAccountsPanelComponent} from './component/instagram-accounts-panel/instagram-accounts-panel.component';
import {InstagramUserProxy} from './service/instagram-user.proxy';
import {InstagramRequests} from './service/instagram/instagram-requests';
import {InstagramService} from './service/instagram/instagram.service';
import {UploadedVideoPlayerComponent} from './component/uploaded-video-player/uploaded-video-player.component';
import {ImageCropperModule} from './ng2-papers-image-cropper/ng2-papers-image-cropper';
import {InstagramCropperComponent} from './ng2-papers-image-cropper/instagram-cropper.component';

export function initUserFactory(userService: UserService) {
    return () => userService.initUser();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ApiCardComponent,
    HomeComponent,
    GithubComponent,
    LoginComponent,
    NotFoundComponent,
    AccountMenuComponent,
    ChangePasswordComponent,
    ForbiddenComponent,
    AdminComponent,
    SignupComponent,
    InstagramAccountsPanelComponent,
    UploadedVideoPlayerComponent,
    InstagramCropperComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    Ng5SliderModule,
    ImageCropperModule
  ],
  providers: [
    LoginGuard,
    GuestGuard,
    AdminGuard,
    FooService,
    AuthService,
    ApiService,
    UserService,
    ConfigService,
    MatIconRegistry,
    InstagramUserProxy,
    InstagramRequests,
    InstagramService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
