CMS.registerEditorComponent({
  id: 'details',
  label: '{{ i18n "admin.shortcodes.details.label" }}',
  fields: [
    {{ partialCached "admin/fields/name.yml" . | safeHTML }},
    {{ partialCached "admin/fields/title.yml" . | safeHTML }},
    {
      name: 'summary',
      label: 'Summary',
      widget: 'string'
    },
    {
      name: 'contents',
      label: 'Contents',
      widget: 'markdown'
    }
  ],
  pattern: /{{`{{< details (.*) >}}([\s\S]*?){{< \/details >}}` | safeHTML }}/,

  fromBlock: function (match) {
    const attrs = match[1] || '';
    const contents = match[2] || '';

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
      name: parsed.name || '',
      title: parsed.title || '',
      summary: parsed.summary || '',
      contents: contents.trim()
    };
  },

  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    let shortcode = open + ' details';
    if (obj.name) shortcode += ' name="' + obj.name + '"';
    if (obj.title) shortcode += ' title="' + obj.title + '"';
    if (obj.summary) shortcode += ' summary="' + obj.summary + '"';
    shortcode += ' ' + close;
    shortcode += obj.contents;
    shortcode += '{{`{{<` | safeHTML }} /details ' + close;
    return shortcode;
  },

  toPreview: function (obj) {
    let nameAttr = obj.name ? ` name="${obj.name}"` : '';
    let titleAttr = obj.title ? ` title="${obj.title}"` : '';
    return `
      <details>
        <summary${nameAttr}${titleAttr}>
          ${obj.summary}
        </summary>
        <div>${obj.contents}</div>
      </details>
    `;
  }

});
