{{ $blocks := site.Params.admin.blocks.enable }}

{{ with $blocks }}
  blocks: {
    id_key: type,
    remove_empty_inputs: true,
    reorder_inputs: false,
    style: modal,
    values: [
    {{ range . }}
      
      {{/* Get block arguments */}}
      {{ $block_key := . }}
      {{ $block_name := i18n (print "admin.blocks." . ".label") | default (. | humanize) }}
      {{ $block_hint := i18n (print "admin.blocks." . ".hint") | default false }}
      {{ $library := site.Params.admin.cloudcannon.icon }}
      {{ $block_icon := index (index site.Params.admin.blocks .).icon $library }}

      {{/* Get block fields file */}}
      {{ $fields := print "admin/blocks/fields/" . ".html" }}
      {{ if templates.Exists ( printf "partials/%s" $fields ) }}
        {{ $fields = partialCached $fields . }}
      {{ end }}

      {
        label: {{ $block_name }},
        value: {
          type: '{{ . }}',
          {{ range $fields }}
            {{ $field := partial "admin/func/GetRealFieldName.html" . }}
            '{{ $field }}': null,
          {{ end }}
        },

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
  },
{{ end }}
