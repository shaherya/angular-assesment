import {Injectable} from '@angular/core';
import {RootStylePlugin, VariablesPlugin, LinkPlugin} from './plugins';
import {CustomFontSize} from "./plugins/custom-font-size";

@Injectable()
export class TinymceConfig {
  private tinymce;

  constructor(
  ) {
    this.tinymce = (window as any).tinyMCE;
  }

  setDefaults() {
    var self = this;
    var rootBlockElement = 'div';

    //set defaults for tinymce editors
    this.tinymce.overrideDefaults({
      base_url: '/tinymce/',  // Base for assets such as skins, themes and plugins
      branding: false,
      menubar: false,
      forced_root_block: rootBlockElement,
      toolbar: 'undo redo | bold italic underline | outdent indent',
      link_assume_external_targets: false,
      default_link_target: '_blank',
      target_list: true,
      link_context_toolbar: true,
      image_advtab: true,
      image_description: false,
      relative_urls : false,
      remove_script_host : true,
      document_base_url : 'https://path.solvpath.com/',
      style_formats: [
        {title: 'Big', format: 'h2'},
        {title: 'Normal', format: 'div'},
        {title: 'Small', block: 'small'}
      ],
      init_instance_callback : function(editor) {
        //if there's a root wrapper element, remove it and move its styles to the tinymce body
        const body = editor.getBody();

        if (body.children.length === 1) {
          const root = body.children[0];

          if (root.tagName.toLowerCase() === rootBlockElement) {
            body.style.cssText = root.style.cssText;
            body.removeChild(root);
            body.innerHTML = root.innerHTML;
          }
        }

        //save pre-process - make sure we have a root block element
        editor.on('PreProcess', function (el) {
          const body = el.node;
          let root = null;
          let createRoot = false;

          if (body.children.length > 1) {
            createRoot = true; //no root - we need to create one
          }
          else if (body.children.length === 1) {
            if (body.children[0].tagName.toLowerCase() === rootBlockElement) {
              root = body.children[0]
            }
            else {
              createRoot = true;  //wrong root - we need to wrap it in a new root
            }
          }

          if (createRoot) {
            root = editor.dom.create('div'); //create the new root element

            // move all the editor's elements to the new root
            while (body.childNodes.length > 0) {
              root.appendChild(body.childNodes[0]);
            }

            body.appendChild(root); //add the root to the editor
          }

          if (root) {
            const editorBody = editor.getBody();

            if (editorBody && editorBody.style) {
              root.style.cssText = editorBody.style.cssText;  //move editor body styles to the root block
            }
          }
        });
      },
      suffix: '.min'          // This will make Tiny load minified versions of all its assets
    });
  }

  createPlugins() {
    let plugins = [
      new RootStylePlugin(this.tinymce),
      new VariablesPlugin(this.tinymce),
      new LinkPlugin(this.tinymce),
      new CustomFontSize((this.tinymce))
    ];

    plugins.forEach(plugin => {
      plugin.create();
    });
  }

}
