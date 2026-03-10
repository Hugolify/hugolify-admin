{{- $fields := partialCached "admin/shortcodes/fields/map.html" }}
CMS.registerEditorComponent({
  id: 'map',
  label: '{{ i18n "admin.shortcodes.map.label" | default "Map" }}',
  fields: [
    {{- range $fields }}
    {{ partialCached (print "admin/fields/" . ".yml") | safeHTML }},
    {{- end }}
  ],
  pattern: /{{"{{< map markers=`(.*)` >}}" | safeHTML }}/,
  fromBlock: function (match) {
    return {
      markers: match[1]
    };
  },
  toBlock: function (obj) {
    const markers = obj.markers || '';
    return (
      '{{ `{{<` | safeHTML }} map markers=`' +
      markers +
      '` {{ `>}}` | safeHTML }}'
    );
  },
  toPreview: function (obj) {
    return `map widget`;
  }
});
