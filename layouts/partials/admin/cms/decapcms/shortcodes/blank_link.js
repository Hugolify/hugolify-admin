CMS.registerEditorComponent({
  id: 'blank_link',
  label: '{{ i18n "admin.shortcodes.blank_link.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }},
    {{ partialCached "admin/fields/link.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< blank_link (.*) >}}` | safeHTML }}/,

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
      text: parsed.text || '',
      link: parsed.link || '',
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' blank_link';
    if (obj.text) shortcode += ' text="' + obj.text + '"';
    if (obj.link) shortcode += ' link="' + obj.link + '"';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    return `<a target="_blank" rel="noopener" href="${obj.link}">${obj.text}</a>`;
  }
});
