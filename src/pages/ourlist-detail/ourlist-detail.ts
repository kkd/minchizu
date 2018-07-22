import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
  
  ourmap: DS_OurMaps = new DS_OurMaps;
  ourmapphotos: DS_OurMapPhotos[] = [];
  pkey: string = "";
  styles: {} = {"background-color": ""};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private omfs: OurMapsFirestoreProvider,
    private ompfs: OurMapPhotosFirestoreProvider,
  ) {
    this.pkey = this.navParams.get("pkey");
    
    if (this.navParams.hasOwnProperty("ourmap")){
      this.ourmap = this.navParams.get("ourmap");
    }else{
      this.omfs.getDocumentByPkey(this.pkey)
      .subscribe(val => {
        console.log("--- 2")
        val = val.payload.data();
        console.log(val)
        if (val.infoDate) val.infoDate = val.infoDate.toDate();
        this.ourmap = val;
      })
    }
  }

  ionViewDidLoad() {

    console.log("--- 3")
    // 背景色をセットする
    if (this.ourmap.oldFlg) this.setOldViewStyle();

    // 写真データを取得
    this.ompfs.parentDocPath = this.omfs.docPath(this.ourmap.pkey);
    this.ompfs.getAllData().subscribe(vals => {
      vals.map(val => {
        if (val.originDateTime) val.originDateTime = val.originDateTime.toDate();
        this.ourmapphotos.push(val);
      })
    })
  }
  
  // --------------------------------------------
  // 情報が古い事をお知らせする
  // --------------------------------------------
  confirmThisDataIsOld(event){
    let alert = this.alertCtrl.create({
      title: "実行しますか？",
      message: "情報提供ありがとうございます。<br>実行後は地図、一覧から非表示となります。<br>※検索条件で古い記事も表示するとしている場合は、古い事が分かるよう表示されるようになります（背景色がグレーになるなど）。",
      buttons: [
        {
            text: "キャンセル",
            handler: () => {
            }
        },{
            text: "実行する",
            handler: () => {
              this.omfs.data = this.ourmap;
              this.omfs.data.oldFlg = true;
              this.setOldViewStyle();
              this.omfs.update();
              this.omfs.new();
            }
        }]
    });
    alert.present();
  }
  
  setOldViewStyle(){
    this.styles["background-color"] = "#f4f4f4";
  }

}
