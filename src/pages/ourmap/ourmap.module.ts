import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OurmapPage } from './ourmap';
import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OurmapPage,
  ],
  imports: [
    IonicPageModule.forChild(OurmapPage),
    AgmCoreModule,
    PipesModule,
  ],
})
export class OurmapPageModule {}
