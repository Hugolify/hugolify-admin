{{ range . }}

  {{ $nameField := . }}

  {{/* Get field file */}}
  {{ $file := print "admin/fields/" $nameField ".yml" }}
  {{ if templates.Exists (printf "partials/%s" $file) }}
    {{ $file = partialCached $file . }}
  {{ end }}

  {{/* Get datas from file */}}
  {{ $datas := partial "func/ConvertJSObjectToJson.html" (htmlUnescape $file) }}
  {{ with (index $datas $nameField) }}

    {{/* Get fields of this object or array */}}
    {{ $fields := .fields | default false -}}

    {{/* Display structure field */}}
    ,
    '{{ $nameField }}': {
      values: [
        {
          value: {
            {{ range $fields }}
            '{{ . }}': null,
            {{ end }}
          },
          options: {
            _inputs: {
              {{ range $fields }}
                {{ $file := print "admin/fields/" . ".yml" }}
                {{ if templates.Exists ( printf "partials/%s" $file ) }}
                  {{ partialCached $file . }},
                {{ end }}
              {{ end }}
            }
          }
        }
      ]
    }

  {{ end }}
{{ end }}
