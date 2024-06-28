CMS.registerEditorComponent({
  id: 'figure',
  label: '{{ i18n "admin.shortcodes.figure.label" }}',
  fields: [
    {{ partialCached "admin/fields/image_src.yml" . }}, 
    {{ partialCached "admin/fields/image_alt.yml" . }}, 
    {{ partialCached "admin/fields/legend.yml" . }}, 
    {{ partialCached "admin/fields/credit.yml" . }}
  ],
  pattern: '{{`/{{< figure src="(.*?)" alt="(.*?)" legend="(.*?)" credit="(.*?)" >}}/`}}',
  fromBlock: function (match) {
    return {
      src: match[1] ?? '',
      alt: match[2] ?? '',
      legend: match[3] ?? '',
      credit: match[4] ?? ''
    };
  },
  toBlock: function (obj) {
    return '{{`{{< figure src="${obj.src ?? ''}" alt="${obj.alt ?? ''}" legend="${obj.legend ?? ''}" credit="${obj.credit ?? ''}" >}}`}}';
  },
  toPreview: function (obj) {
    return '{{`{{< figure src="${obj.src ?? ''}" alt="${obj.alt ?? ''}" legend="${obj.legend ?? ''}" credit="${obj.credit ?? ''}" >}}`}}';
  }
});
