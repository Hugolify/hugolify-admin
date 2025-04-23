CMS.registerEditorComponent({
  id: 'details',
  label: '{{ i18n "admin.shortcodes.details.label" }}',
  fields: [
    {{ partialCached "admin/fields/name.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/title.yml" . | safeHTML }}, 
    {
      name: 'summary',
      label: 'Summary',
      widget: 'string'
    },
    {
      name: 'contents',
      label: 'Contents',
      widget: 'markdown'
    }
  ],
  pattern: /{{`{{< details name="([^"]*)" title="([^"]*)" summary="([^"]*)" >}}([\s\S]*?){{< \/details >}}` | safeHTML }}/,

  fromBlock: function (match) {
    return {
      name: match[1],
      title: match[2],
      summary: match[3],
      contents: match[4]
    };
  },
  toBlock: function (obj) {
    const name = obj.name || '';
    const title = obj.title || '';
    const summary = obj.summary || '';
    const contents = obj.contents || '';
    return '{{ `{{<` | safeHTML }} details name="' + name + '" title="' + title + '" summary="' + summary + '" {{ `>}}` | safeHTML }}' + contents + '{{ `{{<` | safeHTML }} /details {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `<details><summary>${obj.summary}</summary>${obj.contents}</details>`;
  }
});
