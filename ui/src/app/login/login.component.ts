import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // https://medium.com/@kushalghosh9899/authenticate-with-google-in-angular-17-via-oauth2-196a98793f0c


  private accessToken = '';

  constructor(private authService: SocialAuthService,
    private _router: Router,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user)
      this.accessToken = user.idToken;
      //localStorage.setItem('id_token', this.accessToken);
      this._authService.setCredentials(user.idToken);
      // this._router.navigate(['']).then(() => {
      //   window.location.reload();
      // });
    });
  }

  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }

}
