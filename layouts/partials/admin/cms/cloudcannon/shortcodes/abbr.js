{{- $fields := partialCached "admin/shortcodes/fields/abbr.html" . -}}
hugolify_abbr: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    text: {{ i18n "admin.shortcodes.abbr.label" | default "Abbreviation" }}
  },
  definitions: {
    icon: type,
    shortcode_name: abbr,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: title, type: string },
      { editor_key: lang, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
