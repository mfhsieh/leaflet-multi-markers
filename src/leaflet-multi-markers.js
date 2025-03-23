/*
 * Leaflet.MultiMarkers v1.0.1 - 2025-3-23
 *
 * Copyright 2024 mfhsieh
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
     * @class MultiMarkers
     * @extends L.LayerGroup
     * @classdesc A Leaflet layer group that creates multiple markers from an array of data.
     * @param {Array<Object>} data - Array of data objects for markers.
     * @param {Object} options - Options for the MultiMarkers layer group.
     */
    const MultiMarkers = L.LayerGroup.extend({
        /**
         * @property {Object} options - Default options for the MultiMarkers layer group.
         * @property {Array<string>} options.iconExFields - Array of fields to apply to IconEx options.
         * @property {Object} options.iconExPredefined - Predefined IconEx options.
         * @property {Function} options.setIconExOptions - Function to set IconEx options.
         * @property {Object} options.markerOptions - Marker options.
         * @property {Function} options.setMarkerOptions - Function to set marker options.
         * @property {boolean} options.bindPopup - Whether to bind a popup to markers.
         * @property {string} options.defaultPopupContent - Default popup content.
         * @property {Function} options.getPopupContent - Function to get popup content.
         * @property {Function} options.fetchPopupContent - Function to fetch popup content asynchronously.
         * @property {Function} options.onClick - Click event handler for markers.
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
         * @function initialize
         * @memberof MultiMarkers.prototype
         * @description Initializes the MultiMarkers layer group.
         * @param {Array<Object>} data - Array of data objects for markers.
         * @param {Object} options - Options for the MultiMarkers layer group.
         */
        initialize(data, options) {
            L.Util.setOptions(this, options);

            this._layers = {};
            if (data) data.forEach((elem) => this.addMarker(elem));
        },

        /**
         * @function addMarker
         * @memberof MultiMarkers.prototype
         * @description Adds a marker to the layer group from a data object.
         * @param {Object} elem - Data object for the marker.
         * @returns {L.LayerGroup} The layer group.
         */
        addMarker(elem) {
            let icOptions = {};
            if (this.options.iconExPredefined) {
                if ("default" in this.options.iconExPredefined)
                    icOptions = { ...this.options.iconExPredefined["default"] };
                if (elem.hasOwnProperty("iconExName") && elem.iconExName in this.options.iconExPredefined)
                    icOptions = { ...icOptions, ...this.options.iconExPredefined[elem.iconExName] };
            }

            icOptions = this.options.iconExFields.reduce((acc, key) => {
                if (elem.hasOwnProperty(key) && elem[key]) acc[key] = elem[key];
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
                const id = undefined;
                const content = this.options.getPopupContent ? this._getPopupContentWrapper(id) : this._defaultPopupContentWrapper(id);
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
         * @function _defaultPopupContentWrapper
         * @memberof MultiMarkers.prototype
         * @private
         * @description Returns the default popup content.
         * @param {string} id - ID for the popup content div.
         * @returns {string} The default popup content.
         */
        _defaultPopupContentWrapper: function (id) {
            return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.defaultPopupContent}</div>`;
        },

        /**
         * @function _getPopupContentWrapper
         * @memberof MultiMarkers.prototype
         * @private
         * @description Returns the popup content generated by the getPopupContent function.
         * @param {string} id - ID for the popup content div.
         * @returns {Function} Function that returns the popup content.
         */
        _getPopupContentWrapper: function (id) {
            return (marker) => `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.getPopupContent(marker)}</div>`;
        },

        /**
         * @function _fetchPopupContentWrapper
         * @memberof MultiMarkers.prototype
         * @private
         * @description Fetches and sets the popup content asynchronously.
         * @param {L.Marker} marker - The marker.
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
         * @function _getRandomDivId
         * @memberof MultiMarkers.prototype
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
     * @param {Array<Object>} data - Array of data objects for markers.
     * @param {Object} options - Options for the MultiMarkers layer group.
     * @returns {MultiMarkers} A new MultiMarkers layer group.
     */
    L.multiMarkers = function (data, options) {
        return new MultiMarkers(data, options);
    };

    return MultiMarkers;
});
