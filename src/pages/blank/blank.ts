import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { GetDataProvider } from '../../providers/get-data/get-data';

import { UpdateCamPage } from '../update-cam/update-cam';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html',
})
export class BlankPage {

  // Declaring variables
  private data: any;

  // Property used to store the callback of the event 
  // handler to unsubscribe to it when leaving this page
  private unregisterBackButtonAction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private dataService: GetDataProvider, private alertCtrl: AlertController, private zone: NgZone, 
    private changeDetector: ChangeDetectorRef, private platform: Platform) {

  }

  ionViewDidLoad() {

    // Set the android back button action
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => this.myHandlerFunction());        

    // Get incident from the 'recents' schema saved on device
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

  // Goes to UpdateCam page using the data of a particular incident
  goToIncident(incident) {
    let data = {
      incident: incident
    }
    this.navCtrl.setRoot(UpdateCamPage, data);
  }

  // Creates an alert message to delete an incident 
  deleteAlert(incident) {

    let confirmation = this.alertCtrl.create({
      title: 'Delete Incident?',
      subTitle: "This record will be permanently removed from this device. You will not be able to send us updates on this incident.",
      buttons: [
        {
          text: 'Delete',
          handler: () => {

            // Get the existing incident data            
            this.storage.get('recents').then((val) => {

              let storedIncidents = val;

              // Finds location of particular incident in schema
              let findRecord = storedIncidents.ids.find(x => x.id_num === incident.id_num);
              let indexOfRecord = storedIncidents.ids.findIndex(x => Object.is(findRecord, x));

              // Delete incident and store updated dataset back on device
              storedIncidents.ids.splice(indexOfRecord, 1);
              this.storage.set('recents', storedIncidents)

              // Calls function to reload the updated dataset
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

  // Android back button action
  myHandlerFunction(){    
    this.navCtrl.setRoot(HomePage);
  }

  // Unregisters android back button action before leaving page
  ionViewWillLeave(){
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();    
  }

}
