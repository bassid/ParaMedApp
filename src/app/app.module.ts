import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Http, Headers, HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PhotosPage } from '../pages/photos/photos';
import { DetailsPage } from '../pages/details/details';
import { BlankPage } from '../pages/blank/blank';
import { UpdateCamPage } from '../pages/update-cam/update-cam';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Geolocation } from '@ionic-native/geolocation';
import { Sim } from '@ionic-native/sim';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { GetDataProvider } from '../providers/get-data/get-data';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PhotosPage,
    DetailsPage,
    BlankPage,
    UpdateCamPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PhotosPage,
    DetailsPage,
    BlankPage,
    UpdateCamPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Geolocation,
    Sim,
    NativeGeocoder, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetDataProvider,
    // Http,
    // HttpModule
  ]
})
export class AppModule {}
