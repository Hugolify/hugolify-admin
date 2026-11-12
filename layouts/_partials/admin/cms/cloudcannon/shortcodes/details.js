{{- $fields := partialCached "admin/shortcodes/fields/details.html" . }}
hugolify_details: {
  template: hugo_paired_shortcode_named_args,
  inline: false,
  preview: {
    icon: quiz,
    text: {{ i18n "admin.shortcodes.details.label" | default "Details" }}
  },
  definitions: {
    shortcode_name: details,
    content_key: contents,
    named_args: [
      { editor_key: summary, type: string },
      { editor_key: name, type: string, optional: true },
      { editor_key: title, type: string, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
