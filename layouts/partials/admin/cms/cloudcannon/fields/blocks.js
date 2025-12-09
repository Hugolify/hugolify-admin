{{ $blocks := site.Params.admin.blocks.enable }}

{{ if in $blocks "selected" }}
  {{ $blocks = complement (slice "selected") $blocks }}
  {{ range $collection, $value := site.Params.admin.collections -}}
    {{ if and .enable (ne $collection "config") (ne $collection "indexes") }}
      {{ $blocks = $blocks | append (dict "key" "selected" "value" $collection) }}
    {{ end }}
  {{ end }}
{{ end }}

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
      {{ $block_value := . }}
      {{ if reflect.IsMap . }}
        {{ $block_key = index . "key" }}
        {{ $block_value = index . "value" }}
      {{ end }}
      {{ $block_label := i18n (print "admin.blocks." $block_key ".label")  | default ($block_key | humanize) }}
      {{ $block_hint := i18n (print "admin.blocks." $block_key ".hint") | default false }}
      {{ $library := site.Params.admin.cloudcannon.icon }}
      {{ $block_icon := index (index site.Params.admin.blocks $block_key).icon $library }}

      {{/* Get block fields file */}}
      {{ $fields_file := print "admin/blocks/fields/" $block_key ".html" }}
      {{ $fields := (index site.Params.admin.blocks .).fields }}
      {{ if and (not $fields) (templates.Exists ( printf "partials/%s" $fields_file )) }}
        {{ $fields = partial $fields_file $block_value }}
      {{ end }}

      {{/* Specific for selected blocks */}}
      {{ if eq $block_key "selected" }}
        {{ $collection_name := i18n (print "admin.collections." $block_value ".label") | default (humanize $block_value) -}} 
        {{ $block_label = i18n (print "admin.blocks." $block_key ".label") (dict "section" $collection_name) }}
        {{ $block_hint = i18n (print "admin.blocks." $block_key ".hint") (dict "section" $collection_name) | default false }}
        {{ $block_key = printf "%s-%s" $block_key $block_value }}
      {{ end }}

      {
        label: {{ $block_label }},
        value: {
          type: '{{ $block_key }}',
          {{ range $fields }}
            {{ $f := partial "admin/func/GetFieldNameValues.html" . }}
            {{ $field := $f.field }}
            {{ $values := $f.values }}

            {{- $file := print "admin/fields/" $field ".yml" }}
            {{- if templates.Exists ( printf "partials/%s" $file ) }}
              {{- $r := partial $file $values }}
              {{ $datas := partial "func/ConvertJSObjectToJson.html" (htmlUnescape $r) }}
              {{- range $k, $v := $datas }}
                {{ if $v.hidden }}
                "{{ $k }}": {{ $v.value}},
                {{ else }}
                "{{ $k }}": null,
                {{ end }}
              {{- end }}
            {{- end }}
          {{ end }}
        },
        {{ with $fields }}
          {{ partial "admin/cms/cloudcannon/inputs.js" . }},
        {{ end }}
        preview: {
          text: [
            key: heading.title,
            key: title,
            {{ $block_label }}
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
