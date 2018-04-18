import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

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
  quality: 100
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public picture: string;
  public photos: any = [];

  constructor(public navCtrl: NavController, private cameraPreview: CameraPreview,
    public menuCtrl: MenuController, public modalCtrl: ModalController) { }

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
      this.photos.push(this.picture);
    }, (err) => {
      alert(err);
    });
  }

  goToPhoto() {
    let modal = this.modalCtrl.create(PhotosPage, { photos: this.photos });

    modal.onDidDismiss((data) => {

      if (data) {
        this.photos = data;
        this.picture = this.photos[0];
      }

    })

    modal.present();
  }

  
} 