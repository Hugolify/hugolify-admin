{{/*
  Generic DecapCMS shortcode registration partial.

  Context dict:
    - shortcode  (string)  required  — shortcode name (e.g. "alert")
    - label      (string)  required  — display label
    - preview    (string)  required  — JS template literal body (e.g. `<div>${obj.text}</div>`)
    - paired     (bool)    optional  — paired shortcode like {{< details >}}...{{< /details >}}
    - positional (bool)    optional  — positional arg like {{< twitch 123 >}}

  Fields are auto-loaded from admin/shortcodes/fields/{shortcode}.html.
  Field names and widget types are auto-extracted via GetDecapFieldMeta.html.
*/}}

{{- $shortcode := .shortcode -}}
{{- $label := .label -}}
{{- $preview := .preview -}}
{{- $paired := .paired | default false -}}
{{- $positional := .positional | default false -}}

{{- /* Load the field key list from the shortcode's fields definition file. */ -}}
{{- $fieldKeys := partialCached (printf "admin/shortcodes/fields/%s.html" $shortcode) $shortcode $shortcode -}}

{{- /* Resolve each field key to its actual CMS name and widget type.
       e.g. "is_blank" → { name: "blank", widget: "boolean" }
       This is needed to generate correct fromBlock/toBlock JS code. */ -}}
{{- $fieldMetas := slice -}}
{{- range $fieldKeys -}}
  {{- $fieldMetas = $fieldMetas | append (partial "admin/func/GetDecapFieldMeta.html" .) -}}
{{- end -}}

{{- /* For paired shortcodes, "contents" is the inner captured text (match[2]).
       It must be excluded from named-arg loops in fromBlock/toBlock to avoid
       duplicate object keys (SyntaxError) and incorrect shortcode output. */ -}}
{{- $fieldMetasNamed := $fieldMetas -}}
{{- if $paired -}}
  {{- $fieldMetasNamed = slice -}}
  {{- range $fieldMetas -}}
    {{- if ne .name "contents" -}}
      {{- $fieldMetasNamed = $fieldMetasNamed | append . -}}
    {{- end -}}
  {{- end -}}
{{- end -}}

CMS.registerEditorComponent({
  id: '{{ $shortcode }}',
  label: '{{ $label }}',
  {{/* Render each field widget definition for the CMS editor form. */}}
  fields: [
    {{- range $fieldKeys }}
    {{- partialCached (print "admin/fields/" . ".yml") . . | safeHTML }},
    {{- end }}
  ],

  {{/* Pattern to detect and parse the shortcode in the markdown editor.
         - Default:    captures all named args as a single group: {{< name (...) >}}
         - Positional: captures a single word value:             {{< name (\S+) >}}
         - Paired:     captures named args + inner content:      {{< name (...) >}}...{{< /name >}} */}}
  {{- if $paired }}
  pattern: /{{ print "{{< " $shortcode " (.*) >}}([\\s\\S]*?){{< \\/" $shortcode " >}}" | safeHTML }}/,
  {{- else if $positional }}
  pattern: /{{ print "{{< " $shortcode " (\\S+) >}}" | safeHTML }}/,
  {{- else }}
  pattern: /{{ print "{{< " $shortcode " (.*) >}}" | safeHTML }}/,
  {{- end }}

  {{/* Parse the shortcode string back into a field object for the editor.
         - Positional: directly maps match[1] to the single field.
         - Named args: parses key="value" pairs from the attribute string.
         - Boolean fields use strict equality to handle both JS true and "true" strings.
         - Paired shortcodes also capture inner content as match[2]. */}}
  fromBlock: function (match) {
    {{ if $positional -}}
    return {
      {{ (index $fieldMetas 0).name }}: match[1]
    };
    {{- else -}}
    const attrs = match[1] || '';
    {{ if $paired -}}
    const contents = match[2] || '';
    {{ end -}}
    const attrRe = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    const parsed = {};
    let m;
    while ((m = attrRe.exec(attrs)) !== null) {
      parsed[m[1]] = (m[2] !== undefined) ? m[2] : (m[3] !== undefined) ? m[3] : (m[4] !== undefined) ? m[4] : true;
    }
    return {
      {{- range $fieldMetasNamed }}
      {{ .name }}: {{ if eq .widget "boolean" }}parsed.{{ .name }} === true || parsed.{{ .name }} === 'true'{{ else }}parsed.{{ .name }} || ''{{ end }},
      {{- end }}
      {{ if $paired }}contents: contents.trim(),{{ end }}
    };
    {{- end }}
  },

  {{/* Serialize the editor field object back into a Hugo shortcode string.
         - Positional: outputs the single value directly after the shortcode name.
         - Named args: appends each non-empty field as key="value".
         - Paired shortcodes wrap the inner content between opening and closing tags. */}}
  toBlock: function (obj) {
    const open = '{{`{{<` | safeHTML }}';
    const close = '{{`>}}` | safeHTML }}';
    {{ if $positional -}}
    return open + ' {{ $shortcode }} ' + (obj.{{ (index $fieldMetas 0).name }} || '') + ' ' + close;
    {{- else -}}
    let shortcode = open + ' {{ $shortcode }}';
    {{- range $fieldMetasNamed }}
    if (obj.{{ .name }}) shortcode += ' {{ .name }}="' + obj.{{ .name }} + '"';
    {{- end }}
    shortcode += ' ' + close;
    {{ if $paired -}}
    shortcode += obj.contents;
    shortcode += '{{`{{<` | safeHTML }} /{{ $shortcode }} ' + close;
    {{ end -}}
    return shortcode;
    {{- end }}
  },

  {{/* Render a live HTML preview in the editor using the field values. */}}
  toPreview: function (obj) {
    return `{{ $preview | safeHTML }}`;
  }
});
