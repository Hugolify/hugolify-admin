CMS.registerEditorComponent({
  id: 'twitter',
  label: '{{ i18n "admin.shortcodes.twitter.label" | default "Twitter" }}',
  fields: [
    {
      label: '{{ i18n "admin.shortcodes.twitter.user" | default "User" }}',
      name: 'user',
      widget: 'string'
    },
    {
      label: '{{ i18n "admin.shortcodes.twitter._id" | default "ID" }}',
      name: 'id',
      widget: 'string'
    }
  ],
  pattern: /{{`{{< tweet user="(.*?)" id="(.*)" >}}` | safeHTML }}/,
  fromBlock: function (match) {
    return {
      user: match[1],
      id: match[2]
    };
  },
  toBlock: function (obj) {
    const user = obj.user || '';
    const id = obj.id || '';
    return '{{ `{{<` | safeHTML }} tweet user="' + user + '" id="' + id + '" {{ `>}}` | safeHTML }}';
  },
  toPreview: function (obj) {
    return '{{`{{< tweet user="${obj.user}" id="${obj.id}" >}}`}}';
  }
});
