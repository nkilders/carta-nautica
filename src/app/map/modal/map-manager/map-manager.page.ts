import { Component, OnInit } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx'

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

  fabAddOnline() {
    // TODO: open dialog
  }

  fabAddOffline() {
    new FileChooser().open(/* add filter? */).then(
      uri => {
        console.log(uri);
        
        // TODO: validate & load map
      }
    ).catch(console.log);
    
  }
}
