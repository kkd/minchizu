import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CATEGORIES } from '../../providers/firestore/ourmaps';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  _categories = CATEGORIES;
  isOldDataDisplay: boolean = false;
  
  popoverKbn: string = "map";
  storagename: string = "searchsettings";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    public viewCtrl: ViewController,
  ) {
    this.popoverKbn = navParams.data.kbn;
  }

  ionViewDidLoad() {
    
    if (this.popoverKbn == "list") this.storagename = "searchsettings_list";
    
    this.storage.get(this.storagename)
    .then(searchsettings => {
      if (searchsettings) this.isOldDataDisplay = searchsettings.isOldDataDisplay;

      if (this.popoverKbn=="list"){
        // 一覧の場合
        if (searchsettings){
          // 検索条件保存されている場合
          searchsettings.categories.map(dspcategory => {
            for (let group of this._categories){
              for (let category of group["array"]){
                if (category["value"] == dspcategory){
                  category["isdisplay"] = true;
                  break;
                }
              }
            }
          })
        }else{
          // 検索条件保存されていない場合
          for (let group of this._categories){
            for (let category of group["array"]){
              category["isdisplay"] = true;
            }
          }
        }
      }

    })
  }
  
  // --------------------------------------------
  // 実行する
  // --------------------------------------------
  submit($event){
    
    let searchsettings: {} = {};

    if (this.popoverKbn=="list"){
      // 一覧の場合
      let dspcategories: string[] = [];
      this._categories.map(group =>{
        group["array"].map(category => {
          if (category["isdisplay"]){
            dspcategories.push(category["value"]);
          }
        })
      })
      searchsettings = {categories: dspcategories, isOldDataDisplay: this.isOldDataDisplay};
      this.storage.set(this.storagename, searchsettings);
    }else{
      // 地図の場合
      searchsettings = {isOldDataDisplay: this.isOldDataDisplay};
      this.storage.set(this.storagename, searchsettings);
    }

    this.viewCtrl.dismiss(searchsettings);
  }

}
