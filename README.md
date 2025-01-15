# hugolify-admin

`[BETA]`

## CMS available
- Decap CMS: https://decapcms.org/docs/
- Netlify CMS `deprecated`
- Static CMS: https://staticjscms.netlify.app/ `deprecated`
- Sveltia CMS: https://github.com/sveltia/sveltia-cms

## Install

Edit `config/_default/module.yaml` to install the `hugolify-admin` module:

```yml
imports:
  - path: github.com/hugolify/hugolify-admin
```

E.g: Hugolify setting for a blog

```yml
imports:
  - path: github.com/hugolify/hugolify-posts-categories
  - path: github.com/hugolify/hugolify-posts
  - path: github.com/hugolify/hugolify-theme
  - path: github.com/hugolify/hugolify-admin
```

## Params

Edit `config/_default/params.yaml` to customize this module:

```yml
params:
  admin:
    cms: decapcms # All CMS available https://www.hugolify.io/docs/cms/admin/cms/
    config:
      id: false # set true to use ID for dir/name files and relation 
    i18n:
      default_locale: en # master lang for an i18n website 
      locales: false # "[en,fr]" for an i18n website
    media:
      max_file_size: 700000

    # Cloud asset config (optional)
    media_library:
      name: # cloudinary or uploadcare
      config:
        cloud_name: # for cloudinary
        api_key: # for cloudinary
        public_key: # for uploadcare
        tabs: # for uploadcare

    nested:
      depth: 5 # set minimum 2

    # Add Netlify identity
    netlify:
      identity: true

    preview: false

    # Blocks
    blocks:
      # All blocks available https://www.hugolify.io/docs/blocks/
      enable:
        - alert
        - cta
        - editorial
        - faq
        - figure
        - form
        - information
        - images
        - latest
        - paragraph
        - quote
        - selected
        - title

    # Collections
    collections:
      # Collections (except indexes and pages) are automatically added based on Hugo modules config, but you can hide a collection if needed.
      indexes:
        enable: true
      pages: 
        enable: true

        # Override fields of collection fields
        fields:
          - draft
          - title_page
          - description
          - body

    # Fields
    fields:
      # Override fields of hugolify fields
      hero:
        - title
        - text_markdown
```

## Documentation

https://www.hugolify.io/docs/cms/admin/

## Licensing

Hugolify is free for personal or commercial services (MIT license)
