Leaflet.MultiMarkers
=

A Leaflet plugin for displaying a large number of highly customizable markers, such as those from a CSV file read using [Papa Parse](https://www.papaparse.com/). It can easily handle both overall and individual settings for icons, markers, and popups. Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

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
        name_A: {  // options for the predefined L.IconEx named name_A
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

The constructor of L.MultiMarkers requires two parameters: the first is an array of point data, and the second is a dictionary of options (refer to the [options](#options) section below).

The array of point data is shown as follows:
```js
[{
    lat: ...  // latitude
    lng: ...  // longitude
    iconExName: ... // the name of the predefined L.IconEx
    contentHtml: ... // the HTML of the content layer
    contentColor: ... // the HTML of the content color
    ...
},{
    // ...
}]
```

Each element in the array represents a marker. "[lat, lng]" represents the coordinates of the marker. "iconExName" represents the name of the predefined L.IconEx. Other options like contentHtml, contentColor, etc., are used to configure L.IconEx (refer to [the complete list of available options](https://github.com/mfhsieh/leaflet-iconex#options)).


For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv)).


# Options

