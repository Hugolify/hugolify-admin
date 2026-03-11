{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "details"
  "label" (i18n "admin.shortcodes.details.label" | default "Details")
  "paired" true
  "preview" `<details><summary>${obj.summary}</summary><div>${obj.contents}</div></details>`
) }}
