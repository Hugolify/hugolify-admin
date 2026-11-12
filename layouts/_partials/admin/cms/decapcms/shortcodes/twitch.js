{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "twitch"
  "label" (i18n "admin.shortcodes.twitch.label" | default "Twitch")
  "positional" true
  "preview" `<iframe src="https://player.twitch.tv/?channel=${obj.id}&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`
) }}
