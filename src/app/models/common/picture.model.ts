import { SafeUrl } from '@angular/platform-browser';

export class PictureModel {
  name: string;
  fileUri: string;
  url: SafeUrl;
  isLoading: boolean;
  path: string;
  type: ImgType;
}

export enum ImgType {
  IMAGE = 'image',
  VIDEO = 'video',
}
