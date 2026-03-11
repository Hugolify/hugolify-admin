{{/*
  Custom implementation — cannot use _register.js because:
  - The shortcode takes multiple positional args: id, class, "title" (all optional after id).
  - _register.js positional mode only captures a single (\S+) group.
*/}}
{{- $fields := partialCached "admin/shortcodes/fields/vimeo.html" . . -}}
CMS.registerEditorComponent({
  id: 'vimeo',
  label: '{{ i18n "admin.shortcodes.vimeo.label" | default "Vimeo" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< vimeo (\S+)(?:\s+(\S+))?(?:\s+"([^"]*)")?\s*>}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      id: match[1] || '',
      class: match[2] || '',
      title: match[3] || ''
    };
  },
  toBlock: function (obj) {
    const open = '{{ `{{<` | safeHTML }}';
    const close = '{{ `>}}` | safeHTML }}';
    let s = open + ' vimeo ' + (obj.id || '');
    if (obj.class) s += ' ' + obj.class;
    if (obj.title) s += ' "' + obj.title + '"';
    return s + ' ' + close;
  },
  toPreview: function (obj) {
    return `<iframe src="https://player.vimeo.com/video/${obj.id}" frameborder="0" allowfullscreen="true" height="378" width="620"></iframe>`;
  }
});
