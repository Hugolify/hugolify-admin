{{- /* Widget for the `meta.path` field of nested collections (Hugo branch bundles).

  Decap stores in `meta.path` the *full* folder of the entry, its own folder
  included, and never appends the generated slug (see `selectCustomPath`: as soon
  as `index_file` is set, the path is `folder + meta.path + /_index.md`). Editors
  therefore had to retype the whole path, and saving without touching the
  prefilled value raised `pathExists`.

  This widget turns that field into a parent picker: the editor selects a page
  and the slug is appended from the title. Moving an existing page keeps its own
  folder name — only the parent changes. */ -}}
(function () {
  var h = window.h;

  // Kept ASCII on purpose: `[a-z0-9-]` is left untouched by Decap's own
  // `sanitizeSlug`, whatever the `slug` options of the site, so the value we
  // emit always passes `validateMetaField`.
  function slugify(value) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function segments(path) {
    return (path || '').split('/').filter(Boolean);
  }

  function parentOf(path) {
    var parts = segments(path);
    parts.pop();
    return parts.join('/');
  }

  function join(parent, segment) {
    return parent ? parent + '/' + segment : segment;
  }

  // `<folder>/<meta path>/<index file>.md` — taking the directory also sidesteps
  // the locale suffix of the `multiple_files` i18n structure.
  function metaPathOf(entryPath, folder) {
    return parentOf(entryPath).slice(folder.length + 1);
  }

  var NEW_ROUTE = /\/collections\/[^/]+\/new(\?|$)/;

  function currentUrl() {
    return window.location.hash || window.location.search || '';
  }

  // Decap prefills the folder being browsed as `?path=` on the new entry route.
  function pathFromLocation() {
    var url = currentUrl();
    var mark = url.indexOf('?');
    if (mark < 0) return '';
    return new URLSearchParams(url.slice(mark + 1)).get('path') || '';
  }

  var NestedPathControl = window.createClass({
    getInitialState: function () {
      // Only a parent picked by hand lives in the state. Everything else is
      // derived on render, because the draft of an existing entry is loaded
      // asynchronously: freezing it at mount would capture an empty entry.
      return { chosen: null, prefill: this.props.value || pathFromLocation() };
    },

    // Without this the wrapper re-renders the control on `value` changes only,
    // so the path would follow neither the title, the query, nor the select.
    shouldComponentUpdate: function (nextProps, nextState) {
      return this.state.chosen !== nextState.chosen
        || this.props.value !== nextProps.value
        || this.props.entry !== nextProps.entry
        || this.props.queryHits !== nextProps.queryHits
        || this.props.classNameWrapper !== nextProps.classNameWrapper;
    },

    componentDidMount: function () {
      // An empty search term matches every entry, so this lists the collection.
      this.props.query(this.props.forID, this.props.collection.get('name'), [this.identifier()], '');
      this.sync();
    },

    componentDidUpdate: function () {
      this.sync();
    },

    identifier: function () {
      return this.props.collection.get('identifier_field') || 'title';
    },

    // The route is what Decap itself reads to tell a creation apart, and it
    // stays right even when a restored local backup says otherwise.
    isNew: function () {
      return Boolean(this.props.entry.get('newRecord')) || NEW_ROUTE.test(currentUrl());
    },

    // An existing entry whose draft has not landed yet must not be written to.
    ready: function () {
      return this.isNew() || Boolean(this.props.entry.get('path'));
    },

    // Empty until the entry is loaded, and empty for a new one.
    metaPath: function () {
      var entryPath = this.props.entry.get('path');
      return entryPath ? metaPathOf(entryPath, this.props.collection.get('folder')) : '';
    },

    parent: function () {
      if (this.state.chosen !== null) return this.state.chosen;
      return this.isNew() ? this.state.prefill : parentOf(this.metaPath());
    },

    // `null` on a new entry, where the folder name follows the title. On an
    // existing one it is kept as is, so renaming the title moves nothing.
    ownSlug: function () {
      return this.isNew() ? null : (segments(this.metaPath()).pop() || '');
    },

    slug: function () {
      var own = this.ownSlug();
      if (own !== null) return own;
      var title = this.props.entry.getIn(['data', this.identifier()]);
      // Falling back keeps the field valid while the title is still empty, so
      // the only error shown is the one on the title itself.
      return slugify(title && title.toString()) || 'untitled';
    },

    sync: function () {
      if (!this.ready()) return;
      var next = join(this.parent(), this.slug());
      // `lastEmitted` guards against a render loop should the value not make it
      // back through the draft.
      if (!next || next === this.props.value || next === this.lastEmitted) return;
      this.lastEmitted = next;
      this.props.onChange(next);
    },

    options: function () {
      var props = this.props;
      var folder = props.collection.get('folder');
      var identifier = this.identifier();
      var parent = this.parent();
      var own = this.metaPath();
      // `meta.path` holds every segment but the index file, so a parent may only
      // be one level shallower than that.
      var maxSegments = (props.collection.getIn(['nested', 'depth']) || 2) - 2;

      var options = (props.queryHits || []).map(function (hit) {
        var value = metaPathOf(hit.path, folder);
        return { value: value, label: (hit.data && hit.data[identifier]) || hit.slug || value };
      }).filter(function (option) {
        if (!option.value) return false;
        if (segments(option.value).length > maxSegments) return false;
        // A page cannot be moved inside itself or one of its descendants.
        return !own || (option.value !== own && option.value.indexOf(own + '/') !== 0);
      });

      // The chosen parent must stay selectable while the query is in flight.
      if (parent && !options.some(function (o) { return o.value === parent; })) {
        options.push({ value: parent, label: segments(parent).pop() || parent });
      }

      options.sort(function (a, b) { return a.value < b.value ? -1 : a.value > b.value ? 1 : 0; });
      options.unshift({ value: '', label: props.collection.get('label') || props.collection.get('name') });
      return options;
    },

    change: function (event) {
      this.setState({ chosen: event.target.value });
    },

    render: function () {
      var props = this.props;

      return h('select', {
        id: props.forID,
        className: props.classNameWrapper,
        value: this.parent(),
        onChange: this.change,
        onFocus: props.setActiveStyle,
        onBlur: props.setInactiveStyle
      }, this.options().map(function (option) {
        var depth = segments(option.value).length;
        return h('option', { key: option.value, value: option.value },
          new Array(depth + 1).join('\u00A0\u00A0\u00A0') + (depth ? '\u21B3 ' : '') + option.label);
      }));
    }
  });

  CMS.registerWidget('nested_path', NestedPathControl);
})();
