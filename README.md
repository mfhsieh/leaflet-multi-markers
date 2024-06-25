Leaflet.MultiMarkers
=

A Leaflet plugin displaying a large number of highly customizable markers. Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

If there is a large amount of location data (e.g., from a CSV file read using [Papa Parse](https://www.papaparse.com/)), this plugin can easily handle both overall and individual settings for markers, icons, and popups.

This plugin will use [Leaflet.IconEx](https://github.com/mfhsieh/leaflet-iconex) to display the markers' icon.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv))
* Current Version: v0.9.0


# Usage

Simply include the [JS1](dist/leaflet-iconex.min.js), [JS2](dist/leaflet-multi-markers.min.js) and [CSS](dist/leaflet-iconex.css).

```html
<head>
    ...
    <script src="dist/leaflet-iconex.min.js"></script>
    <script src="dist/leaflet-multi-markers.min.js"></script>
    <link rel="stylesheet" href="dist/leaflet-iconex.css" />
    ...
</head>
```

And add the markers to the map.

```js
new L.MultiMarkers(data, {
    iconExPredefined: {
        default: {
            // default options for all icons
        },
        name_A: {
            // default options for icons of a specific "iconExName"
        },
    },
    setIconExOptions: (elem) => {
        return something;  // set options for each icon
    },
    markerOptions: {
        // default options for all markers
    },
    setMarkerOptions: (elem) => {
        return something;  // set options for each marker
    },
    defaultPopupContent: "some content",  // default content of the popup window
    fetchPopupContent: (marker) => {
        return new Promise((resolve, reject) => { 
            // the fetched content (a promise) to be displayed in the popup window
        });
    },
    onClick: (event) => {
            // do something after the marker is clicked
    },
}).addTo(map);

```

For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv)).


# Options

