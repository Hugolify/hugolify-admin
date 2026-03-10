{{- $fields := partialCached "admin/shortcodes/fields/twitch.html" }}
CMS.registerEditorComponent({
  id: 'twitch',
  label: '{{ i18n "admin.shortcodes.twitch.label" | default "Twitch" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") | safeHTML }},
    {{- end }}
  ],
  pattern: /{{`{{< twitch (\S+) >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      id: match[1]
    };
  },
  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    return open + ' twitch ' + (obj.id || '') + ' ' + close;
  },
  toPreview: function (obj) {
    return `<iframe src="https://player.twitch.tv/?channel=${obj.id}&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
  }
});
