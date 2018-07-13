import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { FireauthProvider } from '../providers/fireauth/fireauth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
    private platform: Platform, 
    private auth: FireauthProvider,
  ) {
    // アプリ初期化
    this.initializeApp();
  }
  
  initializeApp() {

    this.platform.ready().then(() => {
    });
    
    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (!user) {
            this.auth.signInAnonymously();
          }
        },
        () => {
          this.rootPage = 'LoginPage';
        }
      );
  }
  
}
