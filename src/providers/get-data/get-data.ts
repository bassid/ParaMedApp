import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetDataProvider {

  // Declare API URL
  private apiUrl = "https://afternoon-garden-45550.herokuapp.com";

  constructor(public http: Http) { }

  // Function to add date to the database
  addData(data) {

    // Create headers
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // POST request to the URL which adds new data to the database 
    return this.http.post(this.apiUrl + "/database/create", JSON.stringify(data), { headers: headers })
      .subscribe(res => {
        // alert("Response: " + JSON.stringify(res));
      }, (err) => {
        alert("Failed: " + err);
      });
  }

  // Function to update existing data on the database
  updateData(data) {

    // Create headers    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // POST request to the URL which update existing data in the database     
    return this.http.post(this.apiUrl + "/database/update", JSON.stringify(data), { headers: headers })
      .subscribe(res => {
        // alert("Response: " + JSON.stringify(res));
      }, (err) => {
        alert("Failed: " + err);
      });
  }

}
