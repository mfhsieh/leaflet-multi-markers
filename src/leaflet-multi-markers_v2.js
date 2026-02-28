/*
 * Leaflet.MultiMarkers v2.0.0-alpha.1 - 2026-02-28
 *
 * Copyright 2026 mfhsieh
 * mfhsieh@gmail.com
 *
 * Licensed under the MIT license.
 *
 * Demos:
 * https://mfhsieh.github.io/leaflet-multi-markers/
 *
 * Source:
 * git@github.com:mfhsieh/leaflet-multi-markers.git
 *
 */
import L from 'leaflet';

/**
 * @class MultiMarkers
 * @extends L.LayerGroup
 * @classdesc A Leaflet layer group that creates multiple markers from an array of data.
 * @param {Array<Object>} data - Array of data objects for markers.
 * @param {Object} [options] - Configuration options.
 */
class MultiMarkers extends L.LayerGroup {
    /**
     * @property {Object} options - MultiMarkers options.
     * @property {Array<string>} [options.iconExFields] - Fields from data object to be applied to IconEx.
     * @property {Object} [options.iconExPredefined] - Predefined IconEx options indexed by 'iconExName'. The 'default' key represents default values for all markers.
     * @property {Function} [options.setIconExOptions] - Optional callback function(elem) returning additional IconEx options.
     * @property {Object} [options.markerOptions] - Base options for L.Marker. See Leaflet reference.
     * @property {Function} [options.setMarkerOptions] - Optional callback function(elem) returning additional Marker options.
     * @property {boolean} [options.bindPopup=true] - Whether to automatically bind a popup to the marker.
     * @property {string} [options.defaultPopupContent=""] - Default HTML string used as popup content.
     * @property {Function} [options.getPopupContent] - Optional callback function(marker) returning an HTML string for the popup content.
     * @property {Function} [options.fetchPopupContent] - Optional async function(marker) returning a Promise that resolves to the popup content.
     * @property {Function} [options.onClick] - Click event handler for the marker.
     */
    options = {
        iconExFields: ["iconScale",
            "iconHtml", "iconHtmlSize", "iconHtmlAnchor", "iconHtmlPopupAnchor", "iconFill", "iconOpacity", "iconStroke", "iconStrokeOpacity",
            "backgroundHtml", "backgroundHtmlSize", "backgroundHtmlAnchor", "backgroundFill", "backgroundOpacity",
            "contentHtml", "contentHtmlSize", "contentHtmlAnchor", "contentColor", "contentFontSize"],
        iconExPredefined: undefined,
        setIconExOptions: undefined,

        markerOptions: undefined,
        setMarkerOptions: undefined,

        bindPopup: true,
        defaultPopupContent: "",
        getPopupContent: undefined,
        fetchPopupContent: undefined,

        onClick: undefined,
    }

    /**
     * @constructor
     * @description Initializes the MultiMarkers layer group.
     * @param {Array<Object>} data - Array of data objects for markers.
     * @param {Object} [options] - Configuration options.
     */
    constructor(data, options) {
        super();
        L.Util.setOptions(this, options);

        this._layers = {};
        if (data) data.forEach((elem) => this.addMarker(elem));
    }

    /**
     * @description Adds a marker to the layer group from a data object.
     * @param {Object} elem - Data object for the marker.
     * @returns {L.LayerGroup} The layer group.
     */
    addMarker(elem) {
        let icOptions = {};
        if (this.options.iconExPredefined) {
            if ("default" in this.options.iconExPredefined)
                icOptions = { ...this.options.iconExPredefined["default"] };
            if (Object.prototype.hasOwnProperty.call(elem, "iconExName") && elem.iconExName in this.options.iconExPredefined)
                icOptions = { ...icOptions, ...this.options.iconExPredefined[elem.iconExName] };
        }

        icOptions = this.options.iconExFields.reduce((acc, key) => {
            if (key in elem && elem[key] !== undefined && elem[key] !== null) acc[key] = elem[key];
            return acc;
        }, { ...icOptions });

        if (this.options.setIconExOptions)
            icOptions = { ...icOptions, ...this.options.setIconExOptions(elem) };

        let mkOptions = {};
        if (this.options.markerOptions) mkOptions = { ...this.options.markerOptions };
        if (this.options.setMarkerOptions) mkOptions = { ...mkOptions, ...this.options.setMarkerOptions(elem) };

        mkOptions["icon"] = new L.IconEx(icOptions);

        const marker = new L.Marker([elem.lat, elem.lng], mkOptions);
        marker.elem = elem;

        if (this.options.bindPopup && (this.options.defaultPopupContent || this.options.getPopupContent) && !this.options.fetchPopupContent) {
            const content = this.options.getPopupContent ? this._getPopupContentWrapper()(marker) : this._defaultPopupContentWrapper();
            marker.bindPopup(content);
        } else if (this.options.bindPopup && this.options.fetchPopupContent) {
            marker.bindPopup(() => {
                const id = this._getRandomDivId();
                const content = this.options.getPopupContent ? this._getPopupContentWrapper(id)(marker) : this._defaultPopupContentWrapper(id);
                marker.once("popupopen", () => {
                    const div = document.getElementById(id);
                    if (div) this._fetchPopupContentWrapper(marker, div);
                });
                return content;
            });
        }

        if (this.options.onClick) marker.on("click", this.options.onClick);

        return this.addLayer(marker);
    }

    /**
     * @private
     * @description Returns the default popup content.
     * @param {string} id - ID for the popup content div.
     * @returns {string} The default popup content.
     */
    _defaultPopupContentWrapper(id) {
        return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.defaultPopupContent}</div>`;
    }

    /**
     * @private
     * @description Returns the popup content generated by the getPopupContent function.
     * @param {string} id - ID for the popup content div.
     * @returns {Function} Function that returns the popup content.
     */
    _getPopupContentWrapper(id) {
        return (marker) => `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.getPopupContent(marker)}</div>`;
    }

    /**
     * @private
     * @description Fetches and sets the popup content asynchronously.
     * @param {L.Marker} marker - The marker.
     * @param {HTMLElement} div - The div element for the popup content.
     */
    _fetchPopupContentWrapper(marker, div) {
        let content;
        this.options.fetchPopupContent(marker)
            .then((html) => {
                content = html;
            }).catch((err) => {
                content = err;
            }).finally(() => {
                div.outerHTML = `<div class="leaflet-multi-markers-popup">${content}</div>`;
                const popup = marker.getPopup();
                popup._updateLayout();
                popup._updatePosition();
                popup._adjustPan();
            });
    }

    /**
     * @private
     * @description Generates a random div ID.
     * @returns {string} A random div ID.
     */
    _getRandomDivId() {
        return `leaflet-multi-markers-${Date.now()}-${Math.round(Math.random() * 1000)}`;
    }
}

// Register with Leaflet
L.MultiMarkers = MultiMarkers;

/**
 * @function multiMarkers
 * @memberof L
 * @description Creates a new MultiMarkers layer group.
 * @param {Array<Object>} data - Array of data objects for markers.
 * @param {Object} [options] - Configuration options.
 * @returns {MultiMarkers} A new MultiMarkers layer group.
 */
L.multiMarkers = function (data, options) {
    return new MultiMarkers(data, options);
};

export default MultiMarkers;
