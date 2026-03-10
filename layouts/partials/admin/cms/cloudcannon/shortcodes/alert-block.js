{{- $fields := partialCached "admin/shortcodes/fields/alert-block.html" . }}
hugolify_alert_block: {
  template: hugo_shortcode_named_args,
  inline: false,
  preview: {
    icon: warning,
    text: {{ i18n "admin.shortcodes.alert.label" | default "Alert" }}
  },
  definitions: {
    shortcode_name: alert-block,
    content_key: contents,
    named_args: [
      { editor_key: state, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
