import { BaseModel } from './index';

export enum StyleLanguage {
  CSS = 1,
  SCSS = 2,
  LESS = 3
}

export enum StyleMediaType {
  All = 'all',
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
  MobileOrTablet = 'mobile_or_tablet',
  DesktopOrTablet = 'tablet_or_desktop'
}

export interface Style extends BaseModel {
  name: string;
  language: StyleLanguage;
  content: string;
  is_system: boolean;
  campaign: string | number | null;
  variables: {[key: string]: string;};
  styles: any;
  header_enhanced_mode?: boolean;
  footer_enhanced_mode?: boolean;
  header_enhanced_content?: string;
  footer_enhanced_content?: string;
  header_style?: string;
  footer_style?: string;
}

export interface StyleVariable {
  name: string;
  value: string;
}
