{{- $fields := partialCached "admin/shortcodes/fields/span_lang.html" . -}}
hugolify_span_lang: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    text: {{ i18n "admin.shortcodes.span_lang.label" | default "Span lang" }}
  },
  definitions: {
    icon: language,
    shortcode_name: span_lang,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: lang, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
