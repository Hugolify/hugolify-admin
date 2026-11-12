{{- $fields := partialCached "admin/shortcodes/fields/twitch.html" . -}}
hugolify_twitch: {
  template: hugo_shortcode_positional_args,
  inline: false,
  preview: {
    icon: videocam,
    text: {{ i18n "admin.shortcodes.twitch.label" | default "Twitch" }}
  },
  definitions: {
    shortcode_name: twitch,
    positional_args: [
      { editor_key: id, type: string }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
