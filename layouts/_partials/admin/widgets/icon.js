{{/*
  Partial to generate an icon widget: a thumbnail of the icon and a button that
  opens a dialog showing the site's icons in a searchable grid
  (cms/<cms>/widgets/icon.js), for Decap and Sveltia CMS when
  hugolify-theme-icons provides its catalog (v1.9.0 or later). Anywhere else, a
  string widget, as before.

  - brands (boolean) also list the brand logos (brand:github)
  - hidden (boolean)
  - hint (string) the hint of the string fallback
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
  - required (boolean)

  The value stays the icon name as a string, so front matter keeps its shape.

  Its helpers sit in widgets/icon/: catalog.html (the site's icons, as JSON),
  sets.html (the sets known by name) and scripts.html (the field's script and
  styles, in the admin page).
*/}}

{{- $cms := site.Params.admin.cms }}
{{- /* Whether the engine can build a catalog, not the catalog itself: reading every icon while
       pages render breaks hugo server (see icon/scripts.html), the field loads it later */}}
{{- $catalog := false }}
{{- if in (slice "decapcms" "sveltiacms") $cms }}
  {{- $catalog = templates.Exists "_partials/func/icons/GetCatalog.html" }}
{{- end }}

{{- if or (not $catalog) .hidden }}

{{ partial "admin/widgets/string.js" . }}

{{- else }}

{{- $brands := .brands | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}
{{- $required := .required | default false }}
{{- /* read by icon/catalog.html, built once every field has rendered */}}
{{- with $brands }}{{ hugo.Store.Set "hugolify-admin-icons-brands" true }}{{ end }}

{{- /* The hint lists the installed sets, each linked to its own catalog. No prefix: the dialog
       writes the name, nobody types it */}}
{{- $catalogs := partialCached "admin/widgets/icon/sets.html" "icons" }}
{{- /* The sets the hint names: the default one, then the known ones the site mounts. One
       resources.GetMatch each stops at the first icon: the catalog itself isn't read here */}}
{{- $default := partialCached "func/icons/GetDefaultSet.html" "icons" }}
{{- $titles := slice }}
{{- range uniq (slice $default "lucide" "bootstrap" "tabler" "brands") }}
  {{- if and (or $brands (ne . "brands")) (resources.GetMatch (printf "icons/%s/*.svg" .)) }}
    {{- $title := . }}
    {{- with index $catalogs . }}{{ $title = printf "[%s](%s)" .title .url }}{{ end }}
    {{- $titles = $titles | append $title }}
  {{- end }}
{{- end }}
{{- $hint := printf "%s %s" (i18n "admin.fields.icon.hint_picker") (delimit $titles ", ") }}

{
  label: '{{ $label }}',
  hint: {{ $hint | jsonify }},
  name: '{{ $name }}',
  widget: 'icon',
  {{ with $brands }}
  brands: true,
  {{ end }}
  required: {{ $required }},
  i18n: {{ if or (eq $i18n true) (eq $i18n false) }}{{ $i18n }}{{ else }}'{{ $i18n }}'{{ end }}
}

{{- end }}
