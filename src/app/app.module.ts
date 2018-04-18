import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PhotosPage } from '../pages/photos/photos';
import { DetailsPage } from '../pages/details/details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Geolocation } from '@ionic-native/geolocation';
import { Sim } from '@ionic-native/sim';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PhotosPage,
    DetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PhotosPage,
    DetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Geolocation,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
