import * as Moment from 'moment';
import { Injectable } from '@angular/core';
// 画像を扱うJS
import * as loadImage from 'blueimp-load-image';

@Injectable()
export class PhotoProvider {

  constructor() {
  }

  // 拡張子を取得する
  public getExtension(filename: string): string{
    let ext = filename.split(".").pop();
    if (ext == undefined) ext = "";
    
    return ext;
  }
  
  // Exifの緯度もしくは経度を数値型で取得する
  public exifLatLon2Number(latlon: Array<number>, ref:string): number{
    
    let ret: number = latlon[0] + latlon[1] / 60 + latlon[2] / 3600;
    
    if (ref == "S" || ref == "W"){
      ret = ret * -1;
    }
    
    return ret;
  }
  
  // Exifからサマータイム考慮した撮影日時を取得する
  public getExifOriginDateTime(exif:any): any{
    
    //const dateformat = "YYYY:MM:DD";
    const datetimeformat = "YYYY:MM:DD HH:mm:ss";
  
    if (exif.get("DateTimeOriginal") != undefined){
      // 撮影日時
      let m = Moment(exif.get("DateTimeOriginal"), datetimeformat);
      return m.toDate();
    }
    
    return null;
  }
  
  // Exif
  public getExifArray(exif: Array<any>): any{
    
    for (let key in exif){
      if (exif[key] == null || exif[key] == undefined){
        // 削除する
        delete(exif[key]);
      }
    }
    
    return exif;
  }


  
  // base64 => blobに変換
  public toBlob(base64, type): Blob {
    let bin = atob(base64.replace(/^.*,/, ''));
    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
  
    // Blobを作成
    let blob: Blob;
    try{
      blob = new Blob([buffer.buffer], {
        type: type
      });
    }catch (e){
      return null;
    }
    return blob;
  }
  
  // 回転させる
  public getDataUrl(blobImage: Blob, options: Object): Promise<any> {
    return new Promise((resolve) => {
      loadImage(blobImage, (canvas) => {
        resolve(canvas.toDataURL(blobImage.type));
      }, options);
    });
  }
  

}
