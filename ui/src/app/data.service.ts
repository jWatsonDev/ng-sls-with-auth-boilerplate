import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare const API_ROOT: string;
declare const STAGE: string;

@Injectable({
  providedIn: 'root'
})
export class DataService {
    options;
    constructor(private httpClient: HttpClient) {}

    setOptions() {
        this.options = {
            headers: {
                app_user_id: '12345',
                app_user_name: 'fred'
            }
        };
    }

    addNote(item) {
        //let path = STAGE + '/note';
        let endpoint = 'http://localhost:3000/dev/note'; //API_ROOT + path;

        let itemData;
        itemData = {
            content: item.content,
            cat: item.cat
        };

        if(item.title != "") {
            itemData.title = item.title;
        }

        let reqBody = {
            Item: itemData
        };
        this.setOptions();
        return this.httpClient.post(endpoint, reqBody, this.options);
    }

    updateNote(item) {
        //let path = STAGE + '/note';
        console.log('update note', item)
        let endpoint = 'http://localhost:3000/dev/note'; //API_ROOT + path;

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
        console.log('req', reqBody)
        return this.httpClient.patch(endpoint, reqBody, this.options);
    }

    deleteNote(timestamp) {
        let path = '/dev/note/t/' + timestamp;
        let endpoint = 'http://localhost:3000' + path;
        this.setOptions();
        return this.httpClient.delete(endpoint, this.options);
    }

    getNote(guid: string): Observable<any> {
      // let path = STAGE + '/notes?limit=8';

      // if (start > 0) {
      //     path += '&start=' + start;
      // }
      // let endpoint = API_ROOT + path;
      const endpoint = `http://localhost:3000/dev/note/n/${guid}`;
      this.setOptions();
      return this.httpClient.get(endpoint, this.options);
  }

    getNotes(start?): Observable<any> {
        // let path = STAGE + '/notes?limit=8';
        let path = 'http://localhost:3000/dev/notes?limit=5';

        if (start > 0) {
            path += '&start=' + start;
        }
        // let endpoint = API_ROOT + path;
        const endpoint = path;
        this.setOptions();
        return this.httpClient.get(endpoint, this.options);
    }
}
