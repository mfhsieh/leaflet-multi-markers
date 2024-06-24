Leaflet.MultiMarkers
=

A Leaflet plugin displaying a large number of highly customizable markers. Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv))
* Current Version: v0.9.0


# Usage

Simply include the [JS](dist/leaflet-multi-markers.min.js).

```html
<head>
    ...
    <script src="dist/leaflet-multi-markers.min.js"></script>
    ...
</head>
```

And add the control to the map.

```js
new L.MultiMarkers(data, {
    iconExPredefined: {
        default: {
            // ...
        },
    },
    setIconExOptions: (elem) => {
        return something;
    },
    markerOptions: {
        // ...
    },
    setMarkerOptions: (elem) => {
        return something;
    },
    defaultPopupContent: "some content",
    fetchPopupContent: (marker) => {
        return something;
    },
    onClick: (event) => {
            // ...
    },
}).addTo(map);

```

For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv)).
