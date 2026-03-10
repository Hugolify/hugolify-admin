{{- $fields := partialCached "admin/shortcodes/fields/dailymotion.html" }}
CMS.registerEditorComponent({
  id: 'dailymotion',
  label: '{{ i18n "admin.shortcodes.dailymotion.label" | default "Dailymotion" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< dailymotion (\S+) >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      id: match[1]
    };
  },
  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    return open + ' dailymotion ' + (obj.id || '') + ' ' + close;
  },
  toPreview: function (obj) {
    return `<iframe src="https://www.dailymotion.com/embed/video/${obj.id}" frameborder="0" allowfullscreen="true"></iframe>`;
  }
});
