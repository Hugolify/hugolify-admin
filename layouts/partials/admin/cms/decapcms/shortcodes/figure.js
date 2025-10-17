CMS.registerEditorComponent({
  id: 'figure',
  label: '{{ i18n "admin.shortcodes.figure.label" }}',
  fields: [
    {{ partialCached "admin/fields/image_src.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/image_alt.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/legend.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/credit.yml" . | safeHTML }},
    {{ partialCached "admin/fields/is_screenshot.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< figure (.*) >}}` | safeHTML }}/,

  fromBlock: function (match) {
    const attrs = match[1] || '';

    const attrRe = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    const parsed = {};
    let m;
    while ((m = attrRe.exec(attrs)) !== null) {
      const key = m[1];
      const value = (m[2] !== undefined) ? m[2] :
                    (m[3] !== undefined) ? m[3] :
                    (m[4] !== undefined) ? m[4] :
                    true;
      parsed[key] = value;
    }

    return {
      src: parsed.src || '',
      alt: parsed.alt || '',
      legend: parsed.legend || '',
      credit: parsed.credit || '',
      is_screenshot: parsed.screenshot === true || parsed.screenshot === 'true'
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' figure';
    if (obj.src) shortcode += ' src="' + obj.src + '"';
    if (obj.alt) shortcode += ' alt="' + obj.alt + '"';
    if (obj.legend) shortcode += ' legend="' + obj.legend + '"';
    if (obj.credit) shortcode += ' credit="' + obj.credit + '"';
    if (obj.is_screenshot) shortcode += ' screenshot=true';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    const figure = `
      <figure>
        <picture>
          <img src="${obj.src || ''}" alt="${obj.alt || ''}" />
        </picture>
        <figcaption>
          <p>${obj.legend || ''}</p>
          <p class="credit">${obj.credit || ''}</p>
        </figcaption>
      </figure>
    `;

    if (obj.is_screenshot) {
      return `
        <div class="screenshot">
          <span></span>
          ${figure}
        </div>
      `;
    }

    return figure;
  }
});
