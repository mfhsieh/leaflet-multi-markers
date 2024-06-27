/*
 * Leaflet.MultiMarkers v1.0.0 - 2024-6-18
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

    if (typeof define === 'function' && define.amd) {  // eslint-disable-line no-undef
        // define an AMD module that relies on 'leaflet'
        define(['leaflet'], factory);  // eslint-disable-line no-undef

    } else if (typeof exports === 'object') {
        // define a Common JS module that relies on 'leaflet'
        module.exports = factory(require('leaflet'));  // eslint-disable-line no-undef

    } else if (typeof window !== 'undefined') {
        // attach your plugin to the global 'L' variable
        if (typeof window.L === "undefined") throw "Leaflet must be loaded first.";
        window.L.MultiMarkers = factory(window.L);
    }
})(function (L) {
    "use strict";

    const MultiMarkers = L.LayerGroup.extend({
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

        initialize(data, options) {
            L.Util.setOptions(this, options);

            this._layers = {};
            if (data) data.forEach((elem) => this.addMarker(elem));
        },

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

        _defaultPopupContentWrapper: function (id) {
            return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.defaultPopupContent}</div>`;
        },

        _getPopupContentWrapper: function (id) {
            return (marker) => `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.getPopupContent(marker)}</div>`;
        },

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

        _getRandomDivId: function () {
            return `leaflet-multi-markers-${Date.now()}-${Math.round(Math.random() * 1000)}`;
        },
    });

    L.multiMarkers = function (data, options) {
        return new MultiMarkers(data, options);
    };

    return MultiMarkers;
});
