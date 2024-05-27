import {BasePlugin} from './base';
import {FunnelVariables} from "../../../_models";

export class VariablesPlugin extends BasePlugin {
  constructor(
    protected tinymce
  ) {
    super(tinymce);
  }

  private getDefaultItems() {
    let items = [];

    Object.keys(FunnelVariables).forEach(key => {
      items.push({value: '{' + key + '}', text: FunnelVariables[key]})
    });

    items.sort((a, b): number => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });

    return items;
  }

  public create() {
    var self = this;

    //add custom plugin for funnel variables
    this.tinymce.PluginManager.add('path-variables', (editor, url) => {
      var items = editor.getParam('path_variables', self.getDefaultItems(), 'array');
      items.unshift({value: '', text: '--- Select a Variable ---'});

      // Define the Toolbar button
      editor.ui.registry.addButton('path-variables', {
        icon: "code-sample",
        tooltip: 'Insert Variable',
        onAction: function() {
          return editor.windowManager.open({
            title: 'Insert Variable',
            body: {
              type: 'panel',
              items: [{
                type: 'selectbox',
                name: 'variable',
                label: 'Variable',
                items: items,
                flex: true
              }]
            },
            onSubmit: function (api) {
              // insert markup
              const variable = api.getData().variable;

              if (variable) {
                editor.insertContent(variable);
              }

              // close the dialog
              api.close();
            },
            buttons: [
              {
                text: 'Close',
                type: 'cancel',
                onclick: 'close'
              },
              {
                text: 'Insert',
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
}
