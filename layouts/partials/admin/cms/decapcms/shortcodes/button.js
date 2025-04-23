CMS.registerEditorComponent({
  id: 'button',
  label: '{{ i18n "admin.shortcodes.button.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/url.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/is_blank.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< button text="([^"]*)" url="([^"]*)" blank="(true|false)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      text: match[1],
      url: match[2],
      blank: match[3]
    };
  },
  toBlock: function (obj) {
    const text = obj.text || '';
    const url = obj.url || '';
    const blank = obj.blank === true ? 'true' : 'false';
    return '{{ `{{<` | safeHTML }} button text="' + text + '" url="' + url + '" blank="' + blank + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `<a class="btn" href="${obj.url}">${obj.text}</a>`;
  }
});
