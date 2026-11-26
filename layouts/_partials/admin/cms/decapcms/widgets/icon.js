{{- /* icon: the Decap CMS counterpart of cms/sveltiacms/widgets/icon.js. A
  thumbnail of the chosen icon and a button that opens a searchable grid of the
  installed icons (window.hugolifyIcons, assets/admin/widgets/icon/picker.js).
  The thumbnail opens it too, and tells the name on hover. An optional field
  also gets a button to remove the icon.

  Field options:
  - brands (boolean) also offer the brand logos (brand:github)

  The value stays the icon name as a string. Without a catalog (it can't be
  loaded), the field is the built-in string control alone, so the name can
  still be typed. */ -}}
(function () {
  var h = window.h;
  var string = CMS.getWidget('string');
  var icons = window.hugolifyIcons;

  var IconControl = window.createClass({
    getInitialState: function () {
      // ready: undefined while the catalog loads, then whether there is one
      return { ready: undefined, state: 'empty' };
    },

    componentDidMount: function () {
      var self = this;
      this.mounted = true;
      icons.load().then(function (catalog) {
        if (self.mounted) self.setState({ ready: !!catalog });
      });
    },

    componentDidUpdate: function (previous, before) {
      if (this.state.ready && (!before.ready || previous.value !== this.props.value)) this.draw();
    },

    componentWillUnmount: function () {
      this.mounted = false;
    },

    draw: function () {
      var self = this;
      if (!this.glyph) return;
      icons.thumbnail(this.glyph, this.props.value).then(function (state) {
        if (self.mounted && state !== 'stale') self.setState({ state: state });
      });
    },

    render: function () {
      var self = this;
      var props = this.props;
      var ready = this.state.ready;

      if (ready === false) {
        return h('div', { className: 'hugolify-icon-field__input' }, h(string.control, props));
      }

      var name = String(props.value || '').trim();
      var state = this.state.state;
      var optional = props.field.get('required') === false;
      var choose = function () {
        icons.open({ value: name, brands: !!props.field.get('brands'), onSelect: props.onChange });
      };

      return h(
        'div',
        { className: 'hugolify-icon-field' },
        h(
          'button',
          {
            key: 'preview',
            type: 'button',
            className: 'hugolify-icon-field__preview',
            'data-state': state,
            title: state === 'unknown' ? icons.text.unknown + ' (' + name + ')' : name || icons.text.choose,
            'aria-label': name ? icons.text.choose + ' (' + name + ')' : icons.text.choose,
            disabled: !ready,
            onClick: choose
          },
          h('span', {
            ref: function (element) {
              self.glyph = element;
            },
            className: 'hugolify-icon-field__glyph'
          })
        ),
        h(
          'button',
          {
            key: 'choose',
            id: props.forID,
            type: 'button',
            className: 'hugolify-icon-field__choose',
            disabled: !ready,
            onClick: choose
          },
          icons.text.choose
        ),
        optional &&
          name &&
          h(
            'button',
            {
              key: 'remove',
              type: 'button',
              className: 'hugolify-icon-field__remove',
              title: icons.text.remove,
              'aria-label': icons.text.remove,
              onClick: function () {
                props.onChange('');
              }
            },
            '×'
          )
      );
    }
  });

  CMS.registerWidget({
    name: 'icon',
    controlComponent: IconControl,
    previewComponent: string.preview
  });
})();
