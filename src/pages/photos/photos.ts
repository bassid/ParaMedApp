import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {

  // Declare variables
  private thePhotos: any = [];
  private incidentID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private platform: Platform) {

    // Get the photos captured from previous page
    this.thePhotos = this.navParams.get('photos');

    // Create title text for the modal
    if (this.navParams.get('incident')) {
      this.incidentID = "Incident #" + this.navParams.get('incident').id_num + " Photos";
    }
    else {
      this.incidentID = "New Incident Photos";
    }
  }

  // Close modal and pass any updated photos back to previous page
  closePhotos() {
    let data = this.thePhotos;
    this.viewCtrl.dismiss(data);
  }

  // Delete selected picture
  removePhoto(pic) {
    const index: number = this.thePhotos.indexOf(pic);
    if (index !== -1) {
      this.thePhotos.splice(index, 1);
    }
  }

  // Go to the Details page and pass the photos to it 
  goToDetails() {

      let data = {
        photos: this.thePhotos,
        incident: this.navParams.get('incident')
      };

      this.navCtrl.push(DetailsPage, data);
    
  }
}
