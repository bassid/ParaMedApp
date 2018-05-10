import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, HttpModule, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetDataProvider {

  apiUrl = "https://afternoon-garden-45550.herokuapp.com";

  constructor(public http: Http) { }

  addData(data) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + "/database/create", JSON.stringify(data), { headers: headers })
      .subscribe(res => {
        alert("Response: " + JSON.stringify(res));
      }, (err) => {
        alert("Failed: " + err);
      });
  }


  updateData(data) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + "/database/update", JSON.stringify(data), { headers: headers })
      .subscribe(res => {
        alert("Response: " + JSON.stringify(res));
      }, (err) => {
        alert("Failed: " + err);
      });
  }

}
