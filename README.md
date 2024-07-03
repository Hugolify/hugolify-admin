# hugolify-admin

## CMS available
- Decap CMS
- Netlify CMS
- Static CMS
- Sveltia CMS

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
    cms: decapcms
    default_locale: en
    locales: [en, fr]
    media:
      max_file_size: 700000
    nested:
      depth: 5
    netlify:
      identity: true
    preview: false

    collections:
      - pages
      - posts
```

## Documentation

https://www.hugolify.io/docs/

## Licensing

Hugolify is free for personal or commercial services (MIT license)
