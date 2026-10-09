{{ range . }}

  {{ $f := partial "admin/func/GetFieldNameValues.html" . }}
  {{ $nameField := partial "admin/func/GetRealFieldName.html" . }}

  {{/* Get field file */}}
  {{ $file := print "admin/fields/" $f.field ".yml" }}
  {{ if templates.Exists (printf "partials/%s" $file) }}
    {{ $file = partial $file $f.values }}
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
