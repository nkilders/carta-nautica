import { Component, OnInit } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compass',
  templateUrl: './compass.page.html',
  styleUrls: ['./compass.page.scss'],
})
export class CompassPage implements OnInit {
  heading: number = 0;

  sub: Subscription;

  constructor(
    private devOrientation: DeviceOrientation,
  ) { }

  ngOnInit() {
    this.sub = this.devOrientation.watchHeading({
      frequency: 50,
    }).subscribe((data: DeviceOrientationCompassHeading) => {
      this.heading = data.trueHeading;

      const rotation = (360 - this.heading).toFixed(1);

      document.getElementById('compass').setAttribute('style', `transform: rotate(${rotation}deg);`);
    });
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }
}