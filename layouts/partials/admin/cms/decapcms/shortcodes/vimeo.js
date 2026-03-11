{{- $fields := partialCached "admin/shortcodes/fields/vimeo.html" . }}
CMS.registerEditorComponent({
  id: 'vimeo',
  label: '{{ i18n "admin.shortcodes.vimeo.label" | default "Vimeo" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< vimeo (\S+) >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      id: match[1]
    };
  },
  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    return open + ' vimeo ' + (obj.id || '') + ' ' + close;
  },
  toPreview: function (obj) {
    return `<iframe src="https://player.vimeo.com/video/${obj.id}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
  }
});
