import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { OurMapsFirestoreProvider, DS_OurMaps, CATEGORIES } from '../../providers/firestore/ourmaps';
//import { OurMapPhotosFirestoreProvider } from '../../providers/firestore/ourmapphotos';
import { Storage } from '@ionic/storage';

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
    private storage: Storage,
    public popoverCtrl: PopoverController,
  ) {
  }

  ionViewDidLoad() {
    this.displayMap();
  }
  
  displayMap() {
    this.ourmaps = [];

    this.storage.get("searchsettings_list")
    .then(searchsettings => {
      
      let dspcategories = CATEGORIES;
      let getdata: any = this.omfs.getAllPublicData(false);
      
      if (searchsettings){
        if (searchsettings.isOldDataDisplay) getdata = this.omfs.getAllPublicData(true);
        if (searchsettings.categories) dspcategories = searchsettings.categories;
      }

      // 表示データを取得
      getdata.subscribe(vals => {
        this.ourmaps = [];
        vals.map(val => {
          // 絞り込み
          if (val.infoDate) val.infoDate = val.infoDate.toDate();
          
          if (searchsettings){
            // 条件の設定がある場合
            if (dspcategories.indexOf(val.category) > -1){
              this.ourmaps.push(val);
            }

          }else{
            // 条件の設定がない場合
            this.ourmaps.push(val);
          }
          
          
          
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
    })
    
  }

  // --------------------------------------------
  // 検索画面を表示する
  // --------------------------------------------
  searchPopOver(myEvent) {
    let popover = this.popoverCtrl.create("SearchPage", {kbn:"list"});
    popover.onDidDismiss(data =>{
      if (data){
        this.displayMap();
      }
    })
    
    popover.present({
      ev: myEvent
    });
  }
}
