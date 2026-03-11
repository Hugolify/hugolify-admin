{{- $shortcodes := site.Params.admin.shortcodes.enable | default false -}}
{{- if ne $shortcodes false }}
_snippets: {
{{- range $shortcodes }}
  {{- $partial := print "admin/cms/cloudcannon/shortcodes/" . ".js" }}
  {{- if templates.Exists ( printf "partials/%s" $partial ) -}}
  {{ partial $partial }},
  {{- end }}
{{- end }}
}
{{- end }}
