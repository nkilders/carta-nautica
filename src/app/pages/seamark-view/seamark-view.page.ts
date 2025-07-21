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
} from '@ionic/angular/standalone';
import { Seamark } from 'src/app/models/seamark';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type DisplayArc = {
  character: string;
  characterMeaning: string;
  characterDescription: string;
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
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class SeamarkViewPage implements OnInit {
  @Input({ required: true })
  seamark!: Seamark;

  arcs: DisplayArc[] = [];
  selectedArc?: DisplayArc;

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit() {
    this.generateArcs();
  }

  setSelectedArc(arc: DisplayArc) {
    this.selectedArc = arc;
  }

  isDefined(num: unknown) {
    return !Number.isNaN(num) && num !== undefined;
  }

  private generateArcs() {
    const tags = this.seamark.tags;
    const keys = Object.keys(tags);

    if (keys.includes('seamark:light:colour')) {
      this.generateArc();
    } else {
      const numberOfLights = keys.filter(
        (k) => k.startsWith('seamark:light:') && k.endsWith(':colour'),
      ).length;

      for (let i = 1; i <= numberOfLights; i++) {
        this.generateArc(i);
      }
    }

    this.selectedArc = this.arcs[0];
  }

  private generateArc(index?: number) {
    const i = index ? `:${index}:` : ':';

    const { tags } = this.seamark;

    const sectorStart =
      parseFloat(tags[`seamark:light${i}sector_start`]) || 0.0;
    const sectorEnd = parseFloat(tags[`seamark:light${i}sector_end`]) || 359.99;
    const d = this.buildSvgPath(sectorStart, sectorEnd);

    const character = tags[`seamark:light${i}character`];
    const color = tags[`seamark:light${i}colour`];
    const height = parseInt(tags[`seamark:light${i}height`]);
    const period = parseInt(tags[`seamark:light${i}period`]);
    const range = parseInt(tags[`seamark:light${i}range`]);
    const sequence = tags[`seamark:light${i}sequence`];

    console.log('addArc', i);

    this.arcs.push({
      character,
      characterDescription: this.characterDescriptionOf(character),
      characterMeaning: this.characterMeaningOf(character),
      colorName: this.colorTextOf(color),
      colorCode: this.colorCodeOf(color),
      d,
      height,
      range,
      period,
      sequence,
    });
  }

  private colorTextOf(colorName: string) {
    const c = colorName.toLowerCase();
    return this.translateService.instant(`color.${c}`);
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

  private characterMeaningOf(character: string) {
    const c = character.toLowerCase();
    return this.translateService.instant(
      `seamark.light.character.meaning.${c}`,
    );
  }

  private characterDescriptionOf(character: string) {
    const c = character.toLocaleLowerCase();
    return this.translateService.instant(
      `seamark.light.character.description.${c}`,
    );
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

    const diff = (sectorEnd - sectorStart + 360) % 360;
    const largeArc = diff > 180 ? 1 : 0;

    console.log('diff', diff);
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
