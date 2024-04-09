"use strict";
declare const google: any;
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService, private _router: Router) { }

  freddy: string = 'not logged in';
  ngOnInit(): void {
    // setTimeout(() => {
      //this.loadGoogleLogin();
    // }, 2000);

    // console.log('when does this fire');

    //const loggedIn = await this._authService.isLoggedIn();

    // if (loggedIn) {
    //   console.log('what is my name')
    //   this.freddy = 'logged in';
    //   this._router.navigate([''])
    // } else {
    //   console.log('not logged in')
    // }
  }

  ngAfterViewChecked(): void {
    // console.log('checking lots', google)

    // if (google) {
    //   console.log('hopefully no more')
    //   // setTimeout(() => {
    //     this.loadGoogleLogin();
    //   // }, 2000);

    // }
  }

  loadGoogleLogin() {
    console.log('loading google')

    google.accounts.id.initialize({
      client_id: "882101212564-cmhdfraahqld5nrjs41br27j5h5adsbf.apps.googleusercontent.com",
      callback: this.login
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { type: "standard", theme: "filled_blue", size: "large", shape: "rectangular", width: "350.043", logo_alignment: "left" } // customization attributes
    );

  }

  async login($event) {
    console.log('login', $event)
    const token = $event.credential;

    localStorage.setItem('id_token', token);

    //    this._router.navigate(['']).then(() => {
    //     window.location.reload();
    // });
  }

  token = 'ree';

  fred($event) {
    // this.token = $event;
    // setTimeout(() => {
    //   console.log($event)

    //   //this._authService.saveToken('sd');
    // }, 2000);

  }

  testme() {
    this._authService.saveToken(this.token);
  }

  delMeLater() {
    this._authService.hmmm();
  }

  onSignIn() {
    // this._authService.login();
  }

  handleCredentialResponse() {
    console.log('what')
  }
}
