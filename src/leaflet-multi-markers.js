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
        },

        initialize(data, options) {
            L.Util.setOptions(this, options);
            L.LayerGroup.prototype.initialize.call(this, data, options);
        },

        addLayer(elem) {
            const iconExOptions = this.options.iconExPredefined && elem.iconExName in this.options.iconExPredefined ? this.options.iconExPredefined[elem.iconExName] : {};
            const elemOptions = this.options.iconExFields.reduce((acc, key) => {
                if (elem.hasOwnProperty(key)) acc[key] = elem[key];
                return acc;
            }, {});
            const icon = new L.IconEx({ ...iconExOptions, ...elemOptions });
            const marker = new L.Marker([elem.lat, elem.lng], { icon: icon });
            L.LayerGroup.prototype.addLayer.call(this, marker);
        },
    });

    L.multiMarkers = function (data, options) {
        return new MultiMarkers(data, options);
    };

    return MultiMarkers;
});
