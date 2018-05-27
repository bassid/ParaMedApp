import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Http, Headers, HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PhotosPage } from '../pages/photos/photos';
import { DetailsPage } from '../pages/details/details';
import { BlankPage } from '../pages/blank/blank';
import { UpdateCamPage } from '../pages/update-cam/update-cam';
import { MapPage } from '../pages/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { GetDataProvider } from '../providers/get-data/get-data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PhotosPage,
    DetailsPage,
    BlankPage,
    UpdateCamPage,
    MapPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PhotosPage,
    DetailsPage,
    BlankPage,
    UpdateCamPage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Geolocation,
    NativeGeocoder, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetDataProvider,
  ]
})
export class AppModule {}
