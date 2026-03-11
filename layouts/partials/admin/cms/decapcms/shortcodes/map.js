{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "map"
  "label" (i18n "admin.shortcodes.map.label" | default "Map")
  "preview" `<div>Map: ${obj.markers}</div>`
) }}
