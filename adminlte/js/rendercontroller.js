
var app = angular.module("displayapp", ['ui-leaflet']);
    app.controller("RenderController", [ "$scope", '$http', 'leafletData', 'leafletBoundsHelpers', function($scope, $http , leafletData,leafletBoundsHelpers) {
         angular.extend($scope, {
               bounds:{},
               center: {
                   
                },
                layers: {
                    baselayers: {
                       
                    },
                    overlays:{}
                }
            });



$http.get("tax.geo.json").success(function(data, status) {
      angular.extend($scope.layers.overlays, {
         Propertytax : {
            name:'Property Tax Information',
            type: 'geoJSONShape',
            data: data,
            visible: true,
            layerOptions: {
                style: {
                color: 'blue',
                fillColor: 'blue',
                weight: 2.0,
                opacity: 0.6,
                fillOpacity: 0.2
              },
              onEachFeature: onEachFeature
            }
          }
        });
       

      function onEachFeature(feature, layer) {          
            var pop = '';
            angular.forEach(feature.properties , function(value,key){  pop=pop+ "<b>" +key +  "</b>" + ":" +value + '<br>'; })   ;
            layer.bindPopup(pop);

            layer.on('mouseover', function(e){
                layer.setStyle({
                    weight: 5,
                    color: 'red',
                    fillColor: 'red'
                });
            });


            layer.on('mouseout', function(e){
                layer.setStyle({
                    weight: 2,
                    color: 'blue',
                    fillColor: 'blue'
             });
          });
        }
      });  //tax data end






      $http.get("literacy.geo.json").success(function(data, status) {
        angular.extend($scope.layers.overlays, {
          lLand: {
            name:'Land Record Information',
            type: 'geoJSONShape',
            data: data,
            visible: true,
            layerOptions: {
              style: {
                color: 'green',
                fillColor: 'green',
                weight: 2.0,
                opacity: 0.6,
                fillOpacity: 0.2
              },
              onEachFeature: onEachFeature
            }
          }
        });

        function onEachFeature(feature, layer) {
                
            var pop = '';
            angular.forEach(feature.properties , function(value,key){  pop=pop+"<b>"+ key +"</b>" +" : " +value + '<br>'; })   ;
            layer.bindPopup(pop);

            layer.on('mouseover', function(e){
                layer.setStyle({
                    weight: 5,
                    color: 'red',
                    fillColor: 'red'
                });

          });

  
             layer.on('mouseout', function(e){
                layer.setStyle({
                    weight: 2,
                    color: 'green',
                    fillColor: 'green'
                });
          });
        }
      }); //literacy data end


leafletData.getMap().then(function(map) {
   
    //ADD LAYERS
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: osmAttrib}); 
var roadMutant = L.gridLayer.googleMutant({
          maxZoom: 24,
          type:'roadmap'
      }).addTo(map);



//LAYER CONTROL     
var control =  L.control.layers({
          GoogleRoadmap: roadMutant, 
            OpenStreetMap : osm}, 
            {}, 
            {collapsed: false}
            );
control.addTo(map);


var htmlObject = control.getContainer();
htmlObject.classList.remove("leaflet-control-layers");
sp = htmlObject.getElementsByTagName('SPAN');
for(i=0 ; i<sp.length ; i=i+1){ sp[i].innerHTML = "<a>" + sp[i].innerHTML + "</a>"  ; }
document.getElementById('sideBar').appendChild(htmlObject); 


//SEARCH BAR



var geocoder = new google.maps.Geocoder();

    function googleGeocoding(text, callResponse)
    {
        geocoder.geocode({address: text}, callResponse);

    }

    function formatJSON(rawjson)
    {   
        var json = {},
            key, loc, disp = [];



     map.fitBounds(   [  [ rawjson[0].geometry.viewport.f.b, rawjson[0].geometry.viewport.b.f  ],
        [rawjson[0].geometry.viewport.f.f, rawjson[0].geometry.viewport.b.b ]         ] )
        
            key = rawjson[0].formatted_address;
            
            loc = L.latLng( rawjson[0].geometry.location.lat(), rawjson[0].geometry.location.lng() );
            
            json[ key ]= loc;   //key,value format


         
 


     
      

        return json;

    }

    var controlSearch =  new L.Control.Search({
            sourceData: googleGeocoding,
            formatData: formatJSON,
            markerLocation: false,
            autoType: false,
            autoCollapse: true,
            minLength: 2,
            position:'topright'
        }) ;

        map.addControl(controlSearch);




$('#textsearch').on('keyup', function(e) {

      controlSearch.searchText( e.target.value );

    })



$('#statefield').change(function() {   
           controlSearch.searchText(this.value);  
               


$.ajax({
        type: "GET",
        url: "http://api.geonames.org/children?geonameId=1264418&username=demo",
        dataType: "xml",
        success: function(response) {}


    });






               $.ajax({
        type: "GET",
        url: "http://api.geonames.org/children?geonameId=1264418&username=demo",
        dataType: "xml",
        success: function(response) {
            console.log(response);
            $(response).find("geoname").each(function () {



                var optionlabel = $(this).find("name").text();
                var geonameId = $(this).find("geonameId").text();
                $("#distfield").append('<option value="' + optionlabel + '" data-id='+geonameId+'>' + optionlabel + '</option>');

            });
        }
    });




  } );



$('#distfield').change(function() {    
          controlSearch.searchText(this.value);  
                // $(this).find(":selected").attr("data-id");

  $.ajax({
        type: "GET",
        url: "http://api.geonames.org/children?geonameId=" +   $(this).find(":selected").attr("data-id")  +   "&username=demo",
        dataType: "xml",
        success: function(response) {
            console.log(response);
            $(response).find("geoname").each(function () {



                var optionlabel = $(this).find("name").text();
                var geonameId = $(this).find("geonameId").text();
                $("#cityfield").append('<option value="' + optionlabel + '" data-id='+geonameId+'>' + optionlabel + '</option>');

            });
        }
    });

} );


$('#cityfield').change(function() {              controlSearch.searchText(this.value);    } );

}); //leafletData end

}]); //Controller end


