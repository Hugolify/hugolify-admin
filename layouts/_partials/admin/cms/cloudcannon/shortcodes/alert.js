{{- $fields := partialCached "admin/shortcodes/fields/alert.html" . -}}
hugolify_alert: {
  template: hugo_shortcode_named_args,
  inline: false,
  preview: {
    icon: warning,
    text: {{ i18n "admin.shortcodes.alert.label" | default "Alert" }}
  },
  definitions: {
    shortcode_name: alert,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: state, type: string, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
