{{/* 
  Partial to generate a file widget
  
  - extensions (array)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - label_singular (string)
  - max (number)
  - min (number)
  - multiple (boolean)
  - name (string) required
  - required (boolean)
  - type (string) required ["audio", "document", "file", "video"]
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $extensions := .extensions | default false }}
{{ $hint := .hint | default false }}
{{ $i18n := .i18n | default true }}
{{ $label := .label | default "nolabel" }}
{{ $label_singular := .label_singular | default false }}
{{ $max := .max | default false }}
{{ $min := .min | default false }}
{{ $multiple := .multiple | default true }}
{{ $name := .name | default "noname" }}
{{ $required := .required | default false }}
{{ $type := .type | default "file" }}

{{ $max_file_size := print "site.Params.admin.media." $type "_max_file_size" | default false }}
{{ $media_folder := (print "site.Params.admin.media." $type "_media_folder") | default "/assets/" }}
{{ $public_folder := (print "site.Params.admin.media." $type "_public_folder") | default "/assets/" }}
{{ $choose_url := (print "site.Params.admin.media." $type "_choose_url") | default false }}



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
  type: '{{ cond (eq $type "document") "document" "file" }}',
  options: {
    {{ with $extensions }}
    accepts_mime_types: [
      {{ range . }}
        {{ if eq . "mp3" }}
          "audio/mpeg",
        {{ end }}
        {{ if eq . "mp4" }}
          "video/mp4",
        {{ end }}
        {{ if eq . "ogg" }}
          "audio/ogg",
        {{ end }}
        {{ if eq . "pdf" }}
          "application/pdf",
        {{ end }}
        {{ if eq . "webm" }}
          "video/webm",
        {{ end }}
        {{ if eq . "zip" }}
          "application/zip",
        {{ end }}
      {{ end }}
    ],
    max_file_size: '{{ . }}',
    {{ end }}
    {{ with $extensions }}
    accepts_mime_types: '{{ .regex }}',
    {{ end }}
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
  type: 'file',
  options: {
    {{ with $extensions }}
    extensions: [{{ delimit . "," }}],
    {{ end }}
    {{ if or $min $max }}
    multiple: {
      {{ with $min }}
      min: {{ . }},
      {{ end }}
      {{ with $max }}
      max: {{ . }}
      {{ end }}
    },
    {{ else if $multiple }}
    multiple: true,
    {{ end }}
    {{ with $type }}
    media: '{{ . }}s'
    {{ end }}
  },
  required: {{ $required }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "pagescms" }}

{{/* TODO */}}

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
  widget: 'file',
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
