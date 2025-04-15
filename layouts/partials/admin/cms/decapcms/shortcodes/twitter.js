CMS.registerEditorComponent({
  id: 'twitter',
  label: '{{ i18n "admin.shortcodes.twitter.label" }}',
  fields: [
    {
      label: '{{ i18n "admin.shortcodes.twitter.user" }}',
      name: 'user',
      widget: 'string'
    },
    {
      label: '{{ i18n "admin.shortcodes.twitter._id" }}',
      name: 'id',
      widget: 'string'
    }
  ],
  pattern: '{{`/{{< tweet (.*?) >}}/`}}',
  fromBlock: function (match) {
    return {
      user: match[1],
      id: match[2]
    };
  },
  toBlock: function (obj) {
    return '{{`{{< tweet user="${obj.user}" id="${obj.id}" >}}`}}';
  },
  toPreview: function (obj) {
    return '{{`{{< tweet user="${obj.user}" id="${obj.id}" >}}`}}';
  }
});
