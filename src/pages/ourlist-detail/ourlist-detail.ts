import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OurMapsFirestoreProvider, DS_OurMaps,  } from '../../providers/firestore/ourmaps';
import { OurMapPhotosFirestoreProvider, DS_OurMapPhotos } from '../../providers/firestore/ourmapphotos';

@IonicPage({
  segment: "detail/:pkey",
  defaultHistory: ["OurlistPage"]
})
@Component({
  selector: 'page-ourlist-detail',
  templateUrl: 'ourlist-detail.html',
})
export class OurlistDetailPage {
  
  ourmap: DS_OurMaps = null;
  ourmapphotos: DS_OurMapPhotos[] = [];
  pkey: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private omfs: OurMapsFirestoreProvider,
    private ompfs: OurMapPhotosFirestoreProvider,
  ) {
    this.ourmap = this.navParams.get("ourmap");
    this.pkey = this.navParams.get("pkey");
  }

  ionViewDidLoad() {
    // 写真データを取得
    this.ompfs.parentDocPath = this.omfs.docPath(this.ourmap.pkey);
    this.ompfs.getAllData().subscribe(vals => {
      this.ourmapphotos = vals;
    })
  }

}
