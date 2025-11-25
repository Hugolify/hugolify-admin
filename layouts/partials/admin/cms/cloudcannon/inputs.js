{{- with . }}
_inputs: {
  {{ partial "admin/fields/_range.yml" . }}
}
{{ end }}
