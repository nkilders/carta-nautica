import { Component, OnInit } from '@angular/core';
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
  svgContent: SafeHtml;

  constructor(private readonly domSanitizer: DomSanitizer) {
    this.svgContent = this.domSanitizer.bypassSecurityTrustHtml(this.svgStr());
  }

  ngOnInit() {
    console.log('ngOnInit called');

    const domParser = new DOMParser();
    const dom = domParser.parseFromString(this.rawSvgStr(), 'image/svg+xml');

    this.addArc(194, 176, dom, '#f00');
    this.addArc(176, 194, dom, '#0f0');

    const newSvg = dom.documentElement.outerHTML;
    console.log('New SVG:', newSvg);
    this.svgContent = this.domSanitizer.bypassSecurityTrustHtml(newSvg);
  }

  private addArc(start: number, end: number, dom: Document, color: string) {
    const cx = 10;
    const cy = 10;
    const rx = 5;
    const ry = 5;

    const sectorStart = (start + 360) % 360;
    const sectorEnd = (end + 360) % 360;

    const largeArc =
      sectorEnd - sectorStart > 180 || sectorEnd - sectorStart < 0 ? 1 : 0;

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

  private svgStr() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg
   version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20"> <rect id="background" x="0.0" y="0.0" width="20.0" height="20.0" style="fill:#fff; fill-opacity:1;" /> <ellipse id="center" style="fill:#000; fill-opacity:1; stroke:#000; stroke-width:1.0; stroke-opacity:0.5" cx="10.0" cy="10.0" rx="1.0" ry="1.0" /> <g id="arcs"> <path id="arc0" d="M 10 5 A 5 5 0 0 1 10 15" stroke="#f00" stroke-width="1" fill="none" /> <path id="arc1" d="M 10 15 A 5 5 0 0 1 5 10" stroke="#0f0" stroke-width="1" fill="none" /> <path id="arc2" d="M 5 10 A 5 5 0 0 1 10 5" stroke="#00f" stroke-width="1" fill="none" /> </g>
</svg>`;
  }

  private rawSvgStr() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
   <rect id="background" x="0.0" y="0.0" width="20.0" height="20.0" style="fill:#fff; fill-opacity:1;" />
   <ellipse id="center" style="fill:#000; fill-opacity:1; stroke:#000; stroke-width:1.0; stroke-opacity:0.5" cx="10.0" cy="10.0" rx="1.0" ry="1.0" />
   <g id="arcs"></g>
</svg>`;
  }

  private overpassElement(): OverpassElement {
    return {
      type: 'node',
      id: 928624712,
      lon: 14.3021335,
      lat: 44.766398,
      tags: {
        man_made: 'beacon',
        'seamark:light:1:character': 'Fl',
        'seamark:light:1:colour': 'white',
        'seamark:light:1:group': '2',
        'seamark:light:1:height': '13',
        'seamark:light:1:period': '10',
        'seamark:light:1:range': '8',
        'seamark:light:1:sector_end': '176',
        'seamark:light:1:sector_start': '194',
        'seamark:light:1:sequence': '0.5+(2),0.5+(7)',
        'seamark:light:2:character': 'Fl',
        'seamark:light:2:colour': 'red',
        'seamark:light:2:group': '2',
        'seamark:light:2:height': '13',
        'seamark:light:2:period': '10',
        'seamark:light:2:range': '6',
        'seamark:light:2:sector_end': '194',
        'seamark:light:2:sector_start': '176',
        'seamark:light:2:sequence': '0.5+(2),0.5+(7)',
        'seamark:light:reference': 'E 2760',
        'seamark:name': 'Otocic Zecevo',
        'seamark:type': 'light_minor',
        source: 'US NGA Pub. 113. 2010-10-22.',
      },
    };
  }
}
