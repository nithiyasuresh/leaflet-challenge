# leaflet-challenge
Dashboard of earthquakes using USGS earthquake data - leaflet/JS
1. First step was to store the API endpoint in a variable, and do a get request to query the URL to see if the query returns data.
2. Next step was to create variable for each tile layer - streetmap, darkmap, satellite.
3. Similarly also create baseMaps and overlay maps to hold the objects, while declaring variables for earthquake and tectonicPlates.
4. Next step was to create our map, giving it the lat long values to pick up the point, while displaying all the tile layers and also add layer control to the map.
5. Next step was to get earthquake data - creating function to get - radius, color, style, adding geojson layer to get the circleMarker, stlye for the circle marker, and using onEachFeature to use Choropleth.
6. Next creating geojson layer to get tectonic plate information.
7. Finally, creating the legend, and lopping through the density intervals and generate a label with colored square for each interval.
