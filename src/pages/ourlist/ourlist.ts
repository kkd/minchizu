import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OurMapsFirestoreProvider, DS_OurMaps,  } from '../../providers/firestore/ourmaps';
//import { OurMapPhotosFirestoreProvider } from '../../providers/firestore/ourmapphotos';

@IonicPage()
@Component({
  selector: 'page-ourlist',
  templateUrl: 'ourlist.html',
})
export class OurlistPage {
  
  ourmaps: DS_OurMaps[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private omfs: OurMapsFirestoreProvider,
    //private ompfs: OurMapPhotosFirestoreProvider,
  ) {
  }

  ionViewDidLoad() {
    this.displayMap();
  }
  
  displayMap() {
    this.ourmaps = [];
    this.omfs.getAllPublicData()
    .subscribe(vals => {
      this.ourmaps = [];
      vals.map(val => {
        if (val.infoDate) val.infoDate = val.infoDate.toDate();
        this.ourmaps.push(val);
        /*
        // 写真データを取得
        this.ompfs.parentDocPath = this.omfs.docPath(val.pkey);
        this.ompfs.getAllData().subscribe(vals => {
          val["photos"] = vals;
          this.ourmaps.push(val);
        })
        */
      })
    })
    
  }
}
