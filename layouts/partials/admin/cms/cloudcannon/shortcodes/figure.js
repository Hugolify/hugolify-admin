{{- $fields := partial "admin/shortcodes/fields/figure.html" . -}}
hugolify_figure: {
  template: hugo_shortcode_named_args,
  inline: false,
  preview: {
    icon: image,
    text: {{ i18n "admin.shortcodes.figure.label" | default "Figure" }}
  },
  definitions: {
    shortcode_name: figure,
    named_args: [
      { editor_key: image, type: string },
      { editor_key: alt, type: string, optional: true },
      { editor_key: legend, type: string, optional: true },
      { editor_key: credit, type: string, optional: true },
      { editor_key: screenshot, type: boolean, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
