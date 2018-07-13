import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

import { AgmCoreModule } from '@agm/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

// 環境の切り替え
import { environment } from "@app/environment";

import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { OurmapPage } from '../pages/ourmap/ourmap';
import { OurlistPage } from '../pages/ourlist/ourlist';
import { EditmapPage } from '../pages/editmap/editmap';
import { OurMapsFirestoreProvider } from '../providers/firestore/ourmaps';
import { OurMapPhotosFirestoreProvider } from '../providers/firestore/ourmapphotos';

import { PhotoProvider } from '../providers/photo/photo';
import { FireauthProvider } from '../providers/fireauth/fireauth';

@NgModule({
  declarations: [
    MyApp,
    OurmapPage,
    EditmapPage,
    SettingsPage,
    OurlistPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
       name: environment.ionicstorage.name,
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot(environment.googlemapConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OurmapPage,
    EditmapPage,
    SettingsPage,
    OurlistPage,
    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OurMapsFirestoreProvider,
    OurMapPhotosFirestoreProvider,
    PhotoProvider,
    FireauthProvider
  ]
})
export class AppModule {}
