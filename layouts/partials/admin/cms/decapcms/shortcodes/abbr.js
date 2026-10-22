{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "abbr"
  "label" (i18n "admin.shortcodes.abbr.label" | default "Abbreviation")
  "mode" "dialog"
  "summary" "{{text}}"
  "preview" `<abbr title="${obj.title}" lang="${obj.lang}">${obj.text}</abbr>`
) }}
