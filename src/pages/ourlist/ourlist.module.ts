import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OurlistPage } from './ourlist';

@NgModule({
  declarations: [
    OurlistPage,
  ],
  imports: [
    IonicPageModule.forChild(OurlistPage),
  ],
})
export class OurlistPageModule {}
