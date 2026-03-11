{{- $fields := partialCached "admin/shortcodes/fields/twitter.html" . }}
CMS.registerEditorComponent({
  id: 'twitter',
  label: '{{ i18n "admin.shortcodes.twitter.label" | default "Twitter" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< tweet user="(.*?)" id="(.*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      user: match[1],
      id: match[2]
    };
  },
  toBlock: function (obj) {
    const user = obj.user || '';
    const id = obj.id || '';
    return '{{ `{{<` | safeHTML }} tweet user="' + user + '" id="' + id + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return '{{`{{< tweet user="${obj.user}" id="${obj.id}" >}}`}}';
  }
});
