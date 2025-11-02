{{- $i := 0 }}
{{- with . }}
_inputs: {
  {{ range . }}
    {{ $file := print "admin/fields/" . ".yml" }}
    {{ if templates.Exists ( printf "partials/%s" $file ) }}
      {{ if ne . "body" }}
        {{ if ne $i 0 }},{{ end }}{{ partial $file . }}
        {{ $i = 1 }}
      {{ end }}
    {{ end }}
  {{ end }}
},
{{ end }}
