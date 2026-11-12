{{- /* select_toggle: a select field that shows or hides its sibling fields
  depending on its value, the Decap CMS counterpart of
  cms/sveltiacms/widgets/select_toggle.js. The data stays flat: the select
  stores its own value, the sibling fields keep their own keys and values.

  Field options, on top of the select ones:
  - toggle (map) option value → names of the sibling fields shown for it.
    A sibling listed under no value is never hidden. The empty key ('')
    applies while the field has no value.

  Decap writes no field path in the DOM, so the siblings are found from the
  select itself: its label and its control share the container of the field,
  whose parent holds the other fields of the same object, each one labelled
  `for="<name>-field-<n>"`. Found that way, the hidden fields follow the select
  when a list item moves, and each locale pane hides its own.

  Hiding is visual only: a hidden field keeps its value. */ -}}
(function () {
  var h = window.h;
  var select = CMS.getWidget('select');

  // Decap sets the `for` of a field label to `<field name>-field-<counter>`
  function nameOf(label) {
    return label ? label.htmlFor.replace(/-field-\d+$/, '') : '';
  }

  // The closest element holding both nodes
  function commonAncestor(a, b) {
    var el = a;
    while (el && !el.contains(b)) el = el.parentElement;
    return el;
  }

  // Read the toggle option, an Immutable Map in the field config
  function toggleOf(field) {
    var toggle = field.get('toggle');
    return (toggle && typeof toggle.toJS === 'function' ? toggle.toJS() : toggle) || {};
  }

  var SelectToggleControl = window.createClass({
    // Decap's wrapper re-renders the control when its value changes, which is
    // all the sync needs
    componentDidMount: function () {
      this.sync();
    },

    componentDidUpdate: function () {
      this.sync();
    },

    setWrapper: function (el) {
      this.wrapper = el;
    },

    sync: function () {
      var label = document.querySelector('label[for="' + CSS.escape(this.props.forID) + '"]');
      var container = label && this.wrapper && commonAncestor(label, this.wrapper);
      if (!container || !container.parentElement) return;

      var toggle = toggleOf(this.props.field);
      var value = this.props.value;
      if (value === undefined || value === null) value = this.props.field.get('default');
      if (value === undefined || value === null) value = '';

      var shown = toggle[value] || [];
      var listed = [];
      Object.keys(toggle).forEach(function (key) {
        listed = listed.concat(toggle[key] || []);
      });

      Array.prototype.forEach.call(container.parentElement.children, function (sibling) {
        var name = nameOf(sibling.querySelector('label[for]'));
        if (listed.indexOf(name) < 0) return;
        if (shown.indexOf(name) < 0) {
          sibling.style.setProperty('display', 'none', 'important');
        } else {
          sibling.style.removeProperty('display');
        }
      });
    },

    render: function () {
      return h('div', { ref: this.setWrapper }, h(select.control, this.props));
    }
  });

  CMS.registerWidget({
    name: 'select_toggle',
    controlComponent: SelectToggleControl,
    previewComponent: select.preview,
    globalStyles: select.globalStyles,
    schema: select.schema
  });
})();
