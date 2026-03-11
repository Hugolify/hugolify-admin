{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "figure"
  "label" (i18n "admin.shortcodes.figure.label" | default "Figure")
  "preview" `<figure><picture><img src="${obj.src}" alt="${obj.alt}" /></picture><figcaption><p>${obj.legend}</p><p class="credit">${obj.credit}</p></figcaption></figure>`
) }}
