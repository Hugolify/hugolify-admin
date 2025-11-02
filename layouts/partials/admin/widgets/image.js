{{/* 
  Partial to generate a image widget
  
  - label (string) required
  - label_singular (string)
  - hint (string)
  - name (string) required
  - required (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $label_singular := .label_singular | default false }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $required := .required | default false }}
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
  type: 'image',
  options: {
    max_file_size: '{{ site.Params.admin.media.max_file_size }}',
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
  }
  required: {{ $required }}
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
  widget: 'image',
  required: {{ $required }},
  i18n: {{ $i18n }},
  choose_url: {{ site.Params.admin.media.choose_url | default false }},
  media_library: {
    config: {
      max_file_size: '{{ site.Params.admin.media.max_file_size }}'
    }
  },
  media_folder: '{{ site.Params.admin.media.media_folder | default "/assets/images/uploads" }}',
  public_folder: '{{ site.Params.admin.media.public_folder | default "/images/uploads" }}'
}

{{ end }}
