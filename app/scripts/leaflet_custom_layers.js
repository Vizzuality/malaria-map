L.Control.CustomLayers = L.Control.GroupedLayers.extend({
  _onInputClick: function () {
    var i, input, obj,
        inputs = this._form.getElementsByTagName('input'),
        inputsLen = inputs.length;

    this._handlingClick = true;


    // Layers that can't be deselected (basemaps)
    var notDeselectable = ['Road Map', 'Satellite'];
    if (this.currentInput &&
        this.currentInput.type === 'radio' &&
        notDeselectable.indexOf(this.currentInput.id) < 0) {
      if (this.currentInput == arguments[0].currentTarget) {
        this.currentInput.checked = false;
        this.currentInput = null;
      } else {
        this.currentInput = arguments[0].currentTarget;
      }
    } else {
        this.currentInput = arguments[0].currentTarget;
    }

    for (i = 0; i < inputsLen; i++) {
      input = inputs[i];
      obj = this._layers[input.layerId];

      if (input.checked && !this._map.hasLayer(obj.layer)) {
        this._map.addLayer(obj.layer);
        this._renderLegend(obj, input.parentNode);
      } else if (!input.checked && this._map.hasLayer(obj.layer)) {
        this._map.removeLayer(obj.layer);
        this._removeLegend(obj, input.parentNode);
      }
    }

    this._handlingClick = false;
  },

  _removeLegend: function(obj, container) {
    var legendConfig = LEGEND_CONFIG[obj.name];
    if (legendConfig === undefined) { return; }

    var id = obj.name.toLowerCase().replace(/\s+|\(|\)/g,"");
    var element = document.getElementById(id);

    if (element != undefined) {
      container.removeChild(element);
    }
  },

  _renderLegend: function(obj, container) {
    var legendConfig = LEGEND_CONFIG[obj.name];
    if (legendConfig === undefined || container == undefined) { return; }

    var legend = document.createElement('ul');
    legend.className = "malaria-legend";

    var id = obj.name.toLowerCase().replace(/\s+|\(|\)/g,"");
    legend.id = id;

    var i = 0;
    for (; i < legendConfig.length; i++) {
      var value = legendConfig[i];
      var element = document.createElement('li');

      var textElement = document.createElement('span');
      textElement.innerHTML = value;
      element.appendChild(textElement);
      element.className = id + " m" + (i+1);

      legend.appendChild(element);
    }

    container.appendChild(legend);
  },

	_addItem: function (obj) {
      var label = document.createElement('label'),
          input,
          checked = this._map.hasLayer(obj.layer),
          container;

      if (obj.overlay) {
        if (obj.group.exclusive) {
          groupRadioName = 'leaflet-exclusive-group-layer-' + obj.group.id;
          input = this._createRadioElement(groupRadioName, checked);
        } else {
          input = document.createElement('input');
          input.type = 'checkbox';
          input.className = 'leaflet-control-layers-selector';
          input.defaultChecked = checked;
        }
      } else {
        input = this._createRadioElement('leaflet-base-layers', checked);
      }

      input.layerId = L.Util.stamp(obj.layer);
      input.id = obj.name

      L.DomEvent.on(input, 'click', this._onInputClick, this);

      var name = document.createElement('span');
      name.innerHTML = ' ' + obj.name;

      label.appendChild(input);
      label.appendChild(name);

      if (input.checked === true) {
        this._renderLegend(obj, input.parentNode);
      }

      if (obj.overlay) {
        container = this._overlaysList;

        var groupContainer = this._domGroups[obj.group.id];

        // Create the group container if it doesn't exist
        if (!groupContainer) {
          groupContainer = document.createElement('div');
          groupContainer.className = 'leaflet-control-layers-group';
          groupContainer.id = 'leaflet-control-layers-group-' + obj.group.id;

          var groupLabel = document.createElement('span');
          groupLabel.className = 'leaflet-control-layers-group-name';
          groupLabel.innerHTML = obj.group.name;

          groupContainer.appendChild(groupLabel);
          container.appendChild(groupContainer);

          this._domGroups[obj.group.id] = groupContainer;
        }

        container = groupContainer;
      } else {
        container = this._baseLayersList;
      }

      container.appendChild(label);

      return label;
	},
});

L.control.customLayers = function (baseLayers, groupedOverlays, options) {
  return new L.Control.CustomLayers(baseLayers, groupedOverlays, options);
};
