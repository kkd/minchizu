import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OurlistDetailPage } from './ourlist-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OurlistDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OurlistDetailPage),
    PipesModule,
  ],
})
export class OurlistDetailPageModule {}
