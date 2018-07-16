import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AgmMap, MouseEvent } from '@agm/core';

@IonicPage()
@Component({
  selector: 'page-editmap-map',
  templateUrl: 'editmap-map.html',
})
export class EditmapMapPage {

  defaultZoom: number = 12;
  lat: number = 33.51946;
  lng: number = 132.544758;
  zoom: number = this.defaultZoom;

  marker: marker = null;

  gmaps: any = null;

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
  ) {
  }

  ionViewDidLoad(){
    
    this.storage.get("map_lastposition")
    .then(vals =>{
      if (vals){
        this.lat = vals["lat"];
        this.lng = vals["lng"];
        this.zoom = vals["zoom"];
      }
    })
    
    // Google Map APIを使用するための準備
    this.agmMap.mapReady.subscribe(gmaps => {
      this.gmaps = gmaps;
    })
  }
  
  closeThis(event){
    this.viewCtrl.dismiss();
  }

  mapClicked($event: MouseEvent) {
    this.marker = null;
    this.marker = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    };
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    this.marker = null;
    this.marker = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    };
  }
  
  
  submit($event){
    this.viewCtrl.dismiss(this.marker);
  }
  
}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
