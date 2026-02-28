# Leaflet.MultiMarkers

A [Leaflet](https://leafletjs.com/) plugin for displaying a large number of highly customizable markers, such as those from a CSV file read using [Papa Parse](https://www.papaparse.com/). It efficiently handles both global and individual settings for icons, markers, and popups.

`L.MultiMarkers` inherits from [L.LayerGroup](https://leafletjs.com/reference.html#layergroup) and utilizes [Leaflet.IconEx](https://github.com/mfhsieh/leaflet-iconex) to display icons.

* Demo Page: [Leaflet 1 demo](https://mfhsieh.github.io/leaflet-multi-markers/index.html) or [Leaflet 2 demo](https://mfhsieh.github.io/leaflet-multi-markers/index_v2.html)
* Current Version: v1.0.2 / v2.0.0-alpha.1 (2026-02-28)
* Tested on: Desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

## Usage

### Leaflet 1.x (Classic)

Include the CSS and JavaScript files for `Leaflet.IconEx` and `Leaflet.MultiMarkers` in the `<head>`:

```html
<head>
    ...
    <script src="dist/leaflet-iconex.min.js"></script>
    <script src="dist/leaflet-multi-markers.min.js"></script>
    <link rel="stylesheet" href="dist/leaflet-iconex.css" />
    ...
</head>
```

Then add the markers to the map:

```js
new L.MultiMarkers(data, {
    iconExPredefined: {
        default: {  // default options for all icons
            // ...
        },
        A: {  // options for the predefined L.IconEx named A
            // ...
        },
    },
    setIconExOptions: (elem) => {  // set options for each icon
        return { /* ... */ };
    },
    markerOptions: {  // default options for all markers
        // ...
    },
    setMarkerOptions: (elem) => {  // set options for each marker
        return { /* ... */ };
    },
    defaultPopupContent: "some content",  // default content of the popup window
    fetchPopupContent: (marker) => {  // fetch the content of the popup window 
        return new Promise((resolve, reject) => { /* ... */ });
    },
    onClick: (event) => {  // do something after the marker is clicked
            // ...
    },
}).addTo(map);
```

### Leaflet 2.x (ESM)

For Leaflet 2.x, use the ESM-ready versions [leaflet-iconex_v2.min.js](dist/leaflet-iconex_v2.min.js) and [leaflet-multi-markers_v2.min.js](dist/leaflet-multi-markers_v2.min.js). Also, include the [CSS for Leaflet.IconEx](dist/leaflet-iconex.css) in your page.

```js
import L from 'leaflet';
import IconEx from './dist/leaflet-iconex_v2.min.js';
import MultiMarkers from './dist/leaflet-multi-markers_v2.min.js';

new MultiMarkers(data, {
    iconExPredefined: {
        default: {  // default options for all icons
            // ...
        },
        A: {  // options for the predefined L.IconEx named A
            // ...
        },
    },
    // ... other options
}).addTo(map);
```

For more details, refer to the [Leaflet 1 demo](index.html) or [Leaflet 2 demo](index_v2.html).

### Data Format

The `L.MultiMarkers` constructor requires two parameters: an array of data objects and an object of configuration options.

Example data object:

```js
{
    lat: 25.0487,  // latitude
    lng: 121.51434,  // longitude
    iconExName: "A", // name used to look up iconExPredefined
    contentHtml: '<i class="fas fa-house-user"></i>', // HTML for the icon content
    // ... other IconEx fields
}
```

## Options

| Option | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| iconExFields | String[] | (refer to code) | Fields from data object to be applied to `L.IconEx`. |
| iconExPredefined | Object | undefined | Predefined `L.IconEx` options indexed by `iconExName`. The `"default"` key represents default values for all markers. |
| setIconExOptions | Function | undefined | Optional callback function `(elem)` returning additional `L.IconEx` options. |
| markerOptions | Object | undefined | Base options for `L.Marker`. See [Leaflet reference](https://leafletjs.com/reference.html#marker). |
| setMarkerOptions | Function | undefined | Optional callback function `(elem)` returning additional `L.Marker` options. |
| bindPopup | Boolean | true | Whether to automatically bind a popup to the marker. |
| defaultPopupContent | String | "" | Default HTML string used as popup content. |
| getPopupContent | Function | undefined | Optional callback function `(marker)` returning an HTML string for the popup content. |
| fetchPopupContent | Function | undefined | Optional async function `(marker)` returning a `Promise` that resolves to the popup content. |
| onClick | Function | undefined | Click event handler for the marker. |

## Where

* Source Code: [GitHub](https://github.com/mfhsieh/leaflet-multi-markers)

## Author

* email: mfhsieh at gmail.com
* Github: [Github](https://github.com/mfhsieh/)
