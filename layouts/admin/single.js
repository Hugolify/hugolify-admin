{{- $cms := site.Params.admin.cms | default "tinacms" -}}
{{- $file := printf "admin/cms/%s/config.js" $cms -}}
{{- if templates.Exists ( printf "_partials/%s" $file ) }}
  {{- partialCached $file . }}
{{ end -}}
