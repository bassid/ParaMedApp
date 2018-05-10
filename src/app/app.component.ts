import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BlankPage } from '../pages/blank/blank';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'New Incident', component: HomePage, icon: 'md-camera' },
      { title: 'Recent Incidents', component: BlankPage, icon: 'md-pulse' },
      { title: 'Aid Near Me', component: ListPage, icon: 'md-medkit' },
      { title: 'Information', component: ListPage, icon: 'md-information-circle' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    
    /* if (page.component == HomePage){
      this.nav.setRoot(page.component);
    }
    else{
      this.nav.push(page.component);
    } */

    this.nav.setRoot(page.component);
  }
}
