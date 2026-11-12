/**
 * select_toggle: a select field that shows or hides its sibling fields
 * depending on its value. The data stays flat: the select stores its own
 * value, the sibling fields keep their own keys and values.
 *
 * Field options, on top of the select ones:
 * - toggle (map) option value → names of the sibling fields shown for it.
 *   A sibling listed under no value is never hidden. The empty key ('')
 *   applies while the field has no value.
 *
 *   - name: source
 *     widget: select_toggle
 *     options: [selection, taxonomies]
 *     toggle:
 *       selection: [items]
 *       taxonomies: [tags, categories]
 *
 * Hiding is visual only: a hidden field keeps its value.
 */
(() => {
  const { React } = CMS;
  const h = React.createElement;
  const select = CMS.getFieldType('select');

  // Read an option from the field config (Immutable Map or plain object)
  const getOption = (field, key) =>
    typeof field?.get === 'function' ? field.get(key) : field?.[key];

  // Convert an Immutable value to plain JS
  const toJS = (value) => (typeof value?.toJS === 'function' ? value.toJS() : value);

  /**
   * Build the CSS hiding the siblings not shown for the current value.
   * Sveltia renders each field with a `data-key-path` attribute, e.g.
   * `blocks.0.items`, inside a pane carrying `data-locale` and `data-mode`.
   */
  const buildCSS = ({ group, toggle, value }) => {
    const keyPath = group.dataset.keyPath ?? '';
    const prefix = keyPath.slice(0, keyPath.lastIndexOf('.') + 1);
    const shown = new Set(toggle[value ?? ''] ?? []);
    const listed = new Set(Object.values(toggle).flatMap((names) => names ?? []));

    // Scope to the edit pane of the same locale, as each locale has its own value
    const pane = group.closest('[data-locale][data-mode]');
    const scope = pane
      ? `[data-mode="edit"][data-locale="${CSS.escape(pane.dataset.locale)}"] `
      : '';

    const selectors = [...listed]
      .filter((name) => !shown.has(name))
      .map((name) => `${scope}[data-key-path="${CSS.escape(prefix + name)}"]`);

    return selectors.length ? `${selectors.join(',\n')} { display: none !important; }` : '';
  };

  const Control = (props) => {
    // `ref` is meant for custom validation, which the built-in select doesn't use
    const { ref, ...selectProps } = props;
    const { field, value } = selectProps;
    const wrapper = React.useRef(null);
    const style = React.useRef(null);
    const toggle = toJS(getOption(field, 'toggle')) ?? {};
    const current = value ?? getOption(field, 'default');

    // Run after every render: the key path changes when a list item is moved
    React.useEffect(() => {
      const group = wrapper.current?.closest('[data-key-path]');

      if (!group) {
        return;
      }

      if (!style.current) {
        style.current = document.createElement('style');
        style.current.dataset.selectToggle = '';
        document.head.append(style.current);
      }

      const css = buildCSS({ group, toggle, value: current });

      if (style.current.textContent !== css) {
        style.current.textContent = css;
      }
    });

    // Remove the CSS along with the field
    React.useEffect(() => () => style.current?.remove(), []);

    return h('div', { ref: wrapper }, h(select.control, selectProps));
  };

  CMS.registerFieldType({
    name: 'select_toggle',
    controlComponent: Control,
    previewComponent: select.preview,
  });
})();
