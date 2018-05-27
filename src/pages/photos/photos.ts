import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';

import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {

  public thePhotos: any = [];
  public incidentID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public platform: Platform, public alertCtrl: AlertController) {

    this.thePhotos = this.navParams.get('photos');
    // this.thePhotos = ['https://yt3.ggpht.com/a-/AJLlDp0TFaxkKTbr1YMaEdj0KOLllMoFJcuWOIm4XA=s900-mo-c-c0xffffffff-rj-k-no'];

    if (this.navParams.get('incident')) {
      this.incidentID = "Incident #" + this.navParams.get('incident').id_num + " Photos";
    }
    else {
      this.incidentID = "New Incident Photos";
    }
  }


  closePhotos() {
    let data = this.thePhotos;
    this.viewCtrl.dismiss(data);
  }

  removePhoto(pic) {
    const index: number = this.thePhotos.indexOf(pic);
    if (index !== -1) {
      this.thePhotos.splice(index, 1);
    }
  }

  goToDetails() {

      let data = {
        photos: this.thePhotos,
        incident: this.navParams.get('incident')
      };

      this.navCtrl.push(DetailsPage, data);
    
  }
}
