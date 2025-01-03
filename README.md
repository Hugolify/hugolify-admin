# hugolify-admin

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

## Params

Edit `config/_default/params.yaml` to customize this module:

```yml
params:
  admin:
    cms: decapcms # All CMS available https://www.hugolify.io/docs/cms/
    config:
      id: true # use ID for dir/name files and relation 
    i18n:
      default_locale: en # master lang for an i18n website 
      locales: false # "[en,fr]" for an i18n website
    locale: en # CMS lang
    media:
      max_file_size: 700000
    nested:
      depth: 5 # set minimum 2
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
      # Collections are automatically added based on Hugo modules config, but you can hide a collection if needed.
      indexes:
        enable: true
      pages: 
        enable: true
```

## Documentation

https://www.hugolify.io/docs/

## Licensing

Hugolify is free for personal or commercial services (MIT license)
