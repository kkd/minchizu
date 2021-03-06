import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

// Firestore
import { FirestoreBase, DSBase } from './base';
import { AngularFirestore } from 'angularfire2/firestore';

import { FireauthProvider } from '../../providers/fireauth/fireauth';

export const CATEGORIES: {}[] = [
  {group: "生活", array: [
    {icon: "water",             name: "給水所",                     value: "water",           marker: "\uf043"},
    {icon: "bath",              name: "入浴施設",                   value: "bath",            marker: "\uf2cd"},
    {icon: "laundory",          name: "洗濯",                       value: "laundory",        marker: "L"},
    {icon: "meal",              name: "炊き出し",                   value: "meal",            marker: "\uf2e7"},
  ]},
  {group: "一般", array:[
    {icon: "stop",              name: "通行止め",                   value: "stop",            marker: "\uf05e"},
    {icon: "transpotation",     name: "公共交通機関情報",           value: "transpotation",   marker: "\uf207"},
  ]},
  {group: "復興作業", array:[
    {icon: "volanteercenter",   name: "ボランティア募集/センター",  value: "volanteercenter", marker: "\uf004"},
    {icon: "reliefgoods",       name: "物資拠点",                   value: "reliefgoods",     marker: "\uf0d1"},
    {icon: "report",            name: "被害報告",                   value: "report",          marker: ""},
  ]},
];

export const TYPENAMES: string[] = [
  "administrative_area_level_1",
  "locality",
  "sublocality_level_2",
  "sublocality_level_3",
  "sublocality_level_4",
  "sublocality_level_5",
]

// --------------------------------------------------
// みんなの地図情報
// --------------------------------------------------
export class DS_OurMaps extends DSBase {
  infoDate: any = null;                     // 投降日時
  contributor: string = "";                 // 投稿者名
  email: string = "";                       // 投稿者のemailアドレス
  title: string = "";                       // タイトル
  category: string = "";                    // 情報のカテゴリー
  marker: string = "";                      // マーカー
  description: string = "";                 // 内容
  pref: string = ""                         // 県情報
  latlon: any = null;                       // 緯度経度
  publicFlg: boolean = false;               // 公開フラグ
  oldFlg: boolean = false;                  // 情報が古くなった
  viewPeriodFrom: string = null;            // 掲載期間（from）
  viewPeriodTo: string = null;              // 掲載期間（To）
  address: string = "";                     // 住所
  administrative_area_level_1: string = ""; // 都道府県
  locality: string = "";                    // 市町村
  sublocality_level_2: string = "";         //
  sublocality_level_3: string = "";         //
  sublocality_level_4: string = "";         //
  sublocality_level_5: string = "";         //
}

@Injectable()
export class OurMapsFirestoreProvider extends FirestoreBase{
    
  data: DS_OurMaps = new DS_OurMaps;
  collectionName: string = "OurMaps";
  
  constructor(
    public afs: AngularFirestore,
    public auth: FireauthProvider,
  ){
    super(afs, auth);
  }

  public makePkey(): string{
    return this.afs.createId();
  }

  public makePkey4Get(): string{
    return super.makePkey4Get();
  }

  public new() {
    this.data = new DS_OurMaps;
  }

  public setlatlon(lat?: number, lon?: number){
    if (lat != null && lon != null){
      this.data.latlon = new firebase.firestore.GeoPoint(lat, lon);
    }
  }

  public getAllPublicData(allFlg: boolean): Observable<DS_OurMaps[]>{
    if (allFlg){
      // 古い情報も全て表示する場合
      return this.afs.collection<any>(
        this.collectionPath,
        ref =>
          ref
          .where("publicFlg", "==", true)
          .orderBy("infoDate", "desc")
        ).valueChanges();

    }else{
      
      return this.afs.collection<any>(
        this.collectionPath,
        ref =>
          ref
          .where("publicFlg", "==", true)
          .where("oldFlg", "==", false)
          .orderBy("infoDate", "desc")
        ).valueChanges();
    }
  }

  public getMarkerInfo(marker: string):{} | null{
    
    for (let group of CATEGORIES){
      for (let category of group["array"]){
         if (category["value"] == marker){
          return category;
        }
       
      }
    }
  }

}