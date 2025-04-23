CMS.registerEditorComponent({
  id: 'figure',
  label: '{{ i18n "admin.shortcodes.figure.label" }}',
  fields: [
    {{ partialCached "admin/fields/image_src.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/image_alt.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/legend.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/credit.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< figure src="(.*)" alt="(.*?)" legend="(.*?)" credit="(.*?)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      src: match[1],
      alt: match[2],
      legend: match[3],
      credit: match[4]
    };
  },
  toBlock: function (obj) {
    const src = obj.src || '';
    const alt = obj.alt || '';
    const legend = obj.legend || '';
    const credit = obj.credit || '';
    return '{{`{{<` | safeHTML}} figure src="' + src + '" alt="' + alt + '" legend="' + legend + '" credit="' + credit + '" {{`>` | safeHTML}}}}';
  },
  toPreview: function (obj) {
    return `
      <figure>
        <picture>
          <img src="${obj.src}" alt="${obj.alt}" />
        </picture>
        <figcaption>
          <p>${obj.legend}</p>
          <p class="credit">${obj.credit}</p>
        </figcaption>
      </figure>
    `;
  }
});
