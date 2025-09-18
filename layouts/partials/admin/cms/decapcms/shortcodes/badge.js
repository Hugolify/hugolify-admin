CMS.registerEditorComponent({
  id: 'badge',
  label: '{{ i18n "admin.shortcodes.badge.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }},
    {{ partialCached "admin/fields/state.yml" . | safeHTML }},
  ],
  pattern: /{{`{{< badge (.*) >}}` | safeHTML }}/,

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
      state: parsed.state || '',
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' badge';
    if (obj.text) shortcode += ' text="' + obj.text + '"';
    if (obj.state) shortcode += ' state="' + obj.state + '"';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    return `<span class="badge text-bg-${obj.state}">${obj.text}</span>`;
  }
});
