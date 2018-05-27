import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

import { GetDataProvider } from '../../providers/get-data/get-data';

declare var google;





@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  // Global variables
  mobileNum: string;
  bindedDesc: string;
  description: string;
  additionalInfo: string;
  photoList: any = [];
  incidentTitle: string;
  incidentID: string;
  update: boolean;

  // Google Maps variables
  map: any;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  geocoder: any;
  markers: any = [];
  placesService: any;
  saveDisabled: boolean;
  posLoc: any = {};
  address: string = "";



  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
    public alertCtrl: AlertController, public zone: NgZone, private storage: Storage,
    public dataService: GetDataProvider, private nativeGeocoder: NativeGeocoder) {

    // Get list of photos from previous page
    this.photoList = this.navParams.get('photos');

    // Check if new or existing incident
    if (this.navParams.get('incident')) {
      // alert('Updating!');
      this.update = true;

      // Get incident ID and use in the page title
      this.incidentID = this.navParams.get('incident').id_num
      this.incidentTitle = "Incident #" + this.incidentID + " Details";

      this.mobileNum = this.navParams.get('incident').phoneNumber;
    } 
    else {
      // alert('Creating!');
      this.update = false;

      // Use new incident in title
      this.incidentTitle = "New Incident";
    }
  }

  goToPhotos() {
    // Back to previous page
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    // Get location when the page loads
    this.location();
  }

  location() {
    // Get current location
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {

      // Get current user location
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }

      // Assign to global variable to use data in other functions
      this.posLoc = pos;

      // Create map options
      let latLng = new google.maps.LatLng(pos.lat, pos.lng);
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
        icon: 'assets/imgs/user-pin.png'
      });

      // Create marker
      this.markers.push(marker);
      this.map.setCenter(latLng);

      // Use reverse geocoding to get address
      this.nativeGeocoder.reverseGeocode(this.posLoc.lat, this.posLoc.lng)
        .then((result: NativeGeocoderReverseResult) => {
          this.setAddress(result);
          return;
        })
        .catch((error: any) => alert(error));
    });
  }

  setAddress(result) {
    // Get address of lat and long 
    result = result[0];
    this.address = result.subThoroughfare + " " + result.thoroughfare + ", " + result.locality + ", " +
      result.administrativeArea + ", " + result.postalCode;
  }


  submit() {

    if (this.address){
      // Get current date and time
    let currentDateTime: string = new Date().toString()
    let time = currentDateTime.substring(16, 24);
    let date = currentDateTime.substring(0, 15);

    // this.description = this.bindedDesc;

    // Check if we need to create or update an existing incident
    if (this.update) {
      // Check if description was provided
      if (this.additionalInfo) {
        // Update existing incident
        this.storage.get('recents').then((val) => {

          let storedIncidents = val;

          // Get the existing incident data
          let dataToStore = storedIncidents.ids.find(x => x.id_num === this.navParams.get('incident').id_num);
          let indexOfDataToStore = storedIncidents.ids.findIndex(x => Object.is(dataToStore, x));

          // Update incident attributes
          dataToStore.photos = this.photoList;
          dataToStore.latitude = this.posLoc.lat;
          dataToStore.longitude = this.posLoc.lng;
          dataToStore.address = this.address;
          dataToStore.phoneNumber = this.mobileNum;

          // Store updated dataset back on device
          storedIncidents.ids[indexOfDataToStore] = dataToStore;
          this.storage.set('recents', storedIncidents);
        });

        if (!this.mobileNum){
          this.mobileNum = "(No number was provided)";
        }
        if (!this.additionalInfo){
          this.additionalInfo = " ";
        }
        // Data to send to database
        let data = {
          incidentId: this.incidentID,
          phoneNumber: this.mobileNum,
          time: time,
          date: date,
          lastUpdatedTime: time,
          incidentDescription: "(Description Empty)",
          incidentLocation: this.address,
          additionalInfo: this.additionalInfo,
          photos: [],
          photos_base64: this.photoList,
          lat: this.posLoc.lat,
          lon: this.posLoc.lng
        };

        // POST the data to the database
        this.dataService.updateData(data);

        // alert(JSON.stringify(data));

        this.finish();
      }
      else {
        let extraInfoAlert = this.alertCtrl.create({
          title: 'No Information Provided',
          subTitle: 'Please provide us with brief description on what has changed since your last submission.',
          buttons: ['Done']
        });
        extraInfoAlert.present();
      }
    }
    else {

      // Generate a random ID for the new incident
      this.incidentID = Math.floor(100000 + Math.random() * 900000).toString();

      // Create the new incident
      this.storage.get('recents').then((val) => {

        // Check if it is the first incident being reported
        if (val) {
          // Dataset already exists. Add to the list
          let storedIncidents = val;

          let dataToStore = {
            id_num: this.incidentID,
            phoneNumber: this.mobileNum,
            time: currentDateTime,
            date: currentDateTime,
            lastUpdatedTime: currentDateTime,
            incidentDescription: this.description,
            incidentLocation: this.address,
            additionalInfo: "",
            photos: this.photoList,
            lat: this.posLoc.lat,
            lon: this.posLoc.lng
          }

          storedIncidents.ids.unshift(dataToStore);
          this.storage.set('recents', storedIncidents);
        }
        else {
          // This is the first incident stored. Begin a new dataset on device
          this.storage.set('recents',
            {
              ids:
                [{
                  id_num: this.incidentID,
                  phoneNumber: this.mobileNum,
                  time: currentDateTime,
                  date: currentDateTime,
                  lastUpdatedTime: currentDateTime,
                  incidentDescription: this.description,
                  incidentLocation: this.address,
                  additionalInfo: "",
                  photos: this.photoList,
                  lat: this.posLoc.lat,
                  lon: this.posLoc.lng
                }]
            });
        }

        if(!this.mobileNum){
          this.mobileNum = "(No number was provided)";
        }
        if(!this.bindedDesc){
          this.bindedDesc = "(No description provided)";
        }
        // Data to send to database
        let data = {
          incidentId: this.incidentID,
          phoneNumber: this.mobileNum,
          time: time,
          date: date,
          lastUpdatedTime: time,
          incidentDescription: this.bindedDesc,
          incidentLocation: this.address,
          additionalInfo: " ",
          photos: [],
          photos_base64: this.photoList,
          lat: this.posLoc.lat,
          lon: this.posLoc.lng
        };

        // POST the data to the database
        this.dataService.addData(data);

        // alert(JSON.stringify(data));

        this.finish();
      });
    }
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Location not received',
        subTitle: 'Your location was not found. Please ensure location service is enabled and press the "Find Me!" button',
        buttons: ['Ok']
      });
      alert.present();
    }
  }


  finish() {
    let confirmation = this.alertCtrl.create({
      title: 'Incident Reported',
      subTitle: 'Help is on the way! Your incident ID is: #' + this.incidentID + ". \n\nPlease call 000 immediately and keep us up-to-date from Recent Incidents menu!",
      buttons: ['Done']
    });
    confirmation.present();

    this.navCtrl.popAll();
  }
}