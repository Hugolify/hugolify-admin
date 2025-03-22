{{- $cms := site.Params.admin.cms | default "tinacms" -}}
{{- if eq $cms "tinacms" }}
  {{- $partial := print "admin/cms/" $cms "/config.yml" -}}
  {{- if templates.Exists ( printf "partials/%s" $partial ) }}
    {{- transform.Remarshal "yaml" (partial $partial .) -}}
  {{ end -}}
{{ end -}}
