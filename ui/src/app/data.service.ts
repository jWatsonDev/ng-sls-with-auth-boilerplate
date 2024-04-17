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
    //const host = new URL(API_ROOT);

    let args = {
        service: 'execute-api',
        region: 'us-east-1',
        hostname: this.apiRoot,
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

            // ************* TASK 1: CREATE A CANONICAL REQUEST *************
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

    // Step 1 is to define the verb (GET, POST, etc.)--already done.

    // Step 2: Create canonical URI--the part of the URI from domain to query
    // string (use '/' if no path)
    // Create a date for headers and the credential string
    // const amz_date = ''//moment().utc().format("yyyyMMDDTHHmmss\\Z")
    // const date_stamp = ''// moment().utc().format("yyyyMMDD")

    // //// Step 3: Create the canonical query string. In this example, request
    // // parameters are passed in the body of the request and the query string
    // // is blank.
    // const canonical_querystring = ''

    // //## DOing step 6 first so that I can include the payload hash in the cannonical header, per https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html
    // // Step 6: Create payload hash. In this example, the payload (body of
    // // the request) contains the request parameters.
    // //const payload_hash = hashlib.sha256(request_parameters.encode('utf-8')).hexdigest()
    // const payload_hash = crypto.SHA256(body);

    // // Step 4: Create the canonical headers. Header names must be trimmed
    // // and lowercase, and sorted in code point order from low to high.
    // // Note that there is a trailing \n.
    // const canonical_headers = 'host:' + this.apiRoot + '\n' + 'x-amz-content-sha256:' + payload_hash + '\n' + 'x-amz-date:' + amz_date + '\n'

    // // Step 5: Create the list of signed headers. This lists the headers
    // // in the canonical_headers list, delimited with ";" and in alpha order.
    // // Note: The request can include any headers; canonical_headers and
    // // signed_headers include those that you want to be included in the
    // // hash of the request. "Host" and "x-amz-date" are always required.
    // const signed_headers = 'host;x-amz-content-sha256;x-amz-date'

    // // Step 7: Combine elements to create canonical request
    // const canonical_request = method + '\n' + 'canonical_uri' + '\n' + canonical_querystring + '\n' + canonical_headers + '\n' + signed_headers + '\n' + payload_hash

    // // ************* TASK 2: CREATE THE STRING TO SIGN*************
    // // Match the algorithm to the hashing algorithm you use, either SHA-1 or
    // // SHA-256 (recommended)
    // const algorithm = 'AWS4-HMAC-SHA256'
    // const credential_scope = date_stamp + '/' + 'us-east-1' + '/' + 'execute-api' + '/' + 'aws4_request'
    // const string_to_sign = algorithm + '\n' +  amz_date + '\n' +  credential_scope + '\n' +  crypto.SHA256(canonical_request);

    // // ************* TASK 3: CALCULATE THE SIGNATURE *************
    // // Create the signing key using the function defined above.
    // //const signing_key = getSignatureKey(secret_key, date_stamp, region, service)

    // // Sign the string_to_sign using the signing_key
    // //const signature = crypto.HmacSHA256(string_to_sign, signing_key);
    // // ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
    // // Put the signature information in a header named Authorization.
    // //const authorization_header = algorithm + ' ' + 'Credential=' + access_key + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature

    // // For DynamoDB, the request can include any headers, but MUST include "host", "x-amz-date",
    // // "x-amz-target", "content-type", and "Authorization". Except for the authorization
    // // header, the headers must be included in the canonical_headers and signed_headers values, as
    // // noted earlier. Order here is not significant.
    // // const headers = {
    // //     'X-Amz-Content-Sha256':payload_hash,
    // //     'X-Amz-Date':amz_date,
    // //     //'X-Amz-Target':amz_target,
    // //     'Authorization':authorization_header,
    // //     'Content-Type':content_type
    // // }



            // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-signing.html
            // https://www.npmjs.com/package/aws4
            // let signer = new RequestSigner(args, creds);
            // let signed = signer.sign();

            //this.options.headers = signed.headers;
            //this.options.headers = creds;
            delete this.options.headers.Host;

            this.options.headers.app_user_id = savedCreds.IdentityId;
            this.options.headers.app_user_name = 'jaywatson1982@gmail.com'; //app_user_name
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
    this.setOptions();
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
    this.setOptions();

    return this.httpClient.patch(endpoint, reqBody, this.options);
  }

  deleteNote(timestamp) {
    let endpoint = `${this.apiRoot}/note/t/${timestamp}}`;
    this.setOptions();
    return this.httpClient.delete(endpoint, this.options);
  }

  getNote(guid: string): Observable<any> {
    const endpoint = `${this.apiRoot}/note/n/${guid}`;
    //this.setOptions();
    this.setOptions(`/notes?limit=5`, 'GET');
    return this.httpClient.get(endpoint, this.options);
  }

  getNotes(start?): Observable<any> {
    console.log('api', this.apiRoot);
    let endpoint = `${this.apiRoot}/notes?limit=5`;

    if (start > 0) {
      endpoint += '&start=' + start;
    }

    //this.setOptionsLocalTesting();
    //this.setOptions(`/dev/notes?limit=5`, 'GET');
    return this.httpClient.get(endpoint, this.options);
  }
}
