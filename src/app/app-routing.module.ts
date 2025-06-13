import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from "./login/login.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";


import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'home', component: HomeComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'reset-password/:email/:token', component: ResetPasswordComponent }, 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
