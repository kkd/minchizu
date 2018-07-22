import { Component, ViewChild, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { AgmMap, LatLngBounds } from '@agm/core';
declare var google: any;

import { OurMapsFirestoreProvider, DS_OurMaps } from '../../providers/firestore/ourmaps';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-ourmap',
  templateUrl: 'ourmap.html',
})
export class OurmapPage {

  defaultZoom: number = 12;
  lat: number = 33.51946;
  lng: number = 132.544758;
  zoom: number = this.defaultZoom;

  gmaps: any = null;
  
  //ourmaps: Observable<DS_OurMaps[]>;
  ourmaps: DS_OurMaps[];
  
  mapPosInterval: any = null;
  
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private omfs: OurMapsFirestoreProvider,
    private renderer2: Renderer2,
    //private el: ElementRef,
    private storage: Storage,
    public popoverCtrl: PopoverController,
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
      let myMarker = new google.maps.Marker({
        map: this.gmaps,
        animation: google.maps.Animation.DROP,
        icon: "../../../assets/mapmarker/skyblue.png",
      });

      this.addYourLocationButton(this.gmaps, myMarker);
      //this.el.nativeElement.querySelector("#locationButton").click();
      
      this.displayMap();
      
    })

  }
  
  ionViewDidEnter(){
    this.mapPosInterval = setInterval(() =>{
      this.registMapInfo();
    }, 1000)
  }
  
  ionViewWillLeave(){
    clearInterval(this.mapPosInterval);
  }
  
  // --------------------------------------------
  // ブラウザ終了時
  // --------------------------------------------
  /*
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    this.registMapInfo();
  }
  */

  // --------------------------------------------
  // ページ移動前
  // --------------------------------------------
  /*
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    this.registMapInfo();
  }
  */

  registMapInfo(){
    this.storage.set("map_lastposition", {
      lat: this.gmaps.center.lat(),
      lng: this.gmaps.center.lng(),
      zoom: this.gmaps.zoom,
    });
  }

  // --------------------------------------------
  // 地図情報を表示する
  // --------------------------------------------
  displayMap(){
    // 初期化
    this.ourmaps = [];
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    
    this.storage.get("searchsettings")
    .then(searchsettings => {
      
      let getdata: any = null;
      
      if (searchsettings){
        if (searchsettings.isOldDataDisplay){
          getdata = this.omfs.getAllPublicData(true);
        }else{
          getdata = this.omfs.getAllPublicData(false);
        }
        
      }else{
        getdata = this.omfs.getAllPublicData(false);
      }

      // 表示対象データ
      getdata.subscribe(vals => {
        this.ourmaps = [];
        vals.map(val => {
          // 位置情報が設定されているデータのみ
          if (val.latlon){
            let category = this.omfs.getMarkerInfo(val.category);
  
            if (category){
              if (category["icon"]){
                val["iconUrl"] = {
                                    url: '../../../assets/mapmarker/' + category["icon"] + '.png',
                                    scaledSize: {width: 20, height: 20}
                                }
              }
            }
            /*
            if (val.marker != ""){
              val["labeloption"] = {
                                    color: 'white',
                                    fontFamily: 'Fontawesome',
                                    text: val.marker,
                                  }
            }else{
              val["labeloption"] = {};
            }
            */
  
            if (val.infoDate) val.infoDate = val.infoDate.toDate();
  
            this.ourmaps.push(val);
            bounds.extend(new google.maps.LatLng(val.latlon.latitude, val.latlon.longitude));
          }
        })
        // 中心点の調整
        //this.gmaps.fitBounds(bounds);
    
      })

    })
  }

  private addYourLocationButton(map, marker) {

    const controlDiv = this.renderer2.createElement('div');
    const firstChild = this.renderer2.createElement('button');

    this.renderer2.setStyle(firstChild, 'backgroundColor',    '#fff');
    this.renderer2.setStyle(firstChild, 'border',             'none');
    this.renderer2.setStyle(firstChild, 'outline',            '#none');
    this.renderer2.setStyle(firstChild, 'width',              '28px');
    this.renderer2.setStyle(firstChild, 'height',             '28px');
    this.renderer2.setStyle(firstChild, 'borderRadius',       '2px');
    this.renderer2.setStyle(firstChild, 'boxShadow',          '0 1px 4px rgba(0,0,0,0.3)');
    this.renderer2.setStyle(firstChild, 'cursor',             'pointer');
    this.renderer2.setStyle(firstChild, 'marginRight',        '10px');
    this.renderer2.setStyle(firstChild, 'padding',            '0px');
    firstChild.id = "locationButton";
    firstChild.title = "現在地";
    
    const secondChild = this.renderer2.createElement('div');
    this.renderer2.setStyle(secondChild, 'margin',            '5px');
    this.renderer2.setStyle(secondChild, 'width',             '18px');
    this.renderer2.setStyle(secondChild, 'height',            '18px');
    this.renderer2.setStyle(secondChild, 'backgroundImage',   'url(../../../assets/gmaps/mylocation-sprite-1x.png)');
    this.renderer2.setStyle(secondChild, 'backgroundSize',    '180px 18px');
    this.renderer2.setStyle(secondChild, 'backgroundPosition','0px 0px');
    this.renderer2.setStyle(secondChild, 'backgroundRepeat',  'no-repeat');
    secondChild.id = "location_img";
    this.renderer2.addClass(secondChild, 'secondchild');

    firstChild.appendChild(secondChild);
    controlDiv.appendChild(firstChild);
    
    google.maps.event.addListener(map, 'dragend', () => {
      this.renderer2.setStyle(secondChild, 'backgroundPosition','0px 0px');
    });
    
    firstChild.addEventListener('click', function() {
      let imgX = '0';
      let animationInterval = setInterval(() => {
        if(imgX == '-18') imgX = '0';
        else imgX = '-18';
        this.renderer2.setStyle(secondChild, 'backgroundPosition',imgX+'px 0px');
      }, 500);

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          marker.setPosition(latlng);
          map.setCenter(latlng);
          clearInterval(animationInterval);
          this.renderer2.setStyle(secondChild, 'backgroundPosition','-144px 0px');
        });
      }else{
        clearInterval(animationInterval);
        this.renderer2.setStyle(secondChild, 'backgroundPosition','0px 0px');
      }
    });

    //controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }

  // --------------------------------------------
  // 検索画面を表示する
  // --------------------------------------------
  searchPopOver(myEvent) {
    let popover = this.popoverCtrl.create("SearchPage", {kbn:"map"});
    popover.onDidDismiss(data =>{
      if (data){
        this.displayMap();
      }
    })
    
    popover.present({
      ev: myEvent
    });
  }
}
