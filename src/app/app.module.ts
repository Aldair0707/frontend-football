import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TweetFormComponent } from './components/tweet-form/tweet-form.component';
import { TweetListComponent } from './components/tweet-list/tweet-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { ReactionButtonsComponent } from './components/reaction-buttons/reaction-buttons.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TweetFormComponent,
    TweetListComponent,
    CommentFormComponent,
    CommentListComponent,
    ReactionButtonsComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    BrowserAnimationsModule,
    DialogModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
