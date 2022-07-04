$( document ).ready(function() {

    var
        googleKey = 'GOOGLE_MAP_KEY',
        address = 'Turkey',
        mapCenterLat,
        mapCenterLng,
        mapZoom = 5,
        searchText = $('#searchText'),
        mapImage = $('#mapImage'),
        searchZoom = $('#searchZoom'),
        mapWidth = (parseFloat(searchText.css('width').replace('px',''))).toFixed(),
        mapHeight = (mapWidth * 2 / 4).toFixed();

    getMap();

    searchText.on('keydown', function(){
        address = $(this).val();
        getMap();
    });

    searchZoom.on('change', function(){
        mapZoom = $(this).val();
        getMap();
    });

    mapImage.on('mousemove', function(e){
        var t = $(this),
            parentOffset = t.parent().offset(),
            pixelX = (e.pageX - parentOffset.left).toFixed(),
            pixelXText = $('#mouse-pixel-x'),
            pixelY = (e.pageY - parentOffset.top).toFixed(),
            pixelYText = $('#mouse-pixel-y'),
            latText = $('#mouse-lat'),
            lngXText = $('#mouse-lng');

        pixelXText.html(pixelX);
        pixelYText.html(pixelY);
        var mouseLatLng = getLatLng(pixelX, pixelY);
        latText.html(mouseLatLng.lat);
        lngXText.html(mouseLatLng.lng);

    });

    mapImage.on('mouseleave', function(){
        var
            pixelXText = $('#mouse-pixel-x'),
            pixelYText = $('#mouse-pixel-y'),
            latText = $('#mouse-lat'),
            lngXText = $('#mouse-lng');

        pixelXText.html('..');
        pixelYText.html('..');
        latText.html('..');
        lngXText.html('..');
    });

    function getLatLng(mouseX, mouseY )
    {
        var
            x = mouseX-(mapWidth/2),
            y = mouseY-(mapHeight/2),
            s = Math.min(Math.max(Math.sin(mapCenterLat * (Math.PI / 180)), -.9999), .9999),
            tiles = 1 << mapZoom;

        var centerPoint = {
            'x': 128 + mapCenterLng * (256 / 360),
            'y': 128 + 0.5 * Math.log((1 + s) / (1 - s)) * -(256 / (2 * Math.PI))
        };

        var mousePoint= {
            'x': ((centerPoint.x * tiles) + x),
            'y': ((centerPoint.y * tiles) + y)
        };

        var mouseLatLng = {};
        mouseLatLng['lat'] =  ((2 * Math.atan(Math.exp(((mousePoint.y/tiles) - 128) / -(256/ (2 * Math.PI)))) - Math.PI / 2)/ (Math.PI / 180)).toFixed(6);
        mouseLatLng['lng'] =  (((mousePoint.x/tiles) - 128) / (256 / 360)).toFixed(6);

        return mouseLatLng;
    }

    function getMap(){
        if(address) {

            var staticMap = 'https://maps.googleapis.com/maps/api/staticmap?center='+address+'&zoom='+mapZoom+'&size='+mapWidth+'x'+mapHeight+'&maptype=roadmap&key='+googleKey;
            var addressGeocode = 'https://maps.googleapis.com/maps/api/geocode/json?&address='+address+'&key='+googleKey;

            $.getJSON(addressGeocode, function (data) {
                if (data.status == 'OK') {
                    mapCenterLat = data.results[0].geometry.location.lat;
                    mapCenterLng = data.results[0].geometry.location.lng;
                    mapImage.attr('src', staticMap);
                    mapImage.css('cursor', 'crosshair');
                }
            });
        }
    }

});