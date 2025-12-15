# hugolify-admin

## CMS available

- CloudCannon: <https://cloudcannon.com/> `beta`
- Decap CMS: <https://decapcms.org/>
- Netlify CMS `deprecated`
- Pages CMS: <https://pagescms.org/>
- Static CMS: <https://staticjscms.netlify.app/> `deprecated`
- Sveltia CMS: <https://github.com/sveltia/sveltia-cms>
- Tina: <https://tina.io/> `beta`

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
    
    # Config
    branch: main # Branch to update 
    git: git-gateway # or gitlab, gitea…
    repo: # Repository like owner-name/repo-name (optional)

    i18n:
      default_locale: en # master lang for an i18n website
      locales: false # "[en,fr]" for an i18n website

    # Media config
    media:
      media_folder: '/assets/images/uploads'
      public_folder: '/images/uploads'
      audio_max_file_size: 700000 # 700ko
      max_file_size: 700000 # 700ko
      pdf_max_file_size: 5000000 # 5Mo
      specific_filter: false # set true to add a selected filter by image
      video_max_file_size: 5000000 # 5Mo

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

    # Auth
    auth:
      app_id: # The Client ID provided by Gitea/GitLab
      api_root: # API URL of your Gitea/GitLab instance
      auth_endpoint: # Auth endpoint of your Gitea/GitLab instance
      base_url: # Root URL of your Gitea/GitLab instance
      netlify_identity: true # Add Netlify identity

    preview: false
    publish_mode: simple # simple or editorial_workflow

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
      # Collections (except config, indexes and pages) are automatically added based on Hugo modules config, but you can hide a collection if needed.
      config:
        enable: true
      indexes:
        enable: true
      pages:
        enable: true

        # Override fields of collection fields
        fields:
          - is_page
          - draft
          - title_page
          - description
          - body

    # Fields
    fields:
      # Override fields of hugolify fields
      hero:
        fields:
          - title
          - text_markdown
```

## Documentation

<https://www.hugolify.io/docs/cms/admin/>

## Licensing

Hugolify is free for personal or commercial services (MIT license)
