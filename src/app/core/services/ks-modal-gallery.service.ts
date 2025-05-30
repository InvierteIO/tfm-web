import { Injectable } from '@angular/core';
import {
  Image,
  ModalGalleryConfig,
  ModalGalleryRef,
  ModalGalleryService,
  ModalLibConfig,
  ButtonsStrategy
} from '@ks89/angular-modal-gallery';
import { Document } from '@core/models/document.model';

@Injectable({ providedIn: 'root' })
export class KsModalGalleryService {
  private galleries: Record<string, Image[]> = {};

  private images: Image[] = [];
  private currentImage?: Image;
  private libConfig: ModalLibConfig = {};
  private idCounter = 0;

  constructor(private readonly modalGallerySvc: ModalGalleryService) {}

  addImage(key: string, file: Document): this {
    const img = new Image(file.id ?? 0, {
      img: file.path ?? '',
      title: file.filename,
      description: `[${file.name}]`
    });
    const images = this.galleries[key] ?? [];
    images.push(img);
    this.galleries[key] = images;
    return this;
  }

  removeImage(key: string, file: Document): this {
    const images = this.galleries[key];
    if (images) {
      const image = images.find(i => i.id === file.id);
      if (image) {
        images.splice(images.indexOf(image), 1);
      }
    }
    return this;
  }

  removeAllImages(key: string): this {
    const images = this.galleries[key];
    console.log("removeAllImages: ", images);
    if (images && images.length > 0) {
      images.splice(0, images.length);
      console.log("removeAllImages",images);
    }
    return this;
  }


  viewImage(key: string, file: Document): ModalGalleryRef {
    const name = file.name ? file.name : file.filename;
    this.images = this.galleries[key] ?? [];
    console.log("viewImage", this.images);
    this.currentImage = new Image(file.id ?? 0, {
      img: file.path ?? '',
      title: file.filename,
      description: file.description ? `[${name}] - ${file.description}` : `[${name}]`
    });

    if (this.images.length <= 1) {
      this.withSingleImageConfig();
    }

    return this.open();
  }

  imagesConfig(images: Image[]): this {
    this.images = images;
    return this;
  }

  current(image: Image): this {
    this.currentImage = image;
    return this;
  }

  withSingleImageConfig(): this {
    this.libConfig = {
      previewConfig: { visible: false },
      dotsConfig: { visible: false },
      slideConfig: {
        infinite: false,
        sidePreviews: { show: false }
      },
      buttonsConfig: {
        visible: false,
        strategy: ButtonsStrategy.DEFAULT
      }
    } as ModalLibConfig;
    return this;
  }

  open(): ModalGalleryRef {
    const config: ModalGalleryConfig = {
      id: ++this.idCounter,
      images: this.images,
      currentImage: this.currentImage,
      libConfig: this.libConfig
    } as ModalGalleryConfig;

    const ref = this.modalGallerySvc.open(config) as ModalGalleryRef;
    this.reset();
    return ref;
  }

  private reset(): void {
    this.images = [];
    this.currentImage = undefined;
    this.libConfig = {};
  }
}
