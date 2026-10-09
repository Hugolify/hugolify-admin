{{- /* The site stylesheet is not loaded in the editor (and hugolify-theme-icons only builds the
       glyphs pages use), so with hugolify-theme-icons the preview pulls the SVG from a CDN:
       Lucide, plus Simple Icons for "brand:". Without it, the preview shows the icon name. */ -}}
{{- $cdn := "https://cdn.jsdelivr.net/npm" -}}
{{- $icon := "(obj.icon || '')" -}}
{{- $preview := printf "<code>${%s}</code>" $icon -}}
{{- if templates.Exists "partials/icon.html" -}}
  {{- $src := printf "${%[1]s.startsWith('brand:') ? '%[2]s/simple-icons/icons/' + %[1]s.slice(6) : '%[2]s/lucide-static/icons/' + %[1]s}.svg" $icon $cdn -}}
  {{- $preview = printf `<img src="%s" alt="${%s}" width="24" height="24">` $src $icon -}}
{{- end -}}
{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "icon"
  "label" (i18n "admin.shortcodes.icon.label" | default "Icon")
  "preview" $preview
) }}
