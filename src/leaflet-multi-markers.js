/*
 * Leaflet.MultiMarkers v1.0.2 - 2026-02-28
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
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD module
        define(["leaflet"], factory);

    } else if (typeof exports === "object") {
        // CommonJS module
        module.exports = factory(require("leaflet"));

    } else if (typeof window !== "undefined") {
        // Browser globals
        if (typeof window.L === "undefined") throw "Leaflet must be loaded first.";
        window.L.MultiMarkers = factory(window.L);
    }
})(function (L) {
    "use strict";

    /**
     * @typedef {Object} MultiMarkersOptions
     * @description Configuration options for the MultiMarkers plugin.
     *
     * @property {Array<string>} [iconExFields] - List of fields from data objects to be used as IconEx options.
     * @property {Object} [iconExPredefined] - Predefined IconEx options indexed by 'iconExName'. The 'default' key provides default values for all markers.
     * @property {Function} [setIconExOptions] - Optional callback function(elem) returning additional IconEx options for a specific data element.
     *
     * @property {Object} [markerOptions] - Base options for L.Marker. See Leaflet reference.
     * @property {Function} [setMarkerOptions] - Optional callback function(elem) returning additional Marker options for a specific data element.
     *
     * @property {boolean} [bindPopup=true] - Whether to automatically bind a popup to the marker.
     * @property {string} [defaultPopupContent=""] - Default HTML string used as popup content.
     * @property {Function} [getPopupContent] - Optional callback function(marker) returning an HTML string for the popup content. The marker instance has an 'elem' property containing the original data element.
     * @property {Function} [fetchPopupContent] - Optional async function(marker) returning a Promise that resolves to the popup content. The marker instance has an 'elem' property containing the original data element.
     *
     * @property {Function} [onClick] - Click event handler for the marker. The event target is the marker instance which has an 'elem' property.
     */

    /**
     * @class MultiMarkers
     * @extends L.LayerGroup
     * @classdesc A Leaflet layer group that creates multiple markers from an array of data.
     */
    const MultiMarkers = L.LayerGroup.extend({
        /**
         * @property {MultiMarkersOptions} options - MultiMarkers options.
         */
        options: {
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
        },

        /**
         * @constructor
         * @description Initializes the MultiMarkers layer group.
         * @param {Array<Object>} [data] - Array of data objects for markers.
         * @param {MultiMarkersOptions} [options] - Configuration options.
         */
        initialize(data, options) {
            L.Util.setOptions(this, options);

            this._layers = {};
            if (data) data.forEach((elem) => this.addMarker(elem));
        },

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
            /** @type {Object} elem - The original data element associated with this marker. */
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

            return L.LayerGroup.prototype.addLayer.call(this, marker);
        },

        /**
         * @private
         * @description Returns the default popup content.
         * @param {string} id - ID for the popup content div.
         * @returns {string} The default popup content.
         */
        _defaultPopupContentWrapper: function (id) {
            return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.defaultPopupContent}</div>`;
        },

        /**
         * @private
         * @description Returns the popup content generated by the getPopupContent function.
         * @param {string} id - ID for the popup content div.
         * @returns {Function} Function that returns the popup content.
         */
        _getPopupContentWrapper: function (id) {
            return (marker) => `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.getPopupContent(marker)}</div>`;
        },

        /**
         * @private
         * @description Fetches and sets the popup content asynchronously.
         * @param {L.Marker} marker - The marker instance.
         * @param {HTMLElement} div - The div element for the popup content.
         */
        _fetchPopupContentWrapper: function (marker, div) {
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
        },

        /**
         * @private
         * @description Generates a random div ID.
         * @returns {string} A random div ID.
         */
        _getRandomDivId: function () {
            return `leaflet-multi-markers-${Date.now()}-${Math.round(Math.random() * 1000)}`;
        },
    });

    /**
     * @function multiMarkers
     * @memberof L
     * @description Creates a new MultiMarkers layer group.
     * @param {Array<Object>} [data] - Array of data objects for markers.
     * @param {MultiMarkersOptions} [options] - Configuration options.
     * @returns {MultiMarkers} A new MultiMarkers layer group.
     */
    L.multiMarkers = function (data, options) {
        return new MultiMarkers(data, options);
    };

    return MultiMarkers;
});
