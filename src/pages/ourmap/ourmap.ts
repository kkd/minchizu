import * as Moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AgmMap, LatLngBounds } from '@agm/core';
declare var google: any;

import { OurMapsFirestoreProvider, DS_OurMaps } from '../../providers/firestore/ourmaps';
import { OurMapPhotosFirestoreProvider } from '../../providers/firestore/ourmapphotos';


@IonicPage()
@Component({
  selector: 'page-ourmap',
  templateUrl: 'ourmap.html',
})
export class OurmapPage {

  defaultZoom: number = 22;
  lat: number = 33.51946;
  lng: number = 132.544758;
  zoom: number = this.defaultZoom;

  gmaps: any = null;
  
  //ourmaps: Observable<DS_OurMaps[]>;
  ourmaps: DS_OurMaps[];
  
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private omfs: OurMapsFirestoreProvider,
    private ompfs: OurMapPhotosFirestoreProvider,
  ) {
  }

  ionViewDidLoad(){
    
    // Google Map APIを使用するための準備
    this.agmMap.mapReady.subscribe(gmaps => {
      this.gmaps = gmaps;
      this.displayMap();
    })
  }
  
  // --------------------------------------------
  // 地図情報を表示する
  // --------------------------------------------
  displayMap(){
    // 初期化
    this.ourmaps = [];
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    
    // 表示対象データ
    this.omfs.getAllPublicData()
    .subscribe(vals => {
      vals.map(val => {
        // 位置情報が設定されているデータのみ
        if (val.latlon){
          
          val["iconoption"] = {
                                fillColor: "blue",
                              }
          
          if (val.marker != ""){
            val["labeloption"] = {
                                  color: 'white',
                                  fontFamily: 'Fontawesome',
                                  text: val.marker,
                                }
          }else{
            val["labeloption"] = {};
          }

          val.infoDate = val.infoDate.toDate();

          this.ourmaps.push(val);
          bounds.extend(new google.maps.LatLng(val.latlon.latitude, val.latlon.longitude));
        }
      })
      // 中心点の調整
      this.gmaps.fitBounds(bounds);
    })

  }

}
