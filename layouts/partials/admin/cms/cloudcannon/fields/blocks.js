{{ $blocks := site.Params.admin.blocks.enable }}

{{ with $blocks }}
  blocks: {
    style: modal,
    values: [
    {{ range . }}
      
      {{/* Get block arguments */}}
      {{ $block_key := . }}
      {{ $block_name := i18n (print "admin.blocks." . ".label") | default (. | humanize) }}
      {{ $block_hint := i18n (print "admin.blocks." . ".hint") | default false }}
      {{ $block_icon := (index site.Params.admin.blocks .).icon.cloudcannon | default false }}
      {{/* Get block fields file */}}
      {{ $fields := print "admin/blocks/fields/" . ".html" }}
      {{ if templates.Exists ( printf "partials/%s" $fields ) }}
        {{ $fields = partialCached $fields . }}
      {{ end }}

      {
        label: {{ $block_name }},
        value: {
          {{ range $fields }}
          {{ . }}: ,
          {{ end }}
        },

        {{ partial "admin/cms/cloudcannon/inputs.js" $fields }}

        preview: {
          text: [
            key: {{ $block_key }},
            {{ $block_name }}
          ],
          {{ with $block_hint }}
          subtext: [
            key: {{ $block_key }}_description,
            {{ . }}
          ],
          {{ end }}
          {{ with $block_icon }}
          icon: {{ . }}
          {{ end }}
        }
      },
      
    {{ end }}
    ]
  }
{{ end }}
