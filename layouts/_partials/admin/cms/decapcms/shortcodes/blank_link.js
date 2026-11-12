{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "blank_link"
  "label" (i18n "admin.shortcodes.blank_link.label" | default "Blank Link")
  "preview" `<a target="_blank" rel="noopener" href="${obj.link}">${obj.text}</a>`
) }}
