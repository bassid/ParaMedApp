import { Component } from '@angular/core';
import { ModalController, NavController, Platform, AlertController } from 'ionic-angular';
import { trigger,state,style,animate,transition,keyframes } from '@angular/animations';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { MenuController } from 'ionic-angular';

import { PhotosPage } from '../photos/photos';

const cameraPreviewOpts: CameraPreviewOptions = {
  x: 0,
  y: 0,
  width: window.screen.width,
  height: window.screen.height,
  camera: 'rear',
  tapPhoto: false,
  previewDrag: false,
  toBack: true,
  alpha: 1
};

const pictureOpts: CameraPreviewPictureOptions = {
  quality: 70,
  width: window.screen.width,
  height: window.screen.height
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('hideShowAnimator', [
        state('true' , style({ opacity: 0 })), 
        state('false', style({ opacity: 1 })),
        transition('0 => 1', animate('0.08s')),
        transition('1 => 0', animate('0.15s'))
    ])
  ]
})
export class HomePage {

  public picture: string;
  public photos: any = [];
  public alertPresented = false;
  private hideShowAnimator: boolean = true;  

  // Property used to store the callback of the event 
  // handler to unsubscribe to it when leaving this page
  public unregisterBackButtonAction: any;

  constructor(public navCtrl: NavController, private cameraPreview: CameraPreview,
    public menuCtrl: MenuController, public modalCtrl: ModalController, 
    private platform: Platform, private alertCtrl: AlertController) { 
      this.cameraPreview.setZoom(0);
  }


  async hideShowAnimation(){

    await new Promise(resolve => {
      setTimeout(()=> {
        this.hideShowAnimator = !this.hideShowAnimator;
        resolve();
      }, 500);
    });

    await new Promise(resolve => {
      setTimeout(()=> {
        this.hideShowAnimator = !this.hideShowAnimator;
        resolve();
      }, 500);
    });

  }

  ionViewDidLoad(){
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => this.myHandlerFunction());    
  }

  ionViewWillLeave(){
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();    
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
      this.hideShowAnimation().then((animated) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
        this.photos.unshift(this.picture);
      });
    }, (err) => {
      alert(err);
    });
  }

  goToPhoto() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();

    let modal = this.modalCtrl.create(PhotosPage, { photos: this.photos });

    modal.onDidDismiss((data) => {
      if (data) {
        this.photos = data;
        this.picture = this.photos[0];
      }
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => this.myHandlerFunction());   
    })
    modal.present();
  }

  async changeCamView(){

    await new Promise(resolve => {
      setTimeout(()=> {
        cameraPreviewOpts.camera = (cameraPreviewOpts.camera == 'rear') ? 'front' : 'rear';        
        resolve();
      }, 100);
    });

    await new Promise(resolve => {
      setTimeout(()=> {
        this.cameraPreview.stopCamera();        
        resolve();
      }, 100);
    });

    await new Promise(resolve => {
      setTimeout(()=> {
        this.ngAfterViewInit();      
        resolve();
      }, 100);
    });

  }

  myHandlerFunction(){
    if (!this.alertPresented){
      this.alertPresented = true;
      let alert = this.alertCtrl.create({
        subTitle: "Are you sure you want to exit?",
        buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
             this.alertPresented = false;
           }
         },
         {
           text: 'Exit',
           handler: () => {
             this.platform.exitApp();
           }
         }
        ]
      });
      alert.present(); 
     }
    }
} 