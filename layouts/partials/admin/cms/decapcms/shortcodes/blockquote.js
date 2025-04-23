CMS.registerEditorComponent({
  id: 'blockquote',
  label: '{{ i18n "admin.shortcodes.blockquote.label" }}',
  fields: [
    {{ partialCached "admin/fields/quote.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/title.yml" . | safeHTML }}, 
    {{ partialCached "admin/fields/text.yml" . | safeHTML }}
  ],
  pattern: /{{`{{< blockquote quote="([^"]*)" title="([^"]*)" text="([^"]*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      quote: match[1],
      title: match[2],
      text: match[3]
    };
  },
  toBlock: function (obj) {
    const quote = obj.quote || '';
    const title = obj.title || '';
    const text = obj.text || '';
    return '{{ `{{<` | safeHTML }} blockquote quote="' + quote + '" title="' + title + '" text="' + text + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return `
      <figure class="quote">
        <blockquote>${obj.quote}</blockquote>
        <figcaption>
          <div>
            <cite>${obj.title}</cite>
            ${obj.text}
          </div>
        </figcaption>
      </figure>`;
  }
});
