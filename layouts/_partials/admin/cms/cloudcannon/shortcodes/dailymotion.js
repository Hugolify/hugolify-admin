{{- $fields := partialCached "admin/shortcodes/fields/dailymotion.html" . -}}
hugolify_dailymotion: {
  template: hugo_shortcode_positional_args,
  inline: false,
  preview: {
    icon: videocam,
    text: {{ i18n "admin.shortcodes.dailymotion.label" | default "Dailymotion" }}
  },
  definitions: {
    shortcode_name: dailymotion,
    positional_args: [
      { editor_key: id, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
