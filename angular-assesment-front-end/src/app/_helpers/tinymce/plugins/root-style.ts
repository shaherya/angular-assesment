import {BasePlugin} from './base';

export class RootStylePlugin extends BasePlugin {
  constructor(
    protected tinymce
  ) {
    super(tinymce);
  }

  public create() {
    var self = this;

    //add custom plugin for funnel variables
    this.tinymce.PluginManager.add('root-style', function(editor, url){
      // Define the Toolbar button
      editor.ui.registry.addButton('root-style', {
        icon: "color-picker",
        tooltip: "Set Style of Root Element",
        onAction: function() {
          let initialData = {};
          const root = editor.getBody();

          if (root && root.style) {
            initialData['backgroundcolor'] = self.rgb2hex(root.style.backgroundColor);
            initialData['bordercolor'] = self.rgb2hex(root.style.borderColor);
          }

          return editor.windowManager.open({
            title: 'Set Style of Root Element',
            body: {
              type: 'panel',
              items: [
                {
                  name: 'backgroundcolor',
                  type: 'colorinput',
                  label: 'Background color'
                },
                {
                  name: 'bordercolor',
                  type: 'colorinput',
                  label: 'Border color'
                }
              ]
            },
            initialData: initialData,
            onSubmit: function (api) {
              // insert markup
              const backgroundColor = api.getData().backgroundcolor;
              const borderColor = api.getData().bordercolor;
              let styles = [];

              if (backgroundColor) {
                styles.push('background-color: ' + backgroundColor + ' !important;');
              }

              if (borderColor) {
                styles.push('border-color: ' + borderColor + ' !important;');
              } else if (backgroundColor) {
                styles.push('border-color: ' + backgroundColor + ' !important;');
              }

              if (styles.length) {
                root.style.cssText = styles.join(' ');
              } else {
                root.style.cssText = '';
              }

              // close the dialog
              api.close();
            },
            buttons: [
              {
                text: 'Cancel',
                type: 'cancel',
                onclick: 'close'
              },
              {
                text: 'Save',
                type: 'submit',
                primary: true,
                enabled: false
              }
            ]
          });
        }
      });
    });
  }

  private rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }
}
