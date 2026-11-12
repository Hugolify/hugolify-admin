{{- $fields := partialCached "admin/shortcodes/fields/badge.html" . -}}
hugolify_badge: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    icon: label,
    text: {{ i18n "admin.shortcodes.badge.label" | default "Badge" }}
  },
  definitions: {
    shortcode_name: badge,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: state, type: string, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
