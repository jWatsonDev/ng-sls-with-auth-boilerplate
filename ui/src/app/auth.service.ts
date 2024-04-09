declare const google: any;
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const API_ROOT: string;
declare const STAGE: string;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router,
    private httpClient: HttpClient,
    private _router: Router) {
    // gapi.load('auth2', function () {
    //     gapi.auth2.init();
    // });
  }

  getCredentials() {
    return localStorage.getItem('aws');
  }

  getIdToken() {
    return localStorage.getItem('id_token');
  }

  /**
   * In addition to AWS credentials expiring after a given amount of time,
   * the login token from the identity provider will also expire.
   * Once this token expires, it will not be usable to refresh AWS credentials,
   * and another token will be needed. The SDK does not manage refreshing of the token value
   */
  async isLoggedIn() {
    let id_token = this.getIdToken();

    console.log('id token', id_token)

    if (id_token) {

      let endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token;
      try {
        var loggedInResponse = await this.httpClient.get(endpoint).toPromise();
        console.log('l', loggedInResponse['email'])

        if (loggedInResponse && loggedInResponse['email']) {
          return true;
        }
        return false;

      } catch (err) {
        throw err;
      }
    }

    console.log('false')

    return false;
  }

  hmmm() {
    this._router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  // loadGoogleLogin() {
  //   console.log('loading google')
  //   google.accounts.id.initialize({
  //     client_id: "882101212564-cmhdfraahqld5nrjs41br27j5h5adsbf.apps.googleusercontent.com",
  //     callback: this.login
  //   });
  //   google.accounts.id.renderButton(
  //     document.getElementById("buttonDiv"),
  //     { type: "standard", theme: "filled_blue", size: "large", shape: "rectangular", width: "350.043", logo_alignment: "left" } // customization attributes
  //   );
  // }

  async setLogin(token) {
    console.log(token)
    await localStorage.setItem('id_token', token);
  }

  public saveToken(token) {
    console.log('bro', token)
    // google.accounts.id.initialize({
    //   client_id: "882101212564-cmhdfraahqld5nrjs41br27j5h5adsbf.apps.googleusercontent.com",
    //   callback: this.fred
    // });
    // google.prompt();
    // GoogleAuth.signIn()
    // let googleAuth = await gapi.auth2.getAuthInstance();
    // let googleUser = await googleAuth.signIn({ scope: 'profile email' });
    // let id_token = googleUser.getAuthResponse().id_token;
    // await this.setCredentials(id_token);

    // console.log($event)

    // this.router.navigate(['']).then(() => {
    //     window.location.reload();
    // });
  }

  async login($event) {
    console.log('bro')
    // google.accounts.id.initialize({
    //   client_id: "882101212564-cmhdfraahqld5nrjs41br27j5h5adsbf.apps.googleusercontent.com",
    //   callback: this.fred
    // });
    // google.prompt();
    // GoogleAuth.signIn()
    // let googleAuth = await gapi.auth2.getAuthInstance();
    // let googleUser = await googleAuth.signIn({ scope: 'profile email' });
    // let id_token = googleUser.getAuthResponse().id_token;
    console.log('what', $event)
    const idToken = $event.credential;
    // await this.setCredentials(idToken);

    localStorage.setItem('id_token', idToken);

    window.location.reload();




  }

    /**
   *
   * @param id_token
   *
   * Set IDP id_token and aws credentials here
   */
    async setCredentials(idToken) {
      console.log('are we ev')

      //To be implemented
      await localStorage.setItem('id_token', idToken);
    }

  async logout() {
    // var googleAuth = gapi.auth2.getAuthInstance();
    // await googleAuth.signOut();

    // localStorage.removeItem('id_token');
    // localStorage.removeItem('aws');
    // this.router.navigate(['login']);
  }
}
