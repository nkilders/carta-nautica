import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Map', url: '/map', icon: 'map' },
    { title: 'Tracks', url: '/tracks', icon: 'analytics' },
    { title: 'Settings', url: '/settings', icon: 'settings' }
  ];
  
  constructor() {}
}
