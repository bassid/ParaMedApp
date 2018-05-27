import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';

declare var google;


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  // Property used to store the callback of the event 
  // handler to unsubscribe to it when leaving this page
  public unregisterBackButtonAction: any;

  // Google Maps variables
  map: any;
  service: any;
  infowindow: any;
  markers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  private geolocation: Geolocation, public platform: Platform) { }

  // Executes once the page has loaded
  ionViewDidLoad() {

    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => this.myHandlerFunction());    

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {

      // Get current user location
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }

      // Create map options
      let latLng = new google.maps.LatLng(pos.lat, pos.lng);
      let mapOptions = {
        center: latLng,
        zoom: 10.25,
        mapTypeID: google.maps.MapTypeId.ROADMAP,
        draggable: true,
        streetViewControl: true,
        fullscreenControl: false,
        clickableIcons: false
      }

      // Create map
      this.map = new google.maps.Map(document.getElementById('mainMap'), mapOptions);

      // Create marker options
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: 'assets/imgs/user-pin.png'
      });

      // Add infowindow to the marker
      google.maps.event.addListener(marker, 'click', function () {
        let infoWindow = new google.maps.InfoWindow({
          maxWidth: 200
        });
        infoWindow.setContent('My Location');
        infoWindow.open(this.map, this);
      });

      // Create marker
      this.markers.push(marker);
      this.map.setCenter(latLng);

      // Find hospitals in a 20km radius to the user's location
      this.service = new google.maps.places.PlacesService(this.map);
      this.service.nearbySearch({
        location: pos,
        radius: '20000',
        type: ['hospital']
      }, (results, status) => this.callback(results, status));
    })
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }

  // Creates markers for nearest hospitals
  createMarker(place) {
    if (place.name.includes("Hospital") || place.name.includes("Medical")){

      var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        icon: 'assets/imgs/pin.png'
      });

      var request = { reference: place.reference };
      let infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
      });
      this.service.getDetails(request, function(details, status) {
        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.setContent(
            '<div><strong>' + details.name + '</strong>' 
            + '<br>' + details.vicinity + '<br>' 
            + '<br> Ph: ' + details.formatted_phone_number + '<br>' 
            + '<br>' + '<a href="'+ details.website +'">Visit website</a>'
            + '</div>'
          );
          infoWindow.open(this.map, this);
        });
      });
    }
  }

  myHandlerFunction(){    
    this.navCtrl.setRoot(HomePage);
  }

  ionViewWillLeave(){
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();    
  }
}
