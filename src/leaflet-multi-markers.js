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

    const MultiMarkers = LayerGroup.extend({
        options: {
            iconExDict: undefined,
        },

        initialize(data, options) {
            Util.setOptions(this, options);
        },

        addLayer
    });

    L.multiMarkers = function (options) {
        return new MultiMarkers(options);
    };

    return MultiMarkers;
});
