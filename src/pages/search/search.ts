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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    
    this.storage.get("searchsettings")
    .then(searchsettings => {
      
      if (searchsettings){
        this.isOldDataDisplay = searchsettings.isOldDataDisplay;
        /*
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
        */
      }
    })
  }
  
  // --------------------------------------------
  // 実行する
  // --------------------------------------------
  submit($event){
    
    /*
    let dspcategories: string[] = [];
    
    this._categories.map(group =>{
      group["array"].map(category => {
        if (category["isdisplay"]){
          dspcategories.push(category["value"]);
        }
      })
    })

    this.storage.set("searchsettings", {categories: dspcategories, isOldDataDisplay: this.isOldDataDisplay});
    */
    
    let searchsettings: {} = {isOldDataDisplay: this.isOldDataDisplay};
    this.storage.set("searchsettings", searchsettings);
    
    this.viewCtrl.dismiss(searchsettings);
  }

}
