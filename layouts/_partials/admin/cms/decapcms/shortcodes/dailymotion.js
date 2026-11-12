{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "dailymotion"
  "label" (i18n "admin.shortcodes.dailymotion.label" | default "Dailymotion")
  "positional" true
  "preview" `<iframe src="https://www.dailymotion.com/embed/video/${obj.id}" frameborder="0" allowfullscreen="true"></iframe>`
) }}
