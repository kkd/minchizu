import { Observable } from 'rxjs/Rx';

// Firestore
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

import { FireauthProvider } from '../../providers/fireauth/fireauth';

export class DSBase{
  uid: string = "";
  createdAt: any = null;
  createdUid: string = "";
  pkey: string = "";
  updatedAt: any = null;
  updatedUid: string = "";
}

export class FirestoreBase {
  
  data: any;
  collectionName: string = "";

  constructor(
    public afs: AngularFirestore,
    public auth: FireauthProvider,
  ){
  }
  
  get collectionPath(): string{
    return this.collectionName;
  }
  
  public docPath(pkey: string): string{
    // 各クラスで定義すること
    return this.collectionPath + "/" + pkey;
  }
  
  get pkey(): string{
    if (this.data.pkey == ""){
      // 未設定の場合は生成する
      return this.makePkey();
    }else{
      return this.data.pkey;
    }
  }
  
  public makePkey(): string{
    console.log("エラー 各クラスで定義が必要です")
    return "";
  }

  public makePkey4Get(...keys: any[]): string{
    let ret: string = "";
    for(let key of keys){
      if (ret != "") ret += "::";
      ret += key;
    }
    return ret;
  }

  // --------------------------------------------
  // docPath指定で情報を取得する
  // --------------------------------------------
  public getDocumentByDocPath(docPath: string): Observable<any> {
    return this.afs.doc<any>(docPath).snapshotChanges();
  }

  // --------------------------------------------
  // pkey指定で情報を取得する
  // --------------------------------------------
  public getDocumentByPkey(pkey: string): Observable<any> {
    return this.afs.collection<any>(this.collectionPath).doc(pkey).snapshotChanges();
  }

  // --------------------------------------------
  // Angularfire2に引き渡せる形に変換
  // --------------------------------------------
  public getAssociativeArrayData(){
    let ret = {};
    for (let key in this.data){
      if (key == "constructor") continue;
      ret[key] = this.data[key];
    }
    
    return ret;
  }

  // --------------------------------------------
  // データ登録の共通処理 / add、setから呼び出す
  // --------------------------------------------
  public _addCommon(){
    if (this.data.pkey == ""){
      // 新規登録の場合
      this.data.pkey = this.pkey;
      this.data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      this.data.createdUid = this.auth.uid;
      this.data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      this.data.updatedUid = this.auth.uid;
    }else{
      // 更新の場合
      this._updateCommon();
    }
  }

  // --------------------------------------------
  // データ更新の共通処理 / updateから呼び出す
  // --------------------------------------------
  public _updateCommon(){
    this.data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    this.data.updatedUid = this.auth.uid;
  }

  // --------------------------------------------
  // データ追加、更新（キー情報指定）
  // --------------------------------------------
  public addset(): Promise<void> {
    this._addCommon();
    return this.afs.collection<any>(this.collectionPath).doc(this.data.pkey).set(this.getAssociativeArrayData());
  }

  // --------------------------------------------
  // データ追加、更新（バッチ用）
  // --------------------------------------------
  public batchset(batch: any): any{
    this._addCommon();
    let ref = this.afs.firestore.collection(this.collectionPath).doc(this.data.pkey);
    batch.set(ref, this.getAssociativeArrayData());
    return ref;
  }

  // --------------------------------------------
  // データ追加、更新（キー情報指定）
  // --------------------------------------------
  public addset2(): Observable<void> {
    this._addCommon();
    return Observable.fromPromise(this.afs.collection<any>(this.collectionPath).doc(this.data.pkey).set(this.getAssociativeArrayData()));
  }

  // --------------------------------------------
  // データ変更
  // ※dataを読み込み済みである前提
  // --------------------------------------------
  public update():Promise<any> {
    this._updateCommon();
    return this.afs.collection(this.collectionPath).doc(this.data.pkey).update(this.getAssociativeArrayData());
  }
}
