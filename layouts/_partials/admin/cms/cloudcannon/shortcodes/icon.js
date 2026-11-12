{{- $fields := partialCached "admin/shortcodes/fields/icon.html" . -}}
hugolify_icon: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    icon: emoji_symbols,
    text: {{ i18n "admin.shortcodes.icon.label" | default "Icon" }}
  },
  definitions: {
    shortcode_name: icon,
    named_args: [
      { editor_key: icon, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
