import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare const API_ROOT: string;
declare const STAGE: string;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiRoot: string = environment.apiUrl;

  constructor(private router: Router,
    private httpClient: HttpClient,
    private _router: Router) {
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

    return false;
  }

      /**
     *
     * @param id_token
     *
     * Set IDP id_token and aws credentials here
     */
      async setCredentials(id_token) {
        try {
            let options = {
                headers: {
                    Authorization: id_token
                }
            };

            //let endpoint = API_ROOT + STAGE + '/auth';
            let endpoint = `${this.apiRoot}/auth`
            let credentials = await this.httpClient.get(endpoint, options).toPromise();

            localStorage.setItem('id_token', id_token);
            localStorage.setItem('aws', JSON.stringify(credentials));

            this._router.navigate(['']).then(() => {
              window.location.reload();
            });

            return;
        } catch(err) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('aws');
            throw err;
        }
    }

  getIdToken() {
    return localStorage.getItem('id_token');
  }

  getCredentials() {
    return localStorage.getItem('aws');
}

  async setLogin(token) {
    console.log(token)
    await localStorage.setItem('id_token', token);
  }

/**
 *
 * @param id_token
 *
 * Set IDP id_token and aws credentials here
 */
  // async setCredentials(idToken) {
  //   await localStorage.setItem('id_token', idToken);
  // }

}
