import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { RequestSigner } from 'aws4';
// import crypto from 'crypto-js';
//import moment from 'moment';

// https://stackoverflow.com/questions/73244772/how-to-sign-post-request-with-aws-signature-version-4


declare const API_ROOT: string;
declare const STAGE: string;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  options;
  apiRoot: string = environment.apiUrl;
  constructor(private httpClient: HttpClient,
    private _authService: AuthService) { }

  setOptionsLocalTesting() {
    this.options = {
      headers: {
        app_user_id: '12345',
        app_user_name: 'fred'
      }
    };
  }

  setOptions(path = '/', method = '', body = '') {
    const host = new URL(this.apiRoot);

    let args = {
        service: 'execute-api',
        region: 'us-east-1',
        hostname: host.hostname,
        path: path,
        method: method,
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if(method == 'GET') {
        delete args.body;
    }

    this.options = {};
    try {
        let savedCredsJson = this._authService.getCredentials();


        if(savedCredsJson) {
            let savedCreds = JSON.parse(savedCredsJson);
            let creds = {
                accessKeyId: savedCreds.Credentials.AccessKeyId,
                secretAccessKey: savedCreds.Credentials.SecretKey,
                sessionToken: savedCreds.Credentials.SessionToken
            };

            let signer = new RequestSigner(args, creds);
            let signed = signer.sign();

            this.options.headers = signed.headers;
            delete this.options.headers.Host;
            delete this.options.headers['Content-Length'];

            this.options.headers.app_user_id = savedCreds.IdentityId;
            this.options.headers.app_user_name = this._authService.getName();
        }
    } catch (error) {
        // do nothing
    }
}

  addNote(item) {
    let endpoint = `${this.apiRoot}/note`

    let itemData;
    itemData = {
      content: item.content,
      cat: item.cat
    };

    if (item.title != "") {
      itemData.title = item.title;
    }

    let reqBody = {
      Item: itemData
    };
    this.setOptions('dev/note', 'POST', JSON.stringify(reqBody));
    return this.httpClient.post(endpoint, reqBody, this.options);
  }

  updateNote(item) {
    let endpoint = `${this.apiRoot}/note`

    let itemData;
    itemData = {
      content: item.content,
      cat: item.cat,
      timestamp: parseInt(item.timestamp),
      note_id: item.note_id
    };

    if (item.title != "") {
      itemData.title = item.title;
    }

    let reqBody = {
      Item: itemData
    };

    this.setOptions('/dev/note', 'PATCH', JSON.stringify(reqBody));
    return this.httpClient.patch(endpoint, reqBody, this.options);
  }

  deleteNote(timestamp) {
    let endpoint = `${this.apiRoot}/note/t/${timestamp}}`;

    this.setOptions(`/dev/note/t/${timestamp}}`, 'DELETE');
    return this.httpClient.delete(endpoint, this.options);
  }

  getNote(guid: string): Observable<any> {
    const endpoint = `${this.apiRoot}/note/n/${guid}`;
    this.setOptions(`/dev/note/n/${guid}`, 'GET');
    return this.httpClient.get(endpoint, this.options);
  }

  getNotes(start?): Observable<any> {
    let endpoint = `${this.apiRoot}/notes?limit=5`;

    if (start > 0) {
      endpoint += '&start=' + start;
      this.setOptions(`/dev/notes?limit=5&start=${start}`, 'GET');
    } else {
      this.setOptions(`/dev/notes?limit=5`, 'GET');
    }


    return this.httpClient.get(endpoint, this.options);
  }
}
