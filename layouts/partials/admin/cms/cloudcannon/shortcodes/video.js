{{- $fields := partialCached "admin/shortcodes/fields/video.html" . -}}
hugolify_video: {
  template: hugo_shortcode_named_args,
  inline: false,
  preview: {
    icon: videocam,
    text: {{ i18n "admin.shortcodes.video.label" | default "Video" }}
  },
  definitions: {
    shortcode_name: video,
    named_args: [
      { editor_key: mp4, type: string },
      { editor_key: webm, type: string, optional: true },
      { editor_key: controls, type: boolean, optional: true },
      { editor_key: loop, type: boolean, optional: true },
      { editor_key: legend, type: string, optional: true },
      { editor_key: credit, type: string, optional: true },
      { editor_key: screenshot, type: boolean, optional: true }
    ]
  },
  {{- with $fields }}
  {{ partial "admin/cms/cloudcannon/inputs.js" . }}
  {{- end }}
}
