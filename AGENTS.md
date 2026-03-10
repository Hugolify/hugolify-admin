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
│   └── partials/admin/
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
│       ├── datas/                   # Data structure configs (nav, footer, SEO…)
│       ├── func/                    # Hugo template utility functions
│       └── archetypes/              # Archetype generation
├── i18n/                            # 20 language files (en.yml, fr.yml…)
├── static/admin/                    # CSS, logos, email templates
└── hugo.yaml                        # Module mounts + all default params
```

## Core architecture pattern

### Build flow
```
content/admin/config.md
  → layouts/admin/single.yml
    → partials/admin/cms/{cms}/config.yml
      → partials/admin/collections/index.yml
        → partials/admin/fields/{field}.yml
          → partials/admin/widgets/{widget}.js
```

### Field system
Each field is a `.yml` partial that calls a widget partial:

```
# layouts/partials/admin/fields/body.yml
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
1. Create `layouts/partials/admin/fields/{field-name}.yml`
2. Build a `$args` dict with `label` (from i18n) and `name`
3. Call the appropriate widget partial
4. Add i18n keys in `i18n/en.yml` (and other languages)

### New widget
1. Create `layouts/partials/admin/widgets/{widget-name}.js`
2. Add a branch for each CMS in the `if/else if` chain
3. Document accepted params in a comment at the top (see `string.js` for reference)

### New block type
1. Create `layouts/partials/admin/blocks/types/{block-name}.yml`
2. Optionally add block-specific fields in `blocks/fields/`
3. Add the block to `hugo.yaml` under `params.admin.blocks.enable`
4. Add i18n keys: `admin.blocks.{block}.label`

### New collection
1. Create `layouts/partials/admin/collections/{collection-name}.yml`
2. Register it in the collections index
3. Add i18n keys: `admin.collections.{collection}.label`

### New CMS support
1. Create `layouts/partials/admin/cms/{cms-name}/config.yml`
2. Add branches in all widget `.js` files
3. Register the CMS name as a valid value for `params.admin.cms`

## Development notes

- This module is imported by Hugo sites — it is **not run standalone**
- Test changes by using the module in a full Hugo site (`hugo server`)
- Templates use `.yml` extension but are Go templates processed by Hugo
- Widget partials use `.js` extension — they produce text, not actual JS files
- `transform.Remarshal "yaml"` is used to clean/normalize YAML output
- The `func/` partials handle cross-cutting concerns like `GetFields`, `GetOptions`, `GetTinaName`, `GetCloudcannonInputsAndStructures`
