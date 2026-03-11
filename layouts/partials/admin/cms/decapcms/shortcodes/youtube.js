{{- $fields := partialCached "admin/shortcodes/fields/youtube.html" . }}
CMS.registerEditorComponent({
  id: 'youtube',
  label: '{{ i18n "admin.shortcodes.youtube.label" | default "Youtube" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
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
