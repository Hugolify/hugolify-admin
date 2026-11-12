{{ partial "admin/cms/decapcms/shortcodes/_register.js" (dict
  "shortcode" "video"
  "label" (i18n "admin.shortcodes.video.label" | default "Video")
  "preview" `<video src="${obj.mp4}" ${obj.autoplay ? 'autoplay' : ''} ${obj.controls ? 'controls' : ''} ${obj.loop ? 'loop' : ''}></video>`
) }}
