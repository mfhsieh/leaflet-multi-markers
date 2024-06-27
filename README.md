Leaflet.MultiMarkers
=

A [Leaflet](https://leafletjs.com/) plugin for displaying a large number of highly customizable markers, such as those from a CSV file read using [Papa Parse](https://www.papaparse.com/). It can easily handle both overall and individual settings for icons, markers, and popups.

L.MultiMarkers inherits from [L.LayerGroup](https://leafletjs.com/reference.html#layergroup). And this plugin utilizes [Leaflet.IconEx](https://github.com/mfhsieh/leaflet-iconex) to display icons.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv))
* Current Version: v1.0.0
* Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.


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

The constructor of L.MultiMarkers requires two parameters: the first is a list of point data, and the second is a dictionary of options (refer to the [options](#options) section below).

The example list of point data is as follows:
```js
[{
    lat: 25.0487,  // latitude
    lng: 121.51434,  // longitude
    iconExName: "A", // the name of the predefined L.IconEx
    contentHtml: '<i class="fas fa-house-user"></i>', // the HTML of the content layer
    contentColor: "#a11", // the HTML of the content color
    // ...
},{
    // ...
}]
```

Each element in the list represents a marker. "[lat, lng]" represents the coordinates of the marker. "iconExName" represents the name of the predefined L.IconEx. Other options like contentHtml, contentColor, etc., are used to configure L.IconEx (refer to [the complete list](https://github.com/mfhsieh/leaflet-iconex#options)).


For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-multi-markers/) (code: [index.html](index.html), data: [example.csv](examples/example.csv)).


# Options

| Option              | Type       | Default                                                                         | Description                                                                                                                                                                                                                                                 |
| ------------------- | ---------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iconExFields        | List       | refer to [the complete list](https://github.com/mfhsieh/leaflet-iconex#options) | the keys used to configure L.IconEx. By default, [all options of L.IconEx](https://github.com/mfhsieh/leaflet-iconex#options) are included, but you can also define a smaller set if needed.                                                                |
| iconExPredefined    | Dictionary | undefined                                                                       | the predefined L.IconEx. The item with the key "default" represents the default values for all L.IconEx                                                                                                                                                     |
| setIconExOptions    | Function   | undefined                                                                       | the callback function to define each L.IconEX. The function takes each individual element of the list of point data as its parameter.                                                                                                                       |
| markerOptions       | Dictionary | undefined                                                                       | options for markers which can be found at this [reference](https://leafletjs.com/reference.html#marker).                                                                                                                                                    |
| setMarkerOptions    | Function   | undefined                                                                       | the callback function to define each marker. The function takes each individual element of the list of point data as its parameter.                                                                                                                         |
| bindPopup           | Boolean    | true                                                                            | whether the marker displays a popup window when clicked                                                                                                                                                                                                     |
| defaultPopupContent | String     | ""                                                                              | the default content of the popup window                                                                                                                                                                                                                     |
| getPopupContent     | Function   | undefined                                                                       | the callback function to get the content of the popup window for each marker. The function takes each individual marker as its parameter.                                                                                                                   |
| fetchPopupContent   | Function   | undefined                                                                       | the callback function to fetch the content of the popup window for each marker. The function takes each individual marker as its parameter, and returns a promise. If you need to use an API or other asynchronous methods to obtain the content, you should use this. |
| onClick             | Function   | undefined                                                                       | the callback function when the marker is clicked                                                                                                                                                                                                            |


# Where

* Source Code: [Github](https://github.com/mfhsieh/leaflet-multi-markers)


# Author

* email: mfhsieh at gmail.com
* Github: [Github](https://github.com/mfhsieh/)