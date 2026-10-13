{{/* Structure keys written so far: `_structures` is a map, and several blocks
     ask for the same structure (the same ui fields, say). The key spells out
     the fields, so the first one wins. */}}
{{ $keys := slice }}
{{ range . }}

  {{ $f := partial "admin/func/GetFieldNameValues.html" . }}
  {{ $nameField := partial "admin/func/GetRealFieldName.html" . }}
  {{- if in $keys $nameField -}}{{- continue -}}{{- end -}}
  {{ $keys = $keys | append $nameField }}

  {{/* Get field file */}}
  {{ $file := print "admin/fields/" $f.field ".yml" }}
  {{ if templates.Exists (printf "partials/%s" $file) }}
    {{/* A field without values gets its own name, like in _range.yml */}}
    {{ $file = partial $file (cond (not $f.values) $f.field $f.values) }}
  {{ end }}

  {{/* Get datas from file */}}
  {{ $datas := partial "func/ConvertJSObjectToJson.html" (htmlUnescape $file) }}

  {{ range $datas }}

    {{/* Get fields of this object or array */}}
    {{ $fields := .fields | default false -}}

    {{/* Display structure field */}}
    {{ $nameField }}: {
      {{ with .key }}
      key: '{{ . }}',
      {{ end }}
      remove_empty_inputs: true,
      reorder_inputs: false,
      values: [
        {
          {{ with $fields }}
          value: {
            {{ range . }}
              {{/* A field written as a map carries its own arguments, like in _range.yml */}}
              {{- $sub := partial "admin/func/GetFieldNameValues.html" . }}
              {{- $file := print "admin/fields/" $sub.field ".yml" }}
              {{- if templates.Exists ( printf "partials/%s" $file ) }}
                {{- $r := partial $file (cond (not $sub.values) $sub.field $sub.values) }}
                {{ $datas := partial "func/ConvertJSObjectToJson.html" (htmlUnescape $r) }}
                {{- range $k, $v := $datas }}
                  "{{ $k }}": null,
                {{- end }}
              {{- end }}
            {{ end }}
          },
          {{ partial "admin/cms/cloudcannon/inputs.js" . }}
          {{ end }}
        }
      ]
    },

  {{ end }}
{{ end }}
