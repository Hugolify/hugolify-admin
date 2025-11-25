{{/* 
  Partial to generate a image widget
  
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - max (number)
  - min (number)
  - multiple (boolean)
  - name (string) required
  - nameOverride (string)
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $max := .max | default false }}
{{- $min := .min | default false }}
{{- $multiple := .multiple | default true }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}

{{- $max_file_size := site.Params.admin.media.max_file_size | default false }}
{{- $media_folder := site.Params.admin.media.media_folder | default "/assets/" }}
{{- $public_folder := site.Params.admin.media.public_folder | default "/assets/" }}
{{- $choose_url := site.Params.admin.media.choose_url | default false }}


{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  {{ with $nameOverride }}
  key: '{{ . }}',
  {{ end }}
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'image',
  options: {
    accepts_mime_types: [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml"
    ],
    {{ with $max_file_size }}
    max_file_size: '{{ . }}',
    {{ end }}
    paths: {
      static: '{{ $public_folder }}',
      uploads: '{{ $media_folder }}'
    },
    required: {{ $required }}
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
  type: 'image',
  options: {
    media: 'images'
  },
  required: {{ $required }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'image',
  required: {{ $required }}
}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'image',
  required: {{ $required }},
  i18n: {{ $i18n }},
  choose_url: {{ $choose_url }},
  media_library: {
    config: {
      {{ with $max_file_size }}
      max_file_size: '{{ . }}',
      {{ end }}
      {{ with $multiple }}
      multiple: true,
      {{ end }}
    }
  },
  media_folder: '{{ $media_folder }}',
  public_folder: '{{ $public_folder }}'
}

{{ end }}
