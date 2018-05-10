import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { MenuController } from 'ionic-angular';

import { PhotosPage } from '../photos/photos';

const cameraPreviewOpts: CameraPreviewOptions = {
  x: 0,
  y: 0,
  width: window.screen.width,
  height: window.screen.height,
  camera: 'rear',
  tapPhoto: true,
  previewDrag: true,
  toBack: true,
  alpha: 1
};


const pictureOpts: CameraPreviewPictureOptions = {
  quality: 70
}


@Component({
  selector: 'page-update-cam',
  templateUrl: 'update-cam.html'
})
export class UpdateCamPage {

  public picture: string;
  public photos: any = [];
  public jsonData: any = {};

  constructor(public navCtrl: NavController, private cameraPreview: CameraPreview,
    public menuCtrl: MenuController, public modalCtrl: ModalController, public navParams: NavParams) { 

      this.jsonData = this.navParams.get('incident');
      this.photos = this.jsonData.photos;
      this.picture = this.photos[0];
      // alert(JSON.stringify(this.jsonData));
    }

  ngAfterViewInit() {
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        // alert(err);
      });
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  takePicture() {
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.photos.unshift(this.picture);
    }, (err) => {
      alert(err);
    });
  }

  goToPhoto() {

    let data = {
      incident: this.jsonData,
      photos: this.photos
    }

    let modal = this.modalCtrl.create(PhotosPage, data);

    modal.onDidDismiss((data) => {

      if (data) {
        this.photos = data;
        this.picture = this.photos[0];
      }

    })

    modal.present();
  }

  
} 