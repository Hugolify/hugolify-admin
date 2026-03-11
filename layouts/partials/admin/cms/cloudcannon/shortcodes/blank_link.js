{{- $fields := partialCached "admin/shortcodes/fields/blank_link.html" . -}}
hugolify_blank_link: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    icon: open_in_new,
    text: {{ i18n "admin.shortcodes.blank_link.label" | default "Blank link" }}
  },
  definitions: {
    shortcode_name: blank_link,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: link, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
