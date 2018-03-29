import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGardService implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService) {}

  canActivate() {
    if (!this.authService.isTokenExpired()) {
      console.log("authGard : verifToken");
      return true;
    }
    console.log("authGard : token HS / tokenExpired");
    this.router.navigate(['/login']);
    return false;
  }
}
