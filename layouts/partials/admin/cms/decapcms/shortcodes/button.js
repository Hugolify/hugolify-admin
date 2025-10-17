CMS.registerEditorComponent({
  id: 'button',
  label: '{{ i18n "admin.shortcodes.button.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }},
    {{ partialCached "admin/fields/url.yml" . | safeHTML }},
    {{ partialCached "admin/fields/class.yml" . | safeHTML }},
    {{ partialCached "admin/fields/is_blank.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< button (.*) >}}` | safeHTML }}/,

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
      url: parsed.url || '',
      blank: parsed.blank === true || parsed.blank === 'true'
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' button';
    if (obj.text) shortcode += ' text="' + obj.text + '"';
    if (obj.url) shortcode += ' url="' + obj.url + '"';
    if (obj.class) shortcode += ' class="' + obj.class + '"';
    if (obj.blank) shortcode += ' blank="' + obj.blank + '"';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    const blankAttr = obj.blank ? ' target="_blank" rel="noopener"' : '';
    const classAttr = obj.class ? ' ' + obj.class : '';
    return `<a class="btn${classAttr}" href="${obj.url}"${blankAttr}>${obj.text}</a>`;
  }
});
