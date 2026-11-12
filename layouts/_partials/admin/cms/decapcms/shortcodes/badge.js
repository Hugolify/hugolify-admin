{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "badge"
  "label" (i18n "admin.shortcodes.badge.label" | default "Badge")
  "preview" `<span class="badge text-bg-${obj.state}">${obj.text}</span>`
) }}
