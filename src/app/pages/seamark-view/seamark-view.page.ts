import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { radians } from 'src/app/utils/coordinates';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonPopover,
  IonChip,
} from '@ionic/angular/standalone';
import { Seamark } from 'src/app/models/seamark';

type DisplayArc = {
  character: string;
  colorCode: string;
  colorName: string;
  d: string;
  height: number;
  period: number;
  range: number;
  sequence: string;
};

const cx = 10;
const cy = 10;
const rx = 5;
const ry = 5;

@Component({
  selector: 'app-seamark-view',
  templateUrl: './seamark-view.page.html',
  styleUrls: ['./seamark-view.page.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    FormsModule,
    IonChip,
  ],
})
export class SeamarkViewPage implements OnInit {
  @Input({ required: true })
  seamark!: Seamark;

  arcs: DisplayArc[] = [];
  selectedArc?: DisplayArc;

  constructor() {}

  ngOnInit() {
    this.generateArcs();
  }

  showDetailsOfArc(arc: DisplayArc) {
    // https://de.wikipedia.org/wiki/Befeuerung_(Seefahrt)
    this.selectedArc = arc;
  }

  private generateArcs() {
    const tags = this.seamark.tags;
    const keys = Object.keys(tags);

    if (keys.includes('seamark:light:colour')) {
      this.generateArcWithoutNumber();
    } else {
      const numberOfLights = keys.filter(
        (k) => k.startsWith('seamark:light:') && k.endsWith(':colour'),
      ).length;

      for (let i = 1; i <= numberOfLights; i++) {
        this.generateArcWithNumber(i);
      }
    }
  }

  private generateArcWithoutNumber() {
    const { tags } = this.seamark;

    const character = tags[`seamark:light:character`];
    const sectorStart =
      Number.parseInt(tags[`seamark:light:sector_start`]) || 0;
    const sectorEnd =
      Number.parseInt(tags[`seamark:light:sector_end`]) || 359.99;
    const height = Number.parseInt(tags[`seamark:light:height`]);
    const range = Number.parseInt(tags[`seamark:light:range`]);
    const period = Number.parseInt(tags[`seamark:light:period`]);
    const sequence = tags[`seamark:light:sequence`];
    const color = tags[`seamark:light:colour`];
    const d = this.buildSvgPath(sectorStart, sectorEnd);

    this.arcs.push({
      character,
      colorName: color,
      colorCode: this.colorCodeOf(color),
      d,
      height,
      period,
      range,
      sequence,
    });
  }

  private generateArcWithNumber(i: number) {
    const { tags } = this.seamark;

    const sectorStart = Number.parseInt(
      tags[`seamark:light:${i}:sector_start`],
    );
    const sectorEnd = Number.parseInt(tags[`seamark:light:${i}:sector_end`]);
    const color = tags[`seamark:light:${i}:colour`];
    const sequence = tags[`seamark:light:${i}:sequence`];
    const character = tags[`seamark:light:${i}:character`];
    const height = Number.parseInt(tags[`seamark:light:${i}:height`]);
    const range = Number.parseInt(tags[`seamark:light:${i}:range`]);
    const period = Number.parseInt(tags[`seamark:light:${i}:period`]);
    const d = this.buildSvgPath(sectorStart, sectorEnd);

    console.log('addArc', i);

    this.arcs.push({
      colorName: color,
      colorCode: this.colorCodeOf(color),
      d,
      character,
      height,
      range,
      period,
      sequence,
    });
  }

  private colorCodeOf(colorName: string) {
    switch (colorName) {
      case 'white':
        return '#ffffff';
      case 'red':
        return '#ea2027';
      case 'green':
        return '#009432';
      case 'yellow':
        return '#ffc312';
      default:
        console.error('Unknown color:', colorName);
        return '#000000';
    }
  }

  private buildSvgPath(start: number, end: number) {
    const { x1, y1, x2, y2, largeArc } = this.calculateArc(start, end);
    const rotation = 0;
    const sweep = 1;

    return `M ${x1} ${y1} A ${rx} ${ry} ${rotation} ${largeArc} ${sweep} ${x2} ${y2}`;
  }

  private calculateArc(start: number, end: number) {
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

    return {
      x1,
      y1,
      x2,
      y2,
      largeArc,
    };
  }
}
