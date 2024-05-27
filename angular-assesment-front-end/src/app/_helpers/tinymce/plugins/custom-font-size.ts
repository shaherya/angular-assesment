import {BasePlugin} from "./base";

export class CustomFontSize extends BasePlugin {
  constructor(
    protected tinymce
  ) {
    super(tinymce);
  }

  create() {
    this.tinymce.PluginManager.add('custom-font-size', (editor, url) => {
      // Define the Toolbar button
      editor.ui.registry.addButton('custom-font-size', {
        icon: "character-count",
        tooltip: 'Enter custom font size',
        onAction: function() {
          return editor.windowManager.open({
            title: 'Enter custom font size',
            body: {
              type: 'panel',
              items: [{
                type: 'input',
                name: 'customFont',
                label: 'Desktop (Do not enter `px` or `pt`)',
                flex: true,
                required: true
              },
              {
                type: 'input',
                name: 'customFontMobile',
                label: 'Mobile (Do not enter `px` or `pt`)',
                flex: true,
                required: true
              }]
            },
            onSubmit: function (api) {
              const font = api.getData().customFont;
              let mobile_font = api.getData().customFontMobile;
              if (!mobile_font){
                api.setData({'customFontMobile': font})
                mobile_font = font
              }
              if (!(/^\d+$/.test(font))) {
                return;
              }
              if (!(/^\d+$/.test(mobile_font))) {
                return;
              }
              if (Number(font) < 8 || Number(font) > 200 || Number(mobile_font) < 8 || Number(mobile_font) > 200) {
                return;
              }
              let content = editor.selection.getContent();
              let node = editor.selection.getNode();
              let selected_node = editor.selection.getNode();
              if (content && content.length > 0 && selected_node.className !== 'custom-font-tag') {
                node = document.createElement('span');
                node.className = 'custom-font-tag'
                node.innerText = content;
              }
              let existingFontSize = node.style.fontSize;
              let existingStyles = node.getAttribute('data-mce-style')
              if (existingStyles && existingStyles.search('font-size') > -1) {
                existingStyles = existingStyles.split(`font-size: ${existingFontSize}`).join(`font-size: ${font}px`);
              } else if (existingStyles && existingStyles.length > 0) {
                existingStyles = existingStyles + ` font-size: ${font}px; `
              } else {
                existingStyles = `font-size: ${font}px`;
              }
              node.setAttribute('data-mce-style', existingStyles);
              node.setAttribute('data-mce-font-mobile', `${mobile_font}px`);
              node.setAttribute('data-mce-font-desktop', `${font}px`);
              node.style.fontSize = font + 'px';
              if (content && content.length > 0 && selected_node.className !== 'custom-font-tag') {
                selected_node.innerHTML = selected_node.innerHTML.replace(content, node.outerHTML)
              }
              api.close();
            },
            buttons: [
              {
                text: 'Close',
                type: 'cancel',
                onclick: 'close'
              },
              {
                text: 'Apply',
                type: 'submit',
                primary: true,
                enabled: false
              }
            ]
          })
        }
      })
    });
  }
}
