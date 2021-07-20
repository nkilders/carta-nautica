import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.page.html',
  styleUrls: ['./map-manager.page.scss'],
})
export class MapManagerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  show(tabName) {
    let tabs = document.getElementsByClassName('tabs');
    
    for(let t = 0; t < tabs.length; t++) {
      let tab = tabs.item(t);

      if(tab.classList.contains(tabName)) {
        tab.removeAttribute('hidden');
      } else {
        tab.setAttribute('hidden', '');
      }
    }
  }

  fabAddOnline(e) {
    console.log('fabAddOnline()');
  }

  fabAddOffline(e) {
    console.log('fabAddOffline()');
    
  }
}
