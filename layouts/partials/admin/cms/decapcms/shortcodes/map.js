CMS.registerEditorComponent({
  id: 'map',
  label: '{{ i18n "admin.shortcodes.map.label" | default "Map" }}',
  fields: [
    {
      label: '{{ i18n "admin.shortcodes.map.markers" | default "Markers" }}',
      name: 'markers',
      widget: 'text'
    }
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
