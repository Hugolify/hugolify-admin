{{- /* The site stylesheet is not loaded in the editor (and hugolify-theme-icons only builds the
       glyphs pages use), so with hugolify-theme-icons the preview pulls the SVG from a CDN, by set:
       "brand:" from Simple Icons, "tabler:" from Tabler, "bootstrap:" from Bootstrap Icons, "lucide:"
       from Lucide, and a name without a prefix from the site's default set (params.icons.set).
       "solid:" is a rendering: Bootstrap Icons draws it as <name>-fill, the other sets show the
       outline. Without hugolify-theme-icons, or for a set with no CDN here, the preview shows the
       icon name. */ -}}
{{- $preview := "<code>${obj.icon || ''}</code>" -}}
{{- if templates.Exists "_partials/icon.html" -}}
  {{- /* the engine's own rule since v1.7.0; earlier versions only had Lucide */ -}}
  {{- $default := "lucide" -}}
  {{- if templates.Exists "_partials/func/icons/GetDefaultSet.html" -}}
    {{- $default = partialCached "func/icons/GetDefaultSet.html" "icons" -}}
  {{- end -}}
  {{- $js := `${((icon) => {
      const cdn = 'https://cdn.jsdelivr.net/npm';
      const urls = {
        brand: (n) => cdn + '/simple-icons/icons/' + n + '.svg',
        lucide: (n) => cdn + '/lucide-static/icons/' + n + '.svg',
        // the aliases hugolify-theme-icons-tabler ships for the themes' own names
        tabler: (n) => cdn + '/@tabler/icons@3/icons/outline/' + ({ play: 'player-play', pause: 'player-pause', 'contact-round': 'user-square-rounded' }[n] || n) + '.svg',
        // the same for hugolify-theme-icons-bootstrap, whose solid: icons are its own <name>-fill
        bootstrap: (n, solid) => cdn + '/bootstrap-icons@1/icons/' + ({ 'map-pin': 'geo-alt', 'contact-round': 'person-vcard' }[n] || n) + (solid ? '-fill' : '') + '.svg',
      };
      const solid = /^solid:/.test(icon.trim());
      const name = icon.trim().replace(/^solid:/, '');
      const i = name.indexOf(':');
      const url = name && urls[i < 0 ? '__DEFAULT__' : name.slice(0, i)];
      return url ? '<img src="' + url(name.slice(i + 1), solid) + '" alt="' + icon + '" width="24" height="24">' : '<code>' + icon + '</code>';
    })(obj.icon || '')}` -}}
  {{- $preview = replace $js "__DEFAULT__" $default -}}
{{- end -}}
{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "icon"
  "label" (i18n "admin.shortcodes.icon.label" | default "Icon")
  "preview" $preview
) }}
