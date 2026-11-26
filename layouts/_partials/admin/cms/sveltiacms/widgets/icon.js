/**
 * icon: a thumbnail of the chosen icon and a button that opens a searchable
 * grid of the installed icons (window.hugolifyIcons,
 * assets/admin/widgets/icon/picker.js). The thumbnail opens it too, and tells
 * the name on hover. An optional field also gets a button to remove the icon.
 *
 * Field options:
 * - brands (boolean) also offer the brand logos (brand:github)
 *
 * The value stays the icon name as a string. Without a catalog (it can't be
 * loaded), the field is the built-in string control alone, so the name can
 * still be typed.
 */
(() => {
  const { React } = CMS;
  const h = React.createElement;
  const string = CMS.getFieldType('string');
  const icons = window.hugolifyIcons;

  // Read an option from the field config (Immutable Map or plain object)
  const getOption = (field, key) =>
    typeof field?.get === 'function' ? field.get(key) : field?.[key];

  const Control = (props) => {
    // `ref` is meant for custom validation, which the built-in control doesn't need here
    const { ref, ...controlProps } = props;
    const { field, value, onChange, forID } = controlProps;
    // undefined while the catalog loads, then whether there is one
    const [ready, setReady] = React.useState(undefined);
    const [state, setState] = React.useState('empty');
    const glyph = React.useRef(null);

    React.useEffect(() => {
      let active = true;
      icons.load().then((catalog) => active && setReady(!!catalog));
      return () => {
        active = false;
      };
    }, []);

    React.useEffect(() => {
      if (!ready || !glyph.current) return undefined;
      let active = true;
      icons.thumbnail(glyph.current, value).then((result) => active && result !== 'stale' && setState(result));
      return () => {
        active = false;
      };
    }, [ready, value]);

    if (ready === false) {
      return h('div', { className: 'hugolify-icon-field__input' }, h(string.control, controlProps));
    }

    const name = String(value ?? '').trim();
    const choose = () => icons.open({ value: name, brands: !!getOption(field, 'brands'), onSelect: onChange });
    const optional = getOption(field, 'required') === false;

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
          title: state === 'unknown' ? `${icons.text.unknown} (${name})` : name || icons.text.choose,
          'aria-label': name ? `${icons.text.choose} (${name})` : icons.text.choose,
          disabled: !ready,
          onClick: choose,
        },
        h('span', { ref: glyph, className: 'hugolify-icon-field__glyph' }),
      ),
      h(
        'button',
        { key: 'choose', id: forID, type: 'button', className: 'hugolify-icon-field__choose', disabled: !ready, onClick: choose },
        icons.text.choose,
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
            onClick: () => onChange(''),
          },
          '×',
        ),
    );
  };

  CMS.registerFieldType({
    name: 'icon',
    controlComponent: Control,
    previewComponent: string.preview,
  });
})();
