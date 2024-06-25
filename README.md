Leaflet.MultiMarkers
=

A Leaflet plugin for displaying a large number of highly customizable markers, such as those from a CSV file read using [Papa Parse](https://www.papaparse.com/). It can easily handle both overall and individual settings for markers, icons, and popups. Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

This plugin will use [Leaflet.IconEx](https://github.com/mfhsieh/leaflet-iconex) to display marker icons.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv))
* Current Version: v0.9.0


# Usage

Simply include the [JS for Leaflet.IconEx](dist/leaflet-iconex.min.js), [JS for Leaflet.MultiMarkers](dist/leaflet-multi-markers.min.js) and [CSS for Leaflet.IconEx](dist/leaflet-iconex.css).

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
        default: {  // default options for all icons
            // ...
        },
        name_A: {  // default options for icons of a specific "iconExName"
            // ...
        },
    },
    setIconExOptions: (elem) => {  // set options for each icon
        return something;
    },
    markerOptions: {  // default options for all markers
        // ...
    },
    setMarkerOptions: (elem) => {  // set options for each marker
        return something;
    },
    defaultPopupContent: "some content",  // default content of the popup window
    fetchPopupContent: (marker) => {  // the fetched content (a promise) to be displayed in the popup window
        return new Promise((resolve, reject) => { /* ... */ });
    },
    onClick: (event) => {  // do something after the marker is clicked
            // ...
    },
}).addTo(map);

```

For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv)).


# Options

