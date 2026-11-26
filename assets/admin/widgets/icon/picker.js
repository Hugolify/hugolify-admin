/**
 * window.hugolifyIcons: what the icon field (cms/<cms>/widgets/icon.js) and
 * the icon shortcode preview (cms/decapcms/shortcodes/icon.js) share, for
 * Decap and Sveltia CMS alike. Its styles are in picker.css, next to it.
 *
 * - load(): the icon catalog (layouts/_partials/admin/widgets/icon/catalog.html),
 *   fetched once for every field, or null when the site has none or it can't
 *   be loaded
 * - thumbnail(element, value): draws the icon a value names in an element,
 *   the way the site does (a mask over currentColor, so it follows the CMS
 *   theme); resolves to "ok", "empty", "unknown" (no such icon installed) or
 *   "none" (no catalog)
 * - open({ value, brands, onSelect }): the dialog, a searchable grid of the
 *   installed icons; onSelect gets the chosen name
 * - src(icon): an image URL for the shortcode preview: the site's own drawing
 *   once a field has loaded its set, a CDN otherwise, '' for a set it doesn't
 *   know
 * - text: the dialog's and the field's labels
 *
 * Each set's SVGs come joined in one file
 * (/admin/widgets/icon/<folder>.<hash>.svg), loaded when an icon of that set
 * is first drawn. The dialog also loads, as it opens,
 * the sets that keep their tags there (Tabler), for the search; the others,
 * brands' 5 MB included, wait until one of their icons shows.
 *
 * Plain JavaScript, not a template: what it needs from Hugo (the catalog's
 * URL, the default set, the sets' titles, the labels) comes as JSON in the
 * data-config attribute of its script tag, written by
 * layouts/_partials/admin/widgets/icon/scripts.html. That tag comes before
 * the shortcodes and the widgets, which read window.hugolifyIcons.
 */
window.hugolifyIcons = (() => {
  let config = {};
  try {
    config = JSON.parse(document.currentScript?.dataset.config || '{}');
  } catch (error) {
    console.warn('[icons] unreadable data-config', error);
  }
  const catalogURL = config.catalog || '';
  const defaultSet = config.default || 'lucide';
  const titles = config.titles || {};
  const text = config.text || {};

  // ---------------------------------------------------------------------------
  // Catalog

  // Tags as the engine filters them: Lucide lists its groups ($group:…), a set may repeat the name
  const clean = (tags, name) =>
    String(tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && tag !== name && !tag.startsWith('$'))
      .slice(0, 8)
      .join(', ');

  const setTags = (item, tags) => {
    item.tags = clean(tags, item.name);
    item.hay = `${item.name} ${item.tags}`.toLowerCase();
  };

  // One group per set, as the dialog shows them: the default set first, with the site's own
  // icons (ui), which hide the default set's icons of the same name, as on the site; brands last
  const prepare = (data) => {
    const folders = new Map();
    const groups = new Map();
    data.sets.forEach((set) => {
      const folder = {
        dir: set.dir,
        url: set.svg,
        comments: !!set.comments,
        items: [],
        byName: new Map()
      };
      set.names.forEach((name, index) => {
        const item = { name, value: set.prefix + name, folder, index };
        setTags(item, set.tags[index]);
        folder.items.push(item);
        folder.byName.set(name, item);
      });
      folders.set(set.dir, folder);
    });
    const own = folders.get('ui');
    folders.forEach((folder) => {
      const dir = folder.dir === 'ui' ? data.default : folder.dir;
      if (!groups.has(dir)) {
        groups.set(dir, { dir, title: titles[dir] || dir, items: [] });
      }
      const items =
        folder.dir === data.default && own
          ? folder.items.filter((item) => !own.byName.has(item.name))
          : folder.items;
      groups.get(dir).items.push(...items);
    });
    const rank = (group) =>
      group.dir === data.default ? 0 : group.dir === 'brands' ? 2 : 1;
    const list = [...groups.values()].sort((a, b) => rank(a) - rank(b));
    list.forEach((group) =>
      group.items.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      )
    );
    return {
      default: data.default,
      stroke: data.strokeWidth ?? 2,
      folders,
      groups: list
    };
  };

  let catalog = null;
  let loading;
  const load = () => {
    if (!catalogURL) {
      return Promise.resolve(null);
    }
    loading ??= fetch(catalogURL)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => (catalog = data ? prepare(data) : null))
      .catch(() => null);
    return loading;
  };

  // A set's drawings: its file cut after each </svg>, one piece per name, in the catalog's order
  const sprite = (folder) => {
    folder.loading ??= fetch(folder.url)
      .then((response) => (response.ok ? response.text() : ''))
      .then((svg) => {
        const pieces = svg.split('</svg>').slice(0, -1);
        if (pieces.length !== folder.items.length) {
          console.warn(
            `[icons] ${folder.url}: ${pieces.length} drawings for ${folder.items.length} names, not drawn`
          );
          return null;
        }
        folder.svgs = pieces.map((piece) => `${piece}</svg>`);
        if (folder.comments) {
          folder.items.forEach((item, index) => {
            const found = /tags:\s*\[([^\]]*)\]/.exec(pieces[index]);
            if (found) setTags(item, found[1]);
          });
        }
        return folder.svgs;
      })
      .catch(() => null);
    return folder.loading;
  };

  // What a value draws, the way the engine resolves it (head/icons.html in hugolify-theme-icons):
  // a name of the default set looks in the site's own icons first; solid: serves a set's own
  // <name>-fill drawing, or fills the outline
  const resolve = (value) => {
    let name = String(value || '').trim();
    const solid = name.startsWith('solid:');
    if (solid) name = name.slice(6);
    if (!catalog || !name) return null;
    const i = name.indexOf(':');
    const prefix = i < 0 ? '' : name.slice(0, i);
    name = name.slice(i + 1);
    const dir = !prefix
      ? catalog.default
      : prefix === 'brand'
      ? 'brands'
      : prefix;
    const get = (folder, key) => catalog.folders.get(folder)?.byName.get(key);
    const own = dir === catalog.default ? get('ui', name) : null;
    if (solid && !own) {
      const fill = get(dir, `${name}-fill`);
      if (fill) return { item: fill, solid: false };
    }
    const item = own || get(dir, name);
    return item ? { item, solid } : null;
  };

  // The SVG as the site's stylesheet holds it: the site's stroke width, solid filled in,
  // comments out, and an opaque color, as only a mask's alpha counts
  const drawings = new Map();
  const drawing = (item, solid) => {
    const key = `${item.folder.dir}/${item.index}/${solid ? 1 : 0}`;
    if (!drawings.has(key)) {
      let svg = item.folder.svgs[item.index];
      if (item.folder.dir !== 'brands' && catalog.stroke !== 2) {
        svg = svg.replace(
          /stroke-width="2"/g,
          `stroke-width="${catalog.stroke}"`
        );
      }
      if (solid) {
        svg = svg.replace(/fill="none"/g, 'fill="currentColor"');
      }
      svg = svg
        .replace(/<!--[\s\S]*?-->\s*/g, '')
        .replace(/currentColor/g, '#000')
        .replace(/\s+/g, ' ')
        .trim();
      drawings.set(key, `data:image/svg+xml,${encodeURIComponent(svg)}`);
    }
    return drawings.get(key);
  };

  // Paints an icon as the site does, a mask over currentColor: it takes the CMS's text color,
  // dark theme included. `token` drops a drawing that arrives after the element moved on
  const paint = (element, item, solid, token = element) => {
    const apply = () => {
      if (!item.folder.svgs || element.hugolifyIcon !== token) return;
      const url = `url("${drawing(item, solid)}")`;
      element.style.webkitMaskImage = url;
      element.style.maskImage = url;
      element.style.backgroundColor = 'currentColor';
    };
    element.hugolifyIcon = token;
    if (item.folder.svgs) {
      apply();
    } else {
      sprite(item.folder).then(apply);
    }
  };

  const thumbnail = async (element, value) => {
    const token = {};
    element.hugolifyIcon = token;
    element.style.webkitMaskImage = '';
    element.style.maskImage = '';
    element.style.backgroundColor = '';
    if (!(await load())) return 'none';
    if (element.hugolifyIcon !== token) return 'stale';
    if (!String(value || '').trim()) return 'empty';
    const found = resolve(value);
    if (!found) return 'unknown';
    paint(element, found.item, found.solid, token);
    return 'ok';
  };

  // ---------------------------------------------------------------------------
  // Shortcode preview

  // Without the set loaded yet: the set's SVGs on a CDN. The aliases are the ones the set
  // modules ship for the themes' own names; Bootstrap Icons draws solid: as <name>-fill
  const cdn = 'https://cdn.jsdelivr.net/npm';
  const tablerAliases = {
    play: 'player-play',
    pause: 'player-pause',
    'contact-round': 'user-square-rounded'
  };
  const bootstrapAliases = {
    'map-pin': 'geo-alt',
    'contact-round': 'person-vcard'
  };
  const urls = {
    brand: (n) => `${cdn}/simple-icons/icons/${n}.svg`,
    lucide: (n) => `${cdn}/lucide-static/icons/${n}.svg`,
    tabler: (n) =>
      `${cdn}/@tabler/icons@3/icons/outline/${tablerAliases[n] || n}.svg`,
    bootstrap: (n, solid) =>
      `${cdn}/bootstrap-icons@1/icons/${bootstrapAliases[n] || n}${
        solid ? '-fill' : ''
      }.svg`
  };

  const src = (icon) => {
    const found = resolve(icon);
    if (found?.item.folder.svgs) {
      return drawing(found.item, found.solid);
    }
    const value = String(icon || '').trim();
    const solid = value.startsWith('solid:');
    const name = value.replace(/^solid:/, '');
    const i = name.indexOf(':');
    const url = name && urls[i < 0 ? defaultSet : name.slice(0, i)];
    return url ? url(name.slice(i + 1), solid) : '';
  };

  // ---------------------------------------------------------------------------
  // Dialog

  const el = (tag, className, props = {}) =>
    Object.assign(document.createElement(tag), { className, ...props });

  // Icons are added as the grid scrolls: a few hundred buttons at a time open the dialog at once
  const chunk = 240;

  const open = async ({
    value = '',
    brands = false,
    onSelect = () => {}
  } = {}) => {
    if (!(await load())) return;
    const groups = catalog.groups.filter(
      (group) => brands || group.dir !== 'brands'
    );
    const selected = resolve(value)?.item;

    const dialog = el('dialog', 'hugolify-icons');
    dialog.setAttribute('aria-labelledby', 'hugolify-icons-title');
    const panel = el('div', 'hugolify-icons__panel');
    const head = el('div', 'hugolify-icons__head');
    const close = el('button', 'hugolify-icons__close', {
      type: 'button',
      title: text.close,
      textContent: '×'
    });
    close.setAttribute('aria-label', text.close);
    head.append(
      el('h2', 'hugolify-icons__title', {
        id: 'hugolify-icons-title',
        textContent: text.title
      }),
      close
    );
    const search = el('input', 'hugolify-icons__search', {
      type: 'search',
      placeholder: text.search,
      autocomplete: 'off',
      spellcheck: false,
      autofocus: true
    });
    search.setAttribute('aria-label', text.search);
    const sets = el('div', 'hugolify-icons__sets');
    const body = el('div', 'hugolify-icons__body');
    panel.append(head, search, sets, body);
    dialog.append(panel);

    let query = '';
    let only = '';
    let rows = [];
    let shown = 0;
    let grid = null;

    // Every word must match the name or a tag; the name itself first
    const filter = () => {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const name = words.join('-');
      const rank = (item) =>
        item.name === name
          ? 0
          : item.name.startsWith(name)
          ? 1
          : item.name.includes(name)
          ? 2
          : 3;
      return groups.map((group) => {
        if (!words.length) return { group, items: group.items };
        const items = group.items.filter((item) =>
          words.every((word) => item.hay.includes(word))
        );
        return {
          group,
          items: items
            .map((item) => [rank(item), item])
            .sort((a, b) => a[0] - b[0])
            .map(([, item]) => item)
        };
      });
    };

    const cell = (item) => {
      const button = el('button', 'hugolify-icons__icon', {
        type: 'button',
        title: item.tags ? `${item.value} · ${item.tags}` : item.value
      });
      button.dataset.value = item.value;
      if (item === selected) button.setAttribute('aria-current', 'true');
      const glyph = el('span', 'hugolify-icons__glyph');
      glyph.setAttribute('aria-hidden', 'true');
      button.append(
        glyph,
        el('span', 'hugolify-icons__name', { textContent: item.name })
      );
      paint(glyph, item, false);
      return button;
    };

    const more = () => {
      const end = Math.min(rows.length, shown + chunk);
      for (; shown < end; shown += 1) {
        const row = rows[shown];
        if (row.heading) {
          body.append(
            el('h3', 'hugolify-icons__heading', { textContent: row.heading })
          );
          grid = null;
        } else {
          if (!grid) {
            grid = el('div', 'hugolify-icons__grid');
            body.append(grid);
          }
          grid.append(cell(row));
        }
      }
    };

    // Fill the visible part, and a screen below it
    const fill = () => {
      while (
        shown < rows.length &&
        body.scrollTop + 2 * body.clientHeight > body.scrollHeight
      ) {
        more();
      }
    };

    const update = () => {
      const results = filter();
      if (groups.length > 1) {
        const chip = (dir, label, count) => {
          const button = el('button', 'hugolify-icons__set', {
            type: 'button'
          });
          button.setAttribute('aria-pressed', String(only === dir));
          button.append(
            label,
            el('span', 'hugolify-icons__count', { textContent: count })
          );
          button.addEventListener('click', () => {
            only = dir;
            update();
          });
          return button;
        };
        const total = results.reduce(
          (sum, result) => sum + result.items.length,
          0
        );
        sets.replaceChildren(
          chip('', text.all, total),
          ...results.map((result) =>
            chip(result.group.dir, result.group.title, result.items.length)
          )
        );
      }
      const visible = results.filter(
        (result) => (!only || result.group.dir === only) && result.items.length
      );
      rows = [];
      visible.forEach((result) => {
        if (visible.length > 1) rows.push({ heading: result.group.title });
        rows.push(...result.items);
      });
      body.replaceChildren();
      body.scrollTop = 0;
      shown = 0;
      grid = null;
      if (!rows.length) {
        body.append(
          el('p', 'hugolify-icons__empty', { textContent: text.empty })
        );
        return;
      }
      fill();
    };

    const choose = (chosen) => {
      onSelect(chosen);
      dialog.close();
    };

    let timer;
    const searchNow = () => {
      clearTimeout(timer);
      if (query !== search.value) {
        query = search.value;
        update();
      }
    };
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(searchNow, 80);
    });
    body.addEventListener('scroll', fill, { passive: true });
    body.addEventListener('click', (event) => {
      const button = event.target.closest('.hugolify-icons__icon');
      if (button) choose(button.dataset.value);
    });
    close.addEventListener('click', () => dialog.close());
    // A click on the dialog itself, not its panel, is a click on the backdrop
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', (event) => {
      // the CMS's own shortcuts stay out of the dialog; Escape still closes it
      event.stopPropagation();
      if (event.target === search) {
        if (event.key === 'Enter') {
          event.preventDefault();
          searchNow();
          const first = rows.find((row) => !row.heading);
          if (first) choose(first.value);
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          body.querySelector('.hugolify-icons__icon')?.focus();
        }
        return;
      }
      const steps = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: 'up',
        ArrowDown: 'down'
      };
      if (
        !(event.key in steps) ||
        !event.target.matches('.hugolify-icons__icon')
      )
        return;
      event.preventDefault();
      const icons = [...body.querySelectorAll('.hugolify-icons__icon')];
      const index = icons.indexOf(event.target);
      const columns = getComputedStyle(
        event.target.parentElement
      ).gridTemplateColumns.split(' ').length;
      const step = steps[event.key];
      const next =
        index + (step === 'up' ? -columns : step === 'down' ? columns : step);
      if (next < 0) {
        search.focus();
      } else {
        if (next >= icons.length - columns) more();
        (
          icons[next] ||
          body.querySelectorAll('.hugolify-icons__icon')[next] ||
          icons[icons.length - 1]
        ).focus();
      }
    });
    dialog.addEventListener('close', () => {
      clearTimeout(timer);
      dialog.remove();
    });

    // The drawings of the sets that keep their tags in them (Tabler), for the search, which may find
    // more then. The others load as their icons show: brands weigh 5 MB, and come last
    catalog.folders.forEach((folder) => {
      if (!folder.comments || (!brands && folder.dir === 'brands')) return;
      sprite(folder).then(() => {
        if (query && dialog.open) update();
      });
    });

    document.body.append(dialog);
    dialog.showModal();
    update();
  };

  return { load, thumbnail, open, src, text };
})();
