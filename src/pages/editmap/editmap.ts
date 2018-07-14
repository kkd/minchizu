import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { OurMapsFirestoreProvider, CATEGORIES } from '../../providers/firestore/ourmaps';
import { OurMapPhotosFirestoreProvider } from '../../providers/firestore/ourmapphotos';

@IonicPage()
@Component({
  selector: 'page-editmap',
  templateUrl: 'editmap.html',
})
export class EditmapPage {
  
  CATEGORIES = CATEGORIES;

  latitude: number = null;
  longitude: number = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private el: ElementRef,
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    private omfs: OurMapsFirestoreProvider,
    private ompfs: OurMapPhotosFirestoreProvider,
  ) {
  }

  ionViewDidLoad() {
  }

  // --------------------------------------------
  // 投稿する
  // --------------------------------------------
  submit($event){
    
    let batch = this.afs.firestore.batch();

    this.omfs.data.publicFlg = true;
    this.omfs.data.infoDate = firebase.firestore.FieldValue.serverTimestamp();
    this.omfs.setlatlon(Number(this.latitude), Number(this.longitude));
    
    if (this.omfs.data.category){
      for (let a of CATEGORIES){
        for (let c of a["array"]){
          if (this.omfs.data.category == c["value"]){
            this.omfs.data.marker = c["marker"];
            break;
          }
        }
      }
    }
    
    let omref = this.omfs.batchset(batch);

    // 投稿内容をIndexedDBに保存しておく
    this.storage.get("myposts")
    .then(posts => {
      if (!posts) posts = [];
      posts.push(omref.path);
      this.storage.set("myposts", posts);
    })

    this.ompfs.parentDocPath = omref.path;
    this.ompfs.allbatchset(batch)
    .then(val => {
      return this.ompfs.allbatchset_URL(batch, val);
    }).then(() => {
      // コミット
      batch.commit();
      
      // 投稿完了メッセージ
      this.afterPostMessage();
    }).catch(error => {
      console.log(error)
    })

    //this.navCtrl.pop();
  }

  //-----------------------------------------------------------------
  // 画像ファイルのアップロード
  //-----------------------------------------------------------------
  uploadFile(event, index:number) {
    
    let files = event.target.files;
    if (files.length != 1) return;
    
    this.ompfs.new();
    this.ompfs.localUpload(files[0], index)
    .then(latlon => {
      if (!this.latitude || !this.longitude){
        if (latlon){
          this.latitude = latlon.latitude;
          this.longitude = latlon.longitude;
        }
      }
    })
  }
  
  //-----------------------------------------------------------------
  // ファイル選択画面を開く
  //-----------------------------------------------------------------
  openFileInput(index: number){
    let selector: string = "#fileinput" + index;
    this.el.nativeElement.querySelector(selector).click();
  }
  
  // --------------------------------------------
  // 画面をクリアする
  // --------------------------------------------
  clear(){
    this.ompfs.clear();
    this.latitude = null;
    this.longitude = null;
  }

  // --------------------------------------------
  // 投稿後のメッセージ
  // --------------------------------------------
  afterPostMessage(){

    let alert = this.alertCtrl.create({
      title: "投稿完了",
      message: "情報提供ありがとうございました！<br>投稿された内容は、地図、一覧から見ることができます",
      buttons: [
        {
            text: "閉じる",
            handler: () => {
              this.omfs.new();
              this.clear();
            }
        }]
    });
    alert.present();
  }
 

  
}
