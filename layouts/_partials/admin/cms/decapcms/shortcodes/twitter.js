{{/*
  Custom implementation — cannot use _register.js because:
  - The Hugo shortcode name is "x" but the CMS component id is "twitter/x".
  - _register.js uses the same name for both the pattern and the component id.
*/}}
{{- $fields := partialCached "admin/shortcodes/fields/twitter.html" . }}
CMS.registerEditorComponent({
  id: 'twitter',
  label: '{{ i18n "admin.shortcodes.twitter.label" | default "Twitter / X" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< x user="(.*?)" id="(.*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      user: match[1],
      id: match[2]
    };
  },
  toBlock: function (obj) {
    const user = obj.user || '';
    const id = obj.id || '';
    return '{{ `{{<` | safeHTML }} x user="' + user + '" id="' + id + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return '{{`{{< x user="${obj.user}" id="${obj.id}" >}}`}}';
  }
});
