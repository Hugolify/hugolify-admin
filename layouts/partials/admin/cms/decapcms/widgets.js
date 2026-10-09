{{- if site.Params.admin.config.id }}
{{ partialCached "admin/cms/netlifycms/widgets/uuid.js" . }}
{{- end }}
{{ partialCached "admin/cms/decapcms/widgets/nested_path.js" . }}
