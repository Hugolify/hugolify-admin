CMS.registerEditorComponent({
  id: 'badge',
  label: '{{ i18n "admin.shortcodes.badge.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/state.yml" . | safeHTML }}, 
  ],
  pattern: /{{`{{< badge text="([^"]*)" state="([^"]*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      text: match[1],
      state: match[2],
    };
  },
  toBlock: function (obj) {
    const text = obj.text || '';
    const state = obj.state || '';
    return '{{ `{{<` | safeHTML }} badge text="' + text + '" state="' + state + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `<span class="badge text-bg-${obj.state}">${obj.text}</span>`;
  }
});
