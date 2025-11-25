{{ range . }}

  {{ $f := partial "admin/func/GetFieldNameValues.html" . }}
  {{ $nameField := partial "admin/func/GetRealFieldName.html" . }}

  {{/* Get field file */}}
  {{ $file := print "admin/fields/" $f.field ".yml" }}
  {{ if templates.Exists (printf "partials/%s" $file) }}
    {{ $file = partialCached $file $f.values }}
  {{ end }}

  {{/* Get datas from file */}}
  {{ $datas := partial "func/ConvertJSObjectToJson.html" (htmlUnescape $file) }}

  {{ with (index $datas $f.field) }}

    {{/* Get fields of this object or array */}}
    {{ $fields := .fields | default false -}}

    {{/* Display structure field */}}
    {{ $nameField }}: {
      {{ with .key }}
      key: '{{ . }}',
      {{ end }}
      values: [
        {
          {{ with $fields }}
          value: {
            {{ range . }}
            '{{ . }}': null,
            {{ end }}
          },
          {{ end }}
          options: {
            
          }
        }
      ]
    },

  {{ end }}
{{ end }}
