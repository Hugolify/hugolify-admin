CMS.registerEditorComponent({
  id: 'button',
  label: '{{ i18n "admin.shortcodes.button.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . }}, 
    {{ partialCached "admin/fields/url.yml" . }}, 
    {{ partialCached "admin/fields/is_blank.yml" . }}
  ],
  pattern: /{{`{{<`}} button text="(.*)" url="(.*)" blank="(true|false)" {{`>}}`}}/,
  fromBlock: function (match) {
    return {
      text: match[1],
      url: match[2],
      blank: match[3] === 'true'
    };
  },
  toBlock: function (obj) {
    return '{{`{{<`}} button text="${obj.text}" url="${obj.url}" blank="${obj.blank}" {{`>}}`}}';
  },
  toPreview: function (obj) {
    return `<a class="btn" href="${obj.url}">${obj.text}</a>`;
  }
});
