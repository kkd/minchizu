import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditmapMapPage } from './editmap-map';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    EditmapMapPage,
  ],
  imports: [
    IonicPageModule.forChild(EditmapMapPage),
    AgmCoreModule,
  ],
})
export class EditmapMapPageModule {}
