import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';

// Firestore
import { FirestoreBase, DSBase } from './base';
import { AngularFirestore } from 'angularfire2/firestore';

// 画像を扱うJS
import * as loadImage from 'blueimp-load-image';
import { PhotoProvider } from '../photo/photo';

// --------------------------------------------------
// みんなの地図情報（写真）
// --------------------------------------------------
export class DS_OurMapPhotos extends DSBase {
  fullImage: string = "";           // フルサイズ画像のURL
  thumbnail: string = "";           // サムネイルのURL
  latlon: any = null;               // 緯度経度
  originDateTime: any = null;       // 撮影日時
  fileExtension: string = "";       // ファイル拡張子
  originFileName: string = "";      // 元ファイル名
  originSize: number = 0;           // 元ファイルサイズ
  country_code: string = ""         // 国コード
  pref: string = ""                 // 県情報
  address_info: any = {}            // リバースジオコーディングから返却された情報
}

@Injectable()
export class OurMapPhotosFirestoreProvider extends FirestoreBase{
  
  data: DS_OurMapPhotos = null;     // 現在処理中のデータ
  photos: DS_OurMapPhotos[] = [];   // 3つまで
  files: any[] = [];                // 画像データそのもの（3つまで）
  collectionName: string = "OurMapPhotos";
  
  parentDocPath: string = "";       // 親（OurMaps）のdocパス
    
  imgopts = {
    orientation: null,
    canvas: true,
    maxWidth: 800,
  };

  constructor(
    public afs: AngularFirestore,
    private afst: AngularFireStorage,
    private photopv: PhotoProvider,
    private storage: Storage,
  ){
    super(afs);
  }

  get collectionPath(): string{
    if (!this.parentDocPath) console.log("parentDocPathがセットされてない")
    return this.parentDocPath + "/" + this.collectionName;
  }
  
  public makePkey(): string{
    return this.afs.createId();
  }

  public makePkey4Get(): string{
    return super.makePkey4Get();
  }

  public new() {
    this.data = new DS_OurMapPhotos;
  }

  // 画像のアップロード先
  private getImageUploadPath(): string{
    if (!this.data.pkey) console.log("pkeyが決定していません")
    return this.collectionPath + "/" + this.data.pkey;
  }

  // 緯度
  get lat(): number{
    if (this.data.latlon){
      return this.data.latlon.latitude;
    }else{
      return null;
    }
  }
  
  // 経度
  get lon(): number{
    if (this.data.latlon){
      return this.data.latlon.longitude;
    }else{
      return null;
    }
  }

  private setlatlon(lat?: number, lon?: number){
    if (lat != null && lon != null){
      this.data.latlon = new firebase.firestore.GeoPoint(lat, lon);
    }
  }

  public clear(){
    this.data = null;
    this.photos = [];
    this.files = [];
  }

  // --------------------------------------------
  // バッチ登録＋アップロード
  // --------------------------------------------
  public allbatchset(batch: any): Promise<any> {
    let i:number = 0;
    let promises = [];
    
    this.photos.map(p => {
      let promise = new Promise((resolve, reject) => {
        this.data = p;
        this.batchset(batch);
        // base64からblobに変換する
        let blobImage = this.photopv.toBlob(this.files[i], p.fileExtension);
        // アップロードする
        let ref = this.afst.ref(this.getImageUploadPath());
        let task = ref.put(blobImage);
        resolve({data: p, ref: ref, task: task});
      });
      
      promises.push(promise);
      
      i += 1;
    })

    return Promise.all(promises);

  }

  // --------------------------------------------
  // バッチ Strage URL更新
  // --------------------------------------------
  public allbatchset_URL(batch: any, uploadret: {}[]): Promise<any> {
    let i:number = 0;
    let tasks = [];
    let promises = [];
    
    uploadret.map(val => tasks.push(val["task"]));
    
    uploadret.map(() =>{
      let promise = new Promise((resolve, reject) => {
        let task = uploadret[i]["task"];
        let ref = uploadret[i]["ref"];
        let data = uploadret[i]["data"];
        
        task.snapshotChanges().pipe(
          finalize(() => ref.getDownloadURL().subscribe(url => {
            this.data = data;
            this.data.fullImage = url;
            this.batchset(batch);
            resolve();
          }))
        ).subscribe();
      })
      promises.push(promise);
      i += 1;
    })
    
    return Promise.all(promises);
  }

  // --------------------------------------------
  // 仮画像ファイルアップロード（→IndexedDB）
  // --------------------------------------------
  public localUpload(file: File): Promise<string>{
    
    this.data = new DS_OurMapPhotos();
    
    return new Promise((resolve, reject) => {
      loadImage.parseMetaData(file, (data) => {
        this.data.originFileName = file.name;
        this.data.originSize = file.size;
        this.data.fileExtension = file.type;
    
        // exifを処理する
        let exif = data.exif;
        if (exif != undefined){
          // 回転
          if (exif.get("Orientation") != undefined) this.imgopts.orientation = exif.get("Orientation");
          // 撮影日時
          this.data.originDateTime = this.photopv.getExifOriginDateTime(exif);
          // 位置情報
          if (exif.get("GPSLongitude") != undefined && exif.get("GPSLatitude") != undefined){
            this.setlatlon(
              this.photopv.exifLatLon2Number(exif.get("GPSLatitude"), exif.get("GPSLatitudeRef")),
              this.photopv.exifLatLon2Number(exif.get("GPSLongitude"), exif.get("GPSLongitudeRef"))
            );
          }
        }

        // 回転＆ファイルサイズ変更
        return this.photopv.getDataUrl(file, this.imgopts)
        .then(base64 => {
          this.photos.push(this.data);
          this.files.push(base64);
          
          resolve();

        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    })
  }

}