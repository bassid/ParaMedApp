import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { GetDataProvider } from '../../providers/get-data/get-data';

import { UpdateCamPage } from '../update-cam/update-cam';

@IonicPage()
@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html',
})
export class BlankPage {

  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    public dataService: GetDataProvider, public alertCtrl: AlertController, private zone: NgZone, private changeDetector: ChangeDetectorRef) {

  }

  ionViewDidLoad() {

    this.storage.get('recents').then((val) => {

      this.zone.run(() => {
        if (val) {
          this.data = val.ids;
          this.changeDetector.detectChanges();
        }
        else {
          this.data = null;
          this.changeDetector.detectChanges();
        }
      });

    });

  }

  goToIncident(incident) {
    let data = {
      incident: incident
    }
    this.navCtrl.setRoot(UpdateCamPage, data);
  }

  deleteAlert(incident) {

    let confirmation = this.alertCtrl.create({
      title: 'Delete Incident?',
      subTitle: "This record will be permanently removed from this device. You will not be able to send us updates on this incident.",
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            // alert("Deleted");

            this.storage.get('recents').then((val) => {

              let storedIncidents = val;

              // Get the existing incident data
              let findRecord = storedIncidents.ids.find(x => x.id_num === incident.id_num);
              let indexOfRecord = storedIncidents.ids.findIndex(x => Object.is(findRecord, x));

              // Store updated dataset back on device
              storedIncidents.ids.splice(indexOfRecord, 1);
              this.storage.set('recents', storedIncidents)

              this.ionViewDidLoad();

            })
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirmation.present();
  }

}
