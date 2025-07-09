import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OverpassElement } from 'src/app/models/overpass';
import { radians } from 'src/app/utils/coordinates';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Seamark } from 'src/app/models/seamark';

@Component({
  selector: 'app-seamark-view',
  templateUrl: './seamark-view.page.html',
  styleUrls: ['./seamark-view.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    FormsModule,
  ],
})
export class SeamarkViewPage implements OnInit {
  @Input({ required: true })
  seamark!: Seamark;

  svgContent: SafeHtml = '';

  constructor(private readonly domSanitizer: DomSanitizer) {}

  ngOnInit() {
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(this.rawSvgStr(), 'image/svg+xml');

    const element = this.seamark;
    const keys = Object.keys(element.tags);
    if (keys.includes('seamark:light:colour')) {
      const sectorStart =
        Number.parseInt(element.tags[`seamark:light:sector_start`]) || 0;
      const sectorEnd =
        Number.parseInt(element.tags[`seamark:light:sector_end`]) || 359.99;
      const colour = element.tags[`seamark:light:colour`];

      this.addArc(sectorStart, sectorEnd, dom, this.color(colour));
    } else {
      const numberOfLights = keys.filter(
        (k) => k.startsWith('seamark:light:') && k.endsWith(':colour'),
      ).length;

      for (let i = 1; i <= numberOfLights; i++) {
        const sectorStart = Number.parseInt(
          element.tags[`seamark:light:${i}:sector_start`],
        );
        const sectorEnd = Number.parseInt(
          element.tags[`seamark:light:${i}:sector_end`],
        );
        const colour = element.tags[`seamark:light:${i}:colour`];

        console.log('addArc', i);

        this.addArc(sectorStart, sectorEnd, dom, this.color(colour));
      }
    }

    const newSvg = dom.documentElement.outerHTML;
    console.log('New SVG:', newSvg);
    this.svgContent = this.domSanitizer.bypassSecurityTrustHtml(newSvg);
  }

  private color(name: string) {
    switch (name) {
      case 'white':
        return '#fff';
      case 'red':
        return '#f00';
      case 'green':
        return '#0f0';
      case 'yellow':
        return '#ff0';
      default:
        console.log('Unknown color:', name);
        return '#000';
    }
  }

  private addArc(start: number, end: number, dom: Document, color: string) {
    const cx = 10;
    const cy = 10;
    const rx = 5;
    const ry = 5;

    const sectorStart = (start + 360) % 360;
    const sectorEnd = (end + 360) % 360;

    const diff = sectorEnd - sectorStart;
    // TODO: verstehen
    const largeArc = diff > 180 || (diff < 0 && diff > -180) ? 1 : 0;

    console.log(sectorEnd - sectorStart);
    console.log(`Sector Start: ${sectorStart}, Sector End: ${sectorEnd}`);

    // -90 da 0° in SVG nach rechts zeigt
    // +180 da OSM 0° nach Süden zeigt
    const sectorStartRad = radians(sectorStart - 90 + 180);
    const sectorEndRad = radians(sectorEnd - 90 + 180);

    const x1 = cx + rx * Math.cos(sectorStartRad);
    const y1 = cy + ry * Math.sin(sectorStartRad);

    const x2 = cx + rx * Math.cos(sectorEndRad);
    const y2 = cy + ry * Math.sin(sectorEndRad);

    console.log(`Sector Start: (${x1}, ${y1})`);
    console.log(`Sector End: (${x2}, ${y2})`);

    const arc = dom.createElement('path');
    arc.setAttribute('d', `M ${x1} ${y1} A 5 5 0 ${largeArc} 1 ${x2} ${y2}`);
    arc.setAttribute('stroke', color);
    arc.setAttribute('stroke-width', '1');
    arc.setAttribute('fill', 'none');

    const arcs = dom.querySelector('#arcs');
    arcs?.appendChild(arc);
  }

  private rawSvgStr() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
   <rect id="background" x="0.0" y="0.0" width="20.0" height="20.0" style="fill:#aad3df; fill-opacity:1;" />
   <ellipse id="center" style="fill:#000; fill-opacity:1; stroke:#000; stroke-width:1.0; stroke-opacity:0.5" cx="10.0" cy="10.0" rx="1.0" ry="1.0" />
   <g id="arcs"></g>
</svg>`;
  }
}
