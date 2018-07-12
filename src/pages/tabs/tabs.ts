import { Component } from '@angular/core';

import { OurmapPage } from '../ourmap/ourmap';
import { EditmapPage } from '../editmap/editmap';
import { AboutPage } from '../about/about';
import { OurlistPage } from '../ourlist/ourlist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = OurmapPage;
  tab2Root = OurlistPage;
  tab3Root = EditmapPage;
  tab4Root = AboutPage;

  constructor() {

  }
}
