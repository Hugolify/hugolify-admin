{{/* 
  Partial to generate a blocks widget
  
  - label (string) required
  - label_singular (string)
  - hint (string)
  - name (string) required
  - blocks (array) required
  - required (boolean)
  - min (number)
  - max (number)
  - collapsed (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $label_singular := .label_singular | default false }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $blocks := .blocks | default slice }}
{{ $max := .max | default false }}
{{ $min := .min | default false }}
{{ $required := .required | default false }}
{{ $collapsed := .collapsed | default true }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

blocks: {
  type: 'array',
  options: {
    structures: '_structures.blocks'
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
  type: 'block',
  blockKey: 'type',
  {{ if or $min $max }}
  list: {
    {{ with $min }}
    min: {{ . }},
    {{ end }}
    {{ with $max }}
    max: {{ . }}
    {{ end }}
  },
  {{ else }}
  list: true,
  {{ end }}
  required: {{ $required }},
  {{ partial "admin/fields/_fields.yml" $blocks }}
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
  widget: 'list',
  {{ with $min }}
  min: {{ . }},
  {{ end }}
  {{ with $max }}
  max: {{ . }},
  {{ end }}
  minimize_collapsed: true,
  required: {{ $required }},
  collapsed: {{ $collapsed }},
  i18n: {{ $i18n }},
  {{ with $blocks }}
  types: [
    {{ range . }}
      {{ $file := print "admin/blocks/types/" . ".yml" }}
      {{ if templates.Exists ( printf "partials/%s" $file ) }}
        {{ partial $file . }},
      {{ else }}
        {{ if isset site.Params.admin.blocks . }}
          {{ partial "admin/blocks/types/_placeholder.yml" . }},
        {{ end }}
      {{ end }}
    {{ end }}
  ]
  {{ end }}
}

{{ end }}
