{{- $fields := partialCached "admin/shortcodes/fields/blockquote.html" . -}}
hugolify_blockquote: {
  template: hugo_paired_shortcode_named_args,
  inline: false,
  preview: {
    icon: format_quote,
    text: {{ i18n "admin.shortcodes.blockquote.label" | default "Blockquote" }}
  },
  definitions: {
    shortcode_name: blockquote,
    named_args: [
      { editor_key: quote, type: string },
      { editor_key: title, type: string, optional: true },
      { editor_key: text, type: string, optional: true },
      { editor_key: image, type: string, optional: true }
    ]
  },
  {{- with $fields }}
  {{ replace (partial "admin/cms/cloudcannon/inputs.js" .) "src" "image" }}
  {{- end }}
}
