import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService,
    private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    try {
      let loggedIn = await this.authService.isLoggedIn();

      if (loggedIn) {
        return true;
      }

      this.router.navigate(['login']);
      return false;
    } catch (err) {
      this.router.navigate(['login']);
      return false;
    }
  }
}
