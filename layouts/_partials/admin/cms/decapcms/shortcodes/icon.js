{{- /* The site stylesheet is not loaded in the editor (and hugolify-theme-icons only builds the
       glyphs pages use), so with hugolify-theme-icons the preview takes its image from
       window.hugolifyIcons.src (assets/admin/widgets/icon/picker.js): the site's own drawing
       once the icon field has loaded the set, the set's SVG on a CDN before that. Without
       hugolify-theme-icons, or for a set with no CDN there, the preview shows the icon name. */ -}}
{{- $preview := "<code>${obj.icon || ''}</code>" -}}
{{- if templates.Exists "_partials/icon.html" -}}
  {{- $preview = `${((icon) => {
      const src = window.hugolifyIcons.src(icon);
      return src ? '<img src="' + src + '" alt="' + icon + '" width="24" height="24">' : '<code>' + icon + '</code>';
    })(obj.icon || '')}` -}}
{{- end -}}
{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "icon"
  "label" (i18n "admin.shortcodes.icon.label" | default "Icon")
  "preview" $preview
) }}
