{{/* 
  Partial to generate a UUID widget
  
  - hidden (boolean)
  - i18n (boolean or string)
  - hint (string)
  - label (string) required
  - name (string) required
  - nameOverride (string)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  disabled: true,
  type: 'text',
  instance_value: 'UUID'
}

{{/* Pages CMS */}}
{{ else if eq $cms "pagescms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  description: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  type: 'uuid',
  options: {
    editable: false
  }
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'uuid',
  options: {
    editable: false
  }
}


{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'uuid',
  i18n: {{ $i18n }}
}

{{ end }}
