{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "alert-block"
  "label" (i18n "admin.shortcodes.alert_block.label" | default "Alert block")
  "preview" `<div class="alert alert-${obj.state}">${obj.text}</div>`
) }}
