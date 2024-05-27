import { BaseModel } from './index';

export enum ImageSize {
  original = 'original',
  small = 'small',
  medium = 'medium',
  large = 'large'
}

export enum ImageType {
  Image = 'Image',
  ProductImage = 'ProductImage'
}

export enum DeviceType {
  Desktop = 0,
  Mobile = 1
}

export interface Image extends BaseModel {
  path: string;
  file: any;
  width: number;
  height: number;
  ppoi: string;
  name?: string;
  type?: string;
  src?: string;
  pre_signed_url?: any;
  is_public: boolean;
  resourcetype: string;
}

export const ImageExtension = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/jpg',
  'image/svg+xml'
];
