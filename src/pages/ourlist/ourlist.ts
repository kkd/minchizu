import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OurMapsFirestoreProvider, DS_OurMaps, CATEGORIES } from '../../providers/firestore/ourmaps';

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
  ) {
  }

  ionViewDidLoad() {
    
    this.omfs.getAllPublicData().subscribe(vals => {
      vals.map(val => {
        console.log(val)
        val.infoDate = val.infoDate.toDate();
        this.ourmaps.push(val);
      })
    })
  }
}
