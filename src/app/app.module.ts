import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
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

import { SettingsPageModule } from '../pages/settings/settings.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { OurmapPageModule } from '../pages/ourmap/ourmap.module';
import { OurlistPageModule } from '../pages/ourlist/ourlist.module';
import { OurlistDetailPageModule } from '../pages/ourlist-detail/ourlist-detail.module';
import { EditmapPageModule } from '../pages/editmap/editmap.module';
import { OurMapsFirestoreProvider } from '../providers/firestore/ourmaps';
import { OurMapPhotosFirestoreProvider } from '../providers/firestore/ourmapphotos';

import { PhotoProvider } from '../providers/photo/photo';
import { FireauthProvider } from '../providers/fireauth/fireauth';

// 日本語ロケール
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { GmapsProvider } from '../providers/gmaps/gmaps';
registerLocaleData(localeJa);

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
       name: environment.ionicstorage.name,
    }),
    TabsPageModule,
    OurmapPageModule,
    EditmapPageModule,
    SettingsPageModule,
    OurlistPageModule,
    OurlistDetailPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot(environment.googlemapConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: navigator.language },
    OurMapsFirestoreProvider,
    OurMapPhotosFirestoreProvider,
    PhotoProvider,
    FireauthProvider,
    GmapsProvider
  ]
})
export class AppModule {}
