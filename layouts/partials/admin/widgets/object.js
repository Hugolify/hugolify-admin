{{/* 
  Partial to generate a object widget
  
  - label (string) required
  - label_singular (string)
  - hint (string)
  - name (string) required
  - fields (array) required
  - required (boolean)
  - collapsed (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $label_singular := .label_singular | default false }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $fields := .fields | default slice }}
{{ $required := .required | default false }}
{{ $collapsed := .collapsed | default true }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $label_singular }}
  singular_name: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'object',
  options: {
    _inputs: {
      {{ range $fields }}
        {{ $file := print "admin/fields/" . ".yml" }}
        {{ if templates.Exists ( printf "partials/%s" $file ) }}
          {{ partialCached $file . }},
        {{ end }}
      {{ end }}
    },
    required: {{ $required }},
    subtype: 'object'
  }
}

{{/* Pages CMS */}}
{{ else if eq $cms "pagescms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  description: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  type: 'object',
  required: {{ $required }},
  {{ partial "admin/fields/_fields.yml" $fields }}
}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $label_singular }}
  label_singular: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'object',
  required: {{ $required }},
  collapsed: {{ $collapsed }},
  i18n: {{ $i18n }},
  {{ partial "admin/fields/_fields.yml" $fields }}
}

{{ end }}
