CMS.registerEditorComponent({
  id: 'blank_link',
  label: '{{ i18n "admin.shortcodes.blank_link.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }}, 
    {
      label: '{{ i18n "admin.fields.url.label" }}',
      name: 'link',
      widget: 'string'
    }, 
  ],
  pattern: /{{`{{< blank_link text="([^"]*)" link="([^"]*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      text: match[1],
      link: match[2],
    };
  },
  toBlock: function (obj) {
    const text = obj.text || '';
    const link = obj.link || '';
    return '{{ `{{<` | safeHTML }} blank_link text="' + text + '" link="' + link + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `<a target="_blank" href="${obj.link}">${obj.text}</a>`;
  }
});
