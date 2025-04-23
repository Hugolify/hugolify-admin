CMS.registerEditorComponent({
  id: 'alert',
  label: '{{ i18n "admin.shortcodes.alert.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/state.yml" . | safeHTML }}, 
  ],
  pattern: /{{`{{< alert text="([^"]*)" state="([^"]*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      text: match[1],
      state: match[2],
    };
  },
  toBlock: function (obj) {
    const text = obj.text || '';
    const state = obj.state || '';
    return '{{ `{{<` | safeHTML }} alert text="' + text + '" state="' + state + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `<div class="alert alert-${obj.state}">${obj.text}</div>`;
  }
});
