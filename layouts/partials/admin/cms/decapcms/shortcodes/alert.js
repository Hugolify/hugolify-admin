CMS.registerEditorComponent({
  id: 'alert',
  label: '{{ i18n "admin.shortcodes.alert.label" }}',
  fields: [
    {{ partialCached "admin/fields/text.yml" . | safeHTML }},
    {{ partialCached "admin/fields/state.yml" . | safeHTML }},
  ],
  pattern: /{{`{{< alert (.*) >}}` | safeHTML }}/,

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
    let shortcode = open + ' alert';
    if (obj.text) shortcode += ' text="' + obj.text + '"';
    if (obj.state) shortcode += ' state="' + obj.state + '"';
    shortcode += ' ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    return `<div class="alert alert-${obj.state}">${obj.text}</div>`;
  }
});
