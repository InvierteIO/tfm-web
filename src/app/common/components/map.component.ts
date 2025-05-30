import {Component, AfterViewInit, Input} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import KML from 'ol/format/KML';
import {fromLonLat} from 'ol/proj';
import {Geometry} from 'ol/geom';
import JSZip from 'jszip';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {
  private map!: Map;
  @Input()
  urlKml!: string;

  ngAfterViewInit(): void {
    this.initMap();
  }

  public refresh(): void {
    if (this.map) {
      this.map.setTarget(undefined);
    }
    this.initMap();
  }

  private initMap(): void {
    const baseLayer = new TileLayer({ source: new OSM() });

    const kmlFormat = new KML();

    const kmlSource = this.urlKml.toLowerCase().endsWith('.kmz')
      ? new VectorSource()
      : new VectorSource({ url: this.urlKml, format: kmlFormat });

    const kmlLayer = new VectorLayer({ source: kmlSource });

    this.map = new Map({
      target: 'map',
      layers: [baseLayer, kmlLayer],
      view: new View({
        center: fromLonLat([-6.7769, -79.8441]),
        zoom: 5
      })
    });

    if (this.urlKml.toLowerCase().endsWith('.kmz')) {
      // @ts-ignore
      this.loadKmz(this.urlKml, kmlFormat, kmlSource);
    } else {
      kmlSource.on('change', () => {
        if (kmlSource.getState() === 'ready') {
          const extent = kmlSource.getExtent();
          if (extent) {
            this.map.getView().fit(extent, { maxZoom: 17, duration: 500 });
          }
        }
      });
    }
  }

  // @ts-ignore
  private async loadKmz(url: string, format: KML, source: VectorSource<Geometry>): Promise<void> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    const kmlName = Object.keys(zip.files).find((name) => name.toLowerCase().endsWith('.kml'));
    if (!kmlName) {
      return;
    }
    const kmlText = await zip.file(kmlName)!.async('text');
    const features = format.readFeatures(kmlText, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    // @ts-ignore
    source.addFeatures(features);
    const extent = source.getExtent();
    if (extent) {
      this.map.getView().fit(extent, { maxZoom: 17, duration: 500 });
    }
  }

}
