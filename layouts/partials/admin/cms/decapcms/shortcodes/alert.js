{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "alert"
  "label" (i18n "admin.shortcodes.alert.label" | default "Alert")
  "preview" `<div class="alert alert-${obj.state}">${obj.text}</div>`
) }}
