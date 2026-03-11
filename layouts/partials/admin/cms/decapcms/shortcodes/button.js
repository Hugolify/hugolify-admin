{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "button"
  "label" (i18n "admin.shortcodes.button.label" | default "Button")
  "preview" `<a class="btn${obj.class ? ' ' + obj.class : ''}" href="${obj.url}"${obj.blank ? ' target="_blank" rel="noopener"' : ''}>${obj.text}</a>`
) }}
