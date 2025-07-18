CMS.registerEditorComponent({
  id: 'youtube',
  label: '{{ i18n "admin.shortcodes.youtube.label" }}',
  fields: [
    {
      name: 'id',
      label: '{{ i18n "admin.shortcodes.youtube._id" }}',
      widget: 'string'
    },
    {{ partialCached "admin/fields/title.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< youtube id="(.*)" title="(.*?)" class="youtube" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      id: match[1],
      title: match[2]
    };
  },
  toBlock: function (obj) {
    const id = obj.id || '';
    const title = obj.title || '';
    return '{{ `{{<` | safeHTML }} youtube id="' + id + '" title="' + title + '" class="youtube" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return '{{`<img src="https://i3.ytimg.com/vi/${obj.id}/hqdefault.jpg" alt="" />`}}';
  }
});
