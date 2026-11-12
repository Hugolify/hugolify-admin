{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "blockquote"
  "label" (i18n "admin.shortcodes.blockquote.label" | default "Blockquote")
  "preview" `<figure class="quote"><blockquote>${obj.quote}</blockquote><figcaption>${obj.image ? '<img src="' + obj.image + '" alt="" />' : ''}<div>${obj.title ? '<cite>' + obj.title + '</cite>' : ''}${obj.text}</div></figcaption></figure>`
) }}
