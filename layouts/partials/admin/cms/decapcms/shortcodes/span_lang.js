{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "span_lang"
  "label" (i18n "admin.shortcodes.span_lang.label" | default "Span lang")
  "preview" `<span lang="${obj.lang}">${obj.text}</span>`
) }}
