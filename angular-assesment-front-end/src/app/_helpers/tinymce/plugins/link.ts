import {BasePlugin} from './base';
declare function createLinkPlugin(tinymce): any;

export class LinkPlugin extends BasePlugin {
  constructor(
    protected tinymce
  ) {
    super(tinymce);
  }

  public create() {
    createLinkPlugin(this.tinymce);
  }

}
