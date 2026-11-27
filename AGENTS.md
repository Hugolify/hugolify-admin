# hugolify-admin — Guide for AI Assistants

## What this project is

`hugolify-admin` is a **Hugo module** that generates CMS admin configuration files (YAML/JS/JSON) for multiple headless CMS platforms. It provides a unified abstraction layer over 7 CMS systems so a single Hugo-based site can switch CMS by changing one parameter.

It is **not a web app** — it produces configuration files consumed by CMS frontends.

## Tech stack

- **Hugo** static site generator (Go templates, `.yml` / `.html` / `.js` templates)
- **Go module** (`go.mod`): `github.com/hugolify/hugolify-admin`
- **No npm build pipeline** — Hugo handles everything
- **Output formats**: `admin_config_yml` (YAML), `admin_config_js` (JS for Tina), `admin_archetypes_json` (JSON)

## Project structure

```
hugolify-admin/
├── content/admin/config.md          # Entry point: triggers config generation
├── layouts/
│   ├── admin/
│   │   ├── single.yml               # Routes to CMS-specific YAML config partial
│   │   ├── single.js                # Routes to CMS-specific JS config partial (TinaCMS)
│   │   └── single.archetypes.json   # Generates archetypes JSON
│   └── _partials/admin/
│       ├── cms/                     # CMS-specific config generators
│       │   ├── decapcms/config.yml  # Decap CMS root config
│       │   ├── sveltiacms/config.yml
│       │   ├── cloudcannon/config.yml
│       │   ├── pagescms/config.yml
│       │   ├── staticcms/config.yml
│       │   ├── netlifycms/config.yml
│       │   └── tinacms/
│       ├── collections/             # Collection type definitions
│       ├── blocks/                  # Block type definitions
│       │   ├── types/               # One file per block type
│       │   └── fields/              # Block-specific field groups
│       ├── fields/                  # Reusable field definitions (200+ files)
│       ├── widgets/                 # Widget implementations (one .js per widget)
│       │   └── icon/                # The icon widget's helpers: catalog, known sets, script tags
│       ├── datas/                   # Data structure configs (nav, footer, SEO…)
│       ├── func/                    # Hugo template utility functions
│       └── archetypes/              # Archetype generation
├── assets/admin/widgets/icon/       # The icon widget's client JS and CSS, published with a fingerprint
├── i18n/                            # 20 language files (en.yml, fr.yml…)
├── static/admin/                    # CSS, logos, email templates
└── hugo.yaml                        # Module mounts + all default params
```

## Core architecture pattern

### Build flow
```
content/admin/config.md
  → layouts/admin/single.yml
    → _partials/admin/cms/{cms}/config.yml
      → _partials/admin/collections/index.yml
        → _partials/admin/fields/{field}.yml
          → _partials/admin/widgets/{widget}.js
```

### Field system
Each field is a `.yml` partial that calls a widget partial:

```
# layouts/_partials/admin/fields/body.yml
{{- $args := dict
  "label" (i18n "admin.fields.body.label")
  "name"  "body"
  -}}
{{ partial "admin/widgets/markdown.js" $args }}
```

### Widget system
Each widget `.js` partial handles all CMS variants via `if/else if` on `site.Params.admin.cms`:
- CloudCannon → JS object
- Pages CMS → JS object
- Tina CMS → JS object with `name` field
- Decap/Netlify/Static/Sveltia CMS → JS object

Example pattern from `widgets/string.js`:
```go
{{- $cms := site.Params.admin.cms }}
{{ if eq $cms "cloudcannon" }}
  ...CloudCannon syntax...
{{ else if eq $cms "pagescms" }}
  ...Pages CMS syntax...
{{ else if eq $cms "tinacms" }}
  ...Tina CMS syntax...
{{ else }}
  ...YAML for Decap/Netlify/Static/Sveltia...
{{ end }}
```

### i18n
All user-facing labels come from `i18n/` files. Keys follow the pattern:
- `admin.fields.{field}.label`
- `admin.fields.{field}.hint`
- `admin.blocks.{block}.label`
- `admin.collections.{collection}.label`

Write apostrophes as `’`, never `'`: templates print i18n strings inside single quotes (`label: '{{ $label }}'`), so a straight one ends the string. `func/CurlyApostrophes.html` curls them as a safety net (for a site overriding a key too) wherever generated text is parsed: `RemarshalYaml`, `ConvertJSObjectToJson` and the Tina config. Send any new YAML output through `RemarshalYaml` rather than `transform.Remarshal`.

## CMS supported

| CMS | Status | Config file |
|-----|--------|-------------|
| Decap CMS | Active | `cms/decapcms/config.yml` |
| Sveltia CMS | Active | `cms/sveltiacms/config.yml` |
| Pages CMS | Active | `cms/pagescms/config.yml` |
| CloudCannon | Beta | `cms/cloudcannon/config.yml` |
| Tina | Beta | `cms/tinacms/` |
| Netlify CMS | Deprecated | `cms/netlifycms/config.yml` |
| Static CMS | Deprecated | `cms/staticcms/config.yml` |

## Key configuration (`hugo.yaml` / `params.yaml`)

The active CMS is set in params:
```yaml
params:
  admin:
    cms: decapcms   # or sveltiacms, pagescms, cloudcannon, tinacms…
```

Other important params: `branch`, `git`, `repo`, `media.*`, `auth.*`, `blocks.enable`, `collections.*`, `fields.*`

## How to add things

### New field
1. Create `layouts/_partials/admin/fields/{field-name}.yml`
2. Build a `$args` dict with `label` (from i18n) and `name`
3. Call the appropriate widget partial
4. Add i18n keys in `i18n/en.yml` (and other languages)

### New widget
1. Create `layouts/_partials/admin/widgets/{widget-name}.js`
2. Add a branch for each CMS in the `if/else if` chain
3. Document accepted params in a comment at the top (see `string.js` for reference)

### New custom widget
A widget the CMS doesn't ship, written in JS for Decap and Sveltia CMS (`select_toggle`, `icon`). Its files all carry its name, so nothing new appears at the top of `_partials/admin/`:
1. The config: `widgets/{name}.js`, or a branch of an existing widget (`select.js` writes `select_toggle` when a field has `toggle`). Other CMS get a built-in widget instead, so the front matter keeps one shape
2. One component per CMS: `cms/{cms}/widgets/{name}.js`, listed in `cms/{cms}/widgets.js`
3. Only when the widget needs more (`icon` does, `select_toggle` doesn't):
   - build-side helpers in `widgets/{name}/` (`icon`: `catalog.html`, `sets.html`)
   - client code the CMS share, and styles, as plain JS and CSS in `assets/admin/widgets/{name}/`, published with a fingerprint under `/admin/widgets/{name}/`
   - their tags in `widgets/{name}/scripts.html`, included by `cms/{cms}/custom.html` before the widgets, which read them

### New block type
1. Create `layouts/_partials/admin/blocks/types/{block-name}.yml`
2. Optionally add block-specific fields in `blocks/fields/`
3. Add the block to `hugo.yaml` under `params.admin.blocks.enable`
4. Add i18n keys: `admin.blocks.{block}.label`

### New collection
1. Create `layouts/_partials/admin/collections/{collection-name}.yml`
2. Register it in the collections index
3. Add i18n keys: `admin.collections.{collection}.label`

### New CMS support
1. Create `layouts/_partials/admin/cms/{cms-name}/config.yml`
2. Add branches in all widget `.js` files
3. Register the CMS name as a valid value for `params.admin.cms`

## Development notes

- This module is imported by Hugo sites — it is **not run standalone**
- Test changes by using the module in a full Hugo site (`hugo server`)
- Templates use `.yml` extension but are Go templates processed by Hugo
- Widget partials use the `.js` extension: they produce text, not actual JS files. The real JS and CSS files are under `assets/admin/`
- `transform.Remarshal "yaml"` is used to clean/normalize YAML output
- The `func/` partials handle cross-cutting concerns like `GetFields`, `GetOptions`, `GetTinaName`, `GetCloudcannonInputsAndStructures`
- A collection option has one name for every CMS (`create`, `sortable_fields`, `summary_fields`…). `collections/config/{option}.yml` hands it to `cms/{cms}/collection/config/{option}.yml`, which writes it the way that CMS reads it, or not at all when it has no equivalent. `func/GetViewFields.html` normalises the list options, and Pages CMS gathers them under `view` in its own `view.yml`
- CloudCannon output goes through `func/ConvertJSObjectToJson.html`, a regex converter to JSON, wherever a field or a file is read back (the *config* collection, the structures). Write what both YAML and that converter read: quoted keys (`'paragraph-list': {`, a bare key stops at a hyphen) and list items in braces (`[{ key: title }]`, as `[key: title]` is a map only in YAML)
- A per-collection partial is called with `partial`, or `partialCached` with the collection as variant key: the context is not part of the cache key, so without one every collection gets the output of the first
- The root config of a CMS keeps its languages and its media in `cms/{cms}/i18n.yml` and `cms/{cms}/media.yml`; Netlify and Static CMS read those of Decap. The languages come from `func/GetLocales.html`, which reads `admin.i18n.locales` as a string (`"[en,fr]"`) or a list, and keeps `default_locale` only when it is listed
- Pages CMS (v3) rejects any key it does not know on a content entry, a field or a block type; only `options` takes free keys. Its output drops what the shared definitions write for Decap: `label_singular`, and the `type` and `required` of a block type, a variant of its block field rather than a field (`cms/pagescms/collection/convert.yml` and `fields.html`)
- `func/RemarshalCollections.html` writes the collections of every YAML config, one remarshal per collection, and names no CMS: each config passes its options (`key`, `dividers`), and a CMS whose keys differ from Decap's converts each collection in `cms/{cms}/collection/convert.yml`
- `func/GetCollections.html` decides which collections a CMS config lists, and in which order (`params.admin.collection_groups`). Range over it rather than over `site.Params.admin.collections`, a map that Go templates always walk in alphabetical order
- The look a block starts with is **not** configured here: it lives in the theme, under `params.blocks.{block}.ui`, resolved by `func/GetBlockUI.html` of `hugolify-theme`. This module deliberately writes no `default` for those fields — a CMS default is saved to the front matter of every entry, a theme default is not
