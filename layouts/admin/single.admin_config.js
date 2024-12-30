{{- $cms := site.Params.admin.cms | default "decapcms" -}}
{{- $partial := print "admin/cms/" $cms "/config.js" -}}
{{- if templates.Exists ( printf "partials/%s" $partial ) }}
{{ partialCached $partial . }}
{{ end -}}
