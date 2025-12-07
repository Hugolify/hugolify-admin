CMS.registerEditorComponent({
  id: 'blockquote',
  label: '{{ i18n "admin.shortcodes.blockquote.label" }}',
  fields: [
    {{ partialCached "admin/fields/quote.yml" . | safeHTML }},
    {{ partialCached "admin/fields/title.yml" . | safeHTML }},
    {{ partialCached "admin/fields/text.yml" . | safeHTML }},
    {{ replace (partialCached "admin/fields/image_src.yml" . | safeHTML) "src" "image" }}
  ],
  pattern: /{{`{{< blockquote (.*) >}}` | safeHTML }}/,

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
      quote: parsed.quote || '',
      title: parsed.title || '',
      text: parsed.text || '',
      image: parsed.image || ''
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' blockquote';
    if (obj.quote) shortcode += ' quote="' + obj.quote + '"';
    if (obj.title) shortcode += ' title="' + obj.title + '"';
    if (obj.text) shortcode += ' text="' + obj.text + '"';
    if (obj.image) shortcode += ' image="' + obj.image + '"';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    return `
      <figure class="quote">
        <blockquote>${obj.quote}</blockquote>
        <figcaption>
          ${obj.image ? `
            <picture>
              <img src="${obj.image}" alt="">
            </picture>
          ` : ''}
          <div>
            ${obj.title ? `<cite>${obj.title}</cite>` : ''}
            ${obj.text}
          </div>
        </figcaption>
      </figure>
    `;
  }
});
