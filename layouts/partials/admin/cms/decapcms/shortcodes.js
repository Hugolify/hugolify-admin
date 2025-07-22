{{- $shortcodes := site.Params.admin.shortcodes.enable | default false -}}
{{- if ne $shortcodes false -}}
  {{- range $shortcodes -}}
    {{- $partial := print "admin/cms/decapcms/shortcodes/" . ".js" -}}
    {{- if templates.Exists ( printf "partials/%s" $partial ) -}}
      {{ partial $partial }}
    {{- end -}}
  {{- end -}}
{{- end -}}
