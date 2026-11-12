{{- $fields := partialCached "admin/shortcodes/fields/map.html" . -}}
hugolify_map: {
  template: hugo_shortcode_named_args,
  inline: false,
  preview: {
    text: {{ i18n "admin.shortcodes.map.label" | default "Map" }}
  },
  definitions: {
    icon: map,
    shortcode_name: map,
    named_args: [
      { editor_key: markers, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
