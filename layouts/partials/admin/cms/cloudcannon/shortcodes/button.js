{{- $fields := partialCached "admin/shortcodes/fields/button.html" . -}}
hugolify_button: {
  template: hugo_shortcode_named_args,
  inline: true,
  preview: {
    icon: link,
    text: {{ i18n "admin.shortcodes.button.label" | default "Button" }}
  },
  definitions: {
    shortcode_name: button,
    named_args: [
      { editor_key: text, type: string },
      { editor_key: url, type: string },
      { editor_key: class, type: string, optional: true },
      { editor_key: blank, type: boolean, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
