import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonText,
  IonThumbnail,
  IonCol,
  IonListHeader,
  IonNote,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { SignGroup } from 'src/app/models/signs';

@Component({
  selector: 'app-signs',
  templateUrl: './signs.page.html',
  styleUrls: ['./signs.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonListHeader,
    IonCol,
    IonText,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail,
    TranslateModule,
  ],
})
export class SignsPage {
  protected signGroups: SignGroup[] = [
    {
      name: 'Verbotszeichen',
      signs: [
        {
          name: 'Verbot der Durchfahrt und Sperrung der Schifffahrt',
          image: this.url('a.1-1'),
        },
        {
          name: '',
          image: this.url('a.1-2'),
        },
        {
          name: '',
          image: this.url('a.1-3'),
        },
        {
          name: '',
          image: this.url('a.1-4'),
        },
        {
          name: '',
          image: this.url('a.1-5'),
        },
        {
          name: '',
          image: this.url('a.1-6'),
        },
        {
          name: 'Gesperrte Wasserflächen; jedoch für ein Kleinfahrzeug ohne Antriebsmaschine befahrbar.',
          image: this.url('a.1a'),
        },
        {
          name: 'Überholverbot, allgemein',
          image: this.url('a.2'),
        },
        {
          name: 'Überholverbot für Verbände untereinander und zwischen einem Verband und gekuppelten Fahrzeugen.',
          image: this.url('a.3'),
        },
        {
          name: 'Verbot des Begegnens und Überholens',
          image: this.url('a.4'),
        },
        {
          name: 'Stillliegeverbot auf der Seite der Wasserstraße, auf der das Tafelzeichen steht',
          image: this.url('a.5'),
        },
        {
          name: 'Stillliegeverbot auf der Wasserfläche, deren Breite, gemessen vom Aufstellungsort, auf dem Tafelzeichen in Metern angegeben ist',
          image: this.url('a.5.1'),
        },
        {
          name: 'Ankerverbot und Verbot des Schleifenlassens von Ankern, Trossen oder Ketten auf der Seite der Wasserstraße, auf der das Tafelzeichen steht',
          image: this.url('a.6'),
        },
        {
          name: 'Festmacheverbot am Ufer auf der Seite der Wasserstraße, auf der das Tafelzeichen steht',
          image: this.url('a.7'),
        },
        {
          name: 'Wendeverbot',
          image: this.url('a.8'),
        },
        {
          name: 'Vermeidung von Wellenschlag oder Sogwirkungen',
          image: this.url('a.9-1'),
        },
        {
          name: '',
          image: this.url('a.9-2'),
        },
        {
          name: 'Verbot, außerhalb der angezeigten Begrenzung zu fahren',
          image: this.url('a.10'),
        },
        {
          name: 'Verbot der Einfahrt, die Vorbereitungen zur Fortsetzung der Fahrt sind jedoch zu treffen',
          image: this.url('a.11'),
        },
        {
          name: 'Fahrverbot für ein Fahrzeug mit Maschinenantrieb',
          image: this.url('a.12'),
        },
        {
          name: 'Fahrverbot für ein Sportboot',
          image: this.url('a.13'),
        },
        {
          name: 'Verbot des Wasserskilaufens',
          image: this.url('a.14'),
        },
        {
          name: 'Fahrverbot für ein Segelfahrzeug',
          image: this.url('a.15'),
        },
        {
          name: 'Fahrverbot für ein Fahrzeug, das weder mit Maschinenantrieb noch unter Segel fährt',
          image: this.url('a.16'),
        },
        {
          name: 'Verbot des Segelsurfens',
          image: this.url('a.17'),
        },
        {
          name: 'Fahrverbot für ein Wassermotorrad (Waterscooter, Jetski usw.)',
          image: this.url('a.18'),
        },
        {
          name: 'Bade- und Schwimmverbot',
          image: this.url('a.20'),
        },
      ],
    },
    {
      name: 'Gebotszeichen',
      signs: [
        {
          name: 'Gebot, die durch den Pfeil angezeigte Richtung einzuschlagen',
          image: this.url('b.1'),
        },
        {
          name: 'Gebot, auf die Fahrwasserseite hinüberzufahren, die auf der Backbordseite des Fahrzeugs liegt',
          image: this.url('b.2a'),
        },
        {
          name: 'Gebot, auf die Fahrwasserseite hinüberzufahren, die auf der Steuerbordseite des Fahrzeugs liegt',
          image: this.url('b.2b'),
        },
        {
          name: 'Gebot, die Fahrwasserseite zu halten, die auf der Backbordseite des Fahrzeugs liegt',
          image: this.url('b.3a'),
        },
        {
          name: 'Gebot, die Fahrwasserseite zu halten, die auf der Steuerbordseite des Fahrzeugs liegt',
          image: this.url('b.3b'),
        },
        {
          name: 'Gebot, das Fahrwasser nach Backbord zu überqueren',
          image: this.url('b.4a'),
        },
        {
          name: 'Gebot, das Fahrwasser nach Steuerbord zu überqueren',
          image: this.url('b.4b'),
        },
        {
          name: 'Gebot, unter bestimmten Bedingungen anzuhalten',
          image: this.url('b.5'),
        },
        {
          name: 'Gebot, die angegebene Geschwindigkeit gegenüber dem Ufer (in km/h) nicht zu überschreiten',
          image: this.url('b.6'),
        },
        {
          name: 'Gebot, Schallzeichen zu geben',
          image: this.url('b.7'),
        },
        {
          name: 'Gebot, besondere Vorsicht walten zu lassen',
          image: this.url('b.8'),
        },
        {
          name: 'Gebot, nur dann in die Hauptwasserstraße einzufahren oder sie zu überqueren, wenn dadurch ein Fahrzeug auf der Hauptwasserstraße nicht gezwungen wird, seinen Kurs oder seine Geschwindigkeit zu ändern',
          image: this.url('b.9a'),
        },
        {
          name: '',
          image: this.url('b.9b'),
        },
        {
          name: 'Gebot, Sprechfunk zu benutzen',
          image: this.url('b.11a-1'),
        },
        {
          name: '',
          image: this.url('b.11a-2'),
        },
        {
          name: 'Gebot, Sprechfunk auf dem angegebenen Kanal zu benutzen',
          image: this.url('b.11b-1'),
        },
        {
          name: '',
          image: this.url('b.11b-2'),
        },
        {
          name: 'Gebot zur Nutzung von Landstromanschlüssen',
          image: this.url('b.12'),
        },
      ],
    },
    {
      name: 'Zeichen für Einschränkungen',
      signs: [
        {
          name: 'Die Fahrwassertiefe ist begrenzt.',
          image: this.url('c.1'),
        },
        {
          name: 'Die lichte Höhe über dem Wasserspiegel ist begrenzt.	',
          image: this.url('c.2'),
        },
        {
          name: 'Die Breite der Durchfahrtsöffnung oder des Fahrwassers ist begrenzt.',
          image: this.url('c.3'),
        },
        {
          name: 'Es bestehen Schifffahrtsbeschränkungen; sie sind auf einem zusätzlichen Schild unter dem Schifffahrtszeichen angegeben.',
          image: this.url('c.4'),
        },
        {
          name: 'Das Fahrwasser ist am rechten (linken) Ufer eingeengt; die Zahl auf dem Zeichen gibt den Abstand in Metern an, in dem sich ein Fahrzeug vom Tafelzeichen entfernt halten muss.',
          image: this.url('c.5'),
        },
      ],
    },
    {
      name: 'Empfehlende Zeichen',
      signs: [
        {
          name: 'Empfohlene Durchfahrtsöffnung für Verkehr in beiden Richtungen;',
          image: this.url('d.1a'),
        },
        {
          name: 'Empfohlene Durchfahrtsöffnung für Verkehr nur in Richtung, in der die Zeichen sichtbar sind',
          image: this.url('d.1b-1'),
        },
        {
          name: '',
          image: this.url('d.1b-2'),
        },
        {
          name: 'Empfehlung, sich in dem durch die Tafeln begrenzten Raum zu halten',
          image: this.url('d.2'),
        },
        {
          name: 'Empfehlung, in die Richtung des Pfeils zu fahren;',
          image: this.url('d.3'),
        },
      ],
    },
    {
      name: 'Hinweiszeichen',
      signs: [
        {
          name: 'Erlaubnis zur Durchfahrt',
          image: this.url('e.1'),
        },
        {
          name: 'Kreuzung einer Hochspannungsleitung',
          image: this.url('e.2'),
        },
        {
          name: 'Hinweis auf ein Wehr',
          image: this.url('e.3'),
        },
        {
          name: 'Nicht frei fahrende Fähre',
          image: this.url('e.4a'),
        },
        {
          name: 'Frei fahrende Fähre',
          image: this.url('e.4b'),
        },
        {
          name: 'Erlaubnis zum Stillliegen auf der Seite der Wasserstraße, auf der das Zeichen steht',
          image: this.url('e.5'),
        },
        {
          name: 'Erlaubnis zum Stillliegen auf der Wasserfläche, deren Breite, gemessen vom Aufstellungsort, auf dem Tafelzeichen in Metern angegeben ist',
          image: this.url('e.5.1'),
        },
        {
          name: 'Erlaubnis zum Stillliegen auf der Wasserfläche zwischen den zwei Entfernungen, die, gemessen vom Aufstellungsort, auf dem Tafelzeichen in Metern angegeben sind',
          image: this.url('e.5.2'),
        },
        {
          name: 'Höchstzahl der Fahrzeuge, die auf der Seite der Wasserstraße, auf der das Tafelzeichen steht, nebeneinander stillliegen dürfen',
          image: this.url('e.5.3'),
        },
        // {
        //   name: '',
        //   image: this.url('e.5.4'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.5'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.6'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.7'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.8'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.9'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.10'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.11'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.12'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.13'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.14'),
        // },
        // {
        //   name: '',
        //   image: this.url('e.5.15'),
        // },
        {
          name: 'Erlaubnis zum Ankern auf der Seite der Wasserstraße, auf der das Tafelzeichen steht',
          image: this.url('e.6'),
        },
        {
          name: 'Erlaubnis zum Festmachen am Ufer auf der Seite der Wasserstraße, auf der das Tafelzeichen steht',
          image: this.url('e.7'),
        },
        {
          name: 'Erlaubnis zum Festmachen am Ufer für das sofortige Ein- oder Ausladen eines Kraftwagens',
          image: this.url('e.7.1'),
        },
        {
          name: 'Hinweis auf eine Wendestelle',
          image: this.url('e.8'),
        },
        {
          name: 'Die benutzte Hauptwasserstraße trifft auf eine von beiden Seiten einmündende Nebenwasserstraße',
          image: this.url('e.9a'),
        },
        {
          name: 'Die benutzte Hauptwasserstraße trifft auf eine von Steuerbord einmündende Nebenwasserstraße',
          image: this.url('e.9b'),
        },
        {
          name: 'Die benutzte Hauptwasserstraße trifft auf eine von Backbord einmündende Nebenwasserstraße',
          image: this.url('e.9c'),
        },
        {
          name: 'Die benutzte Nebenwasserstraße trifft auf eine von beiden Seiten einmündende Hauptwasserstraße',
          image: this.url('e.10a'),
        },
        {
          name: 'Die benutzte Nebenwasserstraße mündet in eine Hauptwasserstraße ein',
          image: this.url('e.10b'),
        },
        {
          name: 'Ende eines Verbots oder eines Gebots, das nur in einer Verkehrsrichtung gilt, oder Ende einer Einschränkung.',
          image: this.url('e.11'),
        },
        {
          name: 'Trinkwasserzapfstelle',
          image: this.url('e.13'),
        },
        {
          name: 'Fernsprechstelle',
          image: this.url('e.14'),
        },
        {
          name: 'Fahrerlaubnis für ein Fahrzeug mit Maschinenantrieb',
          image: this.url('e.15'),
        },
        {
          name: 'Fahrerlaubnis für ein Sportboot',
          image: this.url('e.16'),
        },
        {
          name: 'Wasserskistrecke	',
          image: this.url('e.17'),
        },
        {
          name: 'Fahrerlaubnis für ein Segelfahrzeug',
          image: this.url('e.18'),
        },
        {
          name: 'Fahrerlaubnis für ein Fahrzeug, das weder mit Maschinenantrieb noch unter Segel fährt',
          image: this.url('e.19'),
        },
        {
          name: 'Erlaubnis für Segelsurfen',
          image: this.url('e.20'),
        },
        {
          name: 'Nautischer Informationsfunk (Kanal 18)',
          image: this.url('e.21'),
        },
        {
          name: 'Hochwassermarken',
          image: this.url('e.22-1'),
        },
        {
          name: '',
          image: this.url('e.22-2'),
        },
        {
          name: 'Erlaubnis für Kitesurfen',
          image: this.url('e.24'),
        },
        {
          name: 'Landstromanschluss vorhanden',
          image: this.url('e.25'),
        },
        {
          name: '	Hinweis auf ein bestehendes Bade- und/oder Schwimmverbot',
          image: this.url('e.26'),
        },
      ],
    },
  ];

  constructor() {}

  private url(filename: string) {
    return `/assets/signs/${filename}.svg`;
  }
}
