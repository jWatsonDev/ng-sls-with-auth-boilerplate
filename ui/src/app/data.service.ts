import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const API_ROOT: string;
declare const STAGE: string;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  options;
  apiRoot: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  setOptions() {
    this.options = {
      headers: {
        app_user_id: '12345',
        app_user_name: 'fred'
      }
    };
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
    this.setOptions();
    return this.httpClient.get(endpoint, this.options);
  }

  getNotes(start?): Observable<any> {
    console.log('api', this.apiRoot);
    let endpoint = `${this.apiRoot}/notes?limit=5`;

    if (start > 0) {
      endpoint += '&start=' + start;
    }

    this.setOptions();
    return this.httpClient.get(endpoint, this.options);
  }
}
