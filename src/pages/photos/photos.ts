import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';

import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {

  public thePhotos: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public platform: Platform, public alertCtrl: AlertController) {
    this.thePhotos = this.navParams.get('photos');
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

    if (this.thePhotos.length == 0) {
      let alert = this.alertCtrl.create({
        title: 'Take a snap!',
        subTitle: 'Please snap at least 1 photo of your situation',
        buttons: ['Ok']
      });
      alert.present();
    } else {

      let data = {
        photos: this.thePhotos
      };

      // this.viewCtrl.dismiss();
      this.navCtrl.push(DetailsPage, data);
    }
  }
}
