CMS.registerEditorComponent({
  id: 'twitter',
  label: '{{ i18n "admin.shortcodes.twitter.label" }}',
  fields: [
    {
      name: 'user',
      label: '{{ i18n "admin.shortcodes.twitter.user" }}',
      widget: 'string'
    },
    {
      name: 'id',
      label: '{{ i18n "admin.shortcodes.twitter._id" }}',
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
