/*
 * Leaflet.MultiMarkers v0.0.1 - 2024-6-18
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
            defaultContent: "",
            getStaticContent: undefined,
            fetchDynamicContent: undefined,
        },

        initialize(data, options) {
            L.Util.setOptions(this, options);

            this._layers = {};
            if (data) data.forEach((elem) => this.addMarker(elem));
        },

        addMarker(elem) {
            let predefined = {};
            if (this.options.iconExPredefined) {
                if ("default" in this.options.iconExPredefined)
                    predefined = this.options.iconExPredefined["default"];
                if (elem.hasOwnProperty("iconExName") && elem.iconExName in this.options.iconExPredefined)
                    predefined = { ...predefined, ...this.options.iconExPredefined[elem.iconExName] };
            }

            const iconOptions = this.options.iconExFields.reduce((acc, key) => {
                if (elem.hasOwnProperty(key) && elem[key]) acc[key] = elem[key];
                return acc;
            }, { ...predefined });

            const marker = new L.Marker([elem.lat, elem.lng], { icon: new L.IconEx(iconOptions) });
            marker.elem = elem;

            if ((this.options.defaultContent || this.options.getStaticContent) && !this.options.fetchDynamicContent) {
                const id = undefined;
                const content = this.options.getStaticContent ? this._getStaticContentWrapper(id) : this._defaultContentWrapper(id);
                marker.bindPopup(content);
            } else if (this.options.fetchDynamicContent) {
                marker.bindPopup(() => {
                    const id = this._getRandomDivId();
                    const content = this.options.getStaticContent ? this._getStaticContentWrapper(id)(marker) : this._defaultContentWrapper(id);
                    const timer = setInterval(() => {
                        const div = document.getElementById(id);
                        if (div) {
                            clearInterval(timer);
                            this._fetchDynamicContentWrapper(marker, div);
                        }
                    }, 1);
                    return content;
                });
            }

            return L.LayerGroup.prototype.addLayer.call(this, marker);
        },

        _defaultContentWrapper: function (id) {
            return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${this.options.defaultContent}</div>`;
        },

        _getStaticContentWrapper: function (id) {
            return (marker) => {
                const content = this.options.getStaticContent(marker);
                return `<div class="leaflet-multi-markers-popup"${id ? ` id="${id}"` : ""}>${content}</div>`;
            };
        },

        _fetchDynamicContentWrapper: function (marker, div) {
            let content;
            this.options.fetchDynamicContent(marker)
                .then((html) => {
                    content = html;
                }).catch((err) => {
                    content = err;
                }).finally(() => {
                    div.outerHTML = `<div class="leaflet-multi-markers-popup">${content}</div>`;
                    marker.getPopup()._updateLayout();
                    marker.getPopup()._updatePosition();
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
