{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "qr"
  "label" (i18n "admin.shortcodes.qr.label" | default "QR")
  "preview" `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${obj.text}" alt="">`
) }}
