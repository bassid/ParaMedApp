import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
// import { Sim } from '@ionic-native/sim';

// import moment from 'moment';

// import { faker } from 'faker';

declare var google;



@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  category: any;
  desc: any;
  photoList: any = [];

  map: any;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  geocoder: any;
  markers: any = [];
  placesService: any;
  saveDisabled: boolean;
  posLoc: any = {};
  address: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private geolocation: Geolocation, public alertCtrl: AlertController, public zone: NgZone) {

    this.photoList = this.navParams.get('photos');
  }

  goToPhotos() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.location();
  }

  location() {
    // Get current location
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {

      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }

      this.posLoc = pos;

      // Create map options
      let latLng = new google.maps.LatLng(pos.lat, pos.lng);
/* 
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'latLng': latLng
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {

              // alert(JSON.stringify(results[0].formatted_address));
              this.address = results[0].formatted_address;
              alert(this.address);

          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      }); */

      let mapOptions = {
        center: latLng,
        zoom: 15.5,
        mapTypeID: google.maps.MapTypeId.ROADMAP,
        draggable: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false
      }

      // Create map
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Create marker options
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: 'Me!'
      });

      // Create marker
      this.markers.push(marker);
      this.map.setCenter(latLng);

    });
  }



  submit() {
    /* 
        // let currentDateTime = moment().format("MM-DD-YYYY HH:mm:ss");

        const data = {
          name: person,
          location: JSON.stringify(this.posLoc),
          description: this.desc,
          tag: this.category,
          // dateTime: currentDateTime,
          images: this.photoList
        };
    
        const pushRef = this.myData.push(data);
    
        pushRef.set(data).then(function () {
    
          let alert = this.alertCtrl.create({
            title: 'Help is on the way!',
            subTitle: 'Your issue has been recorded',
            buttons: ['Done']
          });
          alert.present()
    
          alert("Help is on the way!");
    
        }); */

    let alert = this.alertCtrl.create({
      title: 'Incident Reported',
      subTitle: 'Help is on the way! Your incident ID is:\n' + '#023281',
      buttons: ['Done']
    });
    alert.present();

    this.navCtrl.popAll();


  }

}
