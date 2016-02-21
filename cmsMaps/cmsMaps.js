/*
 (c) 2016-2016, Petar Vojnović, PeroGIS
*/
var cmsMaps = {};

cmsMaps.options = {
	baseLayers: {
		mapBoxStreets: 'Mapbox streets',
		mapBoxLight: 'Mapbox light',
		openStreetMap: 'Open street map',
		openCycleMap: 'Open Cycle Map',
		MapQuestOpen_OSM: 'Map Quest',
		OpenStreetMap_BlackAndWhite: 'OpenStreetMap_BlackAndWhite',
		Hydda_Full: 'Hydda_Full',
		Thunderforest_Outdoors: 'Thunderforest_Outdoors',
		OpenMapSurfer_Roads: 'OpenMapSurfer_Roads',
		Thunderforest_OpenCycleMap: 'Thunderforest_OpenCycleMap',
		Esri_WorldTopoMap: 'Esri_WorldTopoMap',
		Esri_DeLorme: 'Esri_DeLorme',
		googleStreets: 'googleStreets',
		googleStreetsWithTerain: 'googleStreetsWithTerain',
		googleHybrid: 'googleHybrid ',
		googleSat: 'googleSat ',
		googleTerrain: 'googleTerrain'
	},
	overlays: {},
	center: [44.5, 16.7],	// map center if no layers are loaded
	zoom: 7,	// map zoom if no layers are loaded
};



cmsMaps.init = function(options) {
	L.Util.setOptions(this, options);
	
	var baseLayers = {};
	
	// add google layers with google api
	/*
	baseLayers = {
		ggl: new L.Google(),
		ggl2: new L.Google('TERRAIN'),
	};
	*/
	
	for (i in cmsMaps.options.baseLayers) {
		if (!cmsMaps.baseMaps.baseLayers[i].hidden) {
			var layerData = cmsMaps.baseMaps.baseLayers[i],
				layer = L.tileLayer(layerData.url, layerData.options);
			baseLayers[cmsMaps.options.baseLayers[i]] = layer;
		};
	};
	
	//var map = L.map('map', {
	var map = L.map('map', {
		center: cmsMaps.options.center,
		zoom: cmsMaps.options.zoom,
		layers: [baseLayers[Object.keys(baseLayers)[0]]]
	});
	
	map.attributionControl.setPrefix('PeroGIS'); // Don't show the 'Powered by Leaflet' text.
	
	cmsMaps.map = map;
	
	
	
	var boundsLayer = L.featureGroup();
	
	
	// add overlays
	var overlays = {},
		overlayKeys = Object.keys(cmsMaps.options.overlays)
		overlayKeysLength = overlayKeys.length,
		visibleOverlayKeysLength = overlayKeys.filter(function(overlay){
										return cmsMaps.options.overlays[overlay].visible
									}).length;
	
	overlayKeys.forEach(function(i, index){
	//for (i in cmsMaps.options.overlays) {
		var layerData = cmsMaps.options.overlays[i];
		
		// load data
		if (layerData.type == 'KML'){
			var kmlLayer = new L.KML(layerData.source, {async: true});
		} else if (layerData.type == 'GPX'){
			var kmlLayer = new L.GPX(layerData.source, {async: true});
		};
		
		// add the layer to the map
		if (layerData.visible){
			map.addLayer(kmlLayer);
		
			// handle zoom to data bounds
			kmlLayer.on("loaded", function(e) {
				boundsLayer.addLayer(e.target);
				if (Object.keys(boundsLayer._layers).length >= visibleOverlayKeysLength){
					map.fitBounds(boundsLayer.getBounds());
				};
			});
		};
		
		// add the layer to the layer switcher control
		overlays[layerData.name] = kmlLayer;
	//};
	});

	
	// add layer control
	L.control.layers(baseLayers, overlays).addTo(map);
};

// override for Leaflet icon pointer
L.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
	    leafletRe = /[\/^]cmsMaps[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, matches, path;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;
		matches = src.match(leafletRe);

		if (matches) {
			path = src.split(leafletRe)[0];
			return (path ? path + '/' : '') + 'images';
		}
	}
}());




// CMSMaps base layers configuration
cmsMaps.baseMaps = {};
cmsMaps.baseMaps.attributions = {
	openStreetMap: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
	openStreetMapFull: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	mapBox: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
							'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mapQuest: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />',
	google: 'Map data &copy; <a target="attr" href="http://googlemaps.com">Google</a>',
			// Google logo
			//'<div style="margin-left: 5px; margin-right: 5px; z-index: 1000000; position: absolute; left: 0px; bottom: 0px;"><a target="_blank" style="position: static; overflow: visible; float: none; display: inline;" href="https://maps.google.com/maps?ll=53.961792,58.42804&amp;z=13&amp;t=k&amp;hl=en-US&amp;gl=US&amp;mapclient=apiv3" title="Click to see this area on Google Maps"><div style="width: 66px; height: 26px; cursor: pointer;"><img src="http://maps.gstatic.com/mapfiles/api-3/images/google4.png" draggable="false" style="position: absolute; left: 0px; top: 0px; width: 66px; height: 26px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px;"></div></a></div>' +
			// Padding
			//'<div style="padding: 15px 21px; border: 1px solid rgb(171, 171, 171); font-family: Roboto, Arial, sans-serif; color: rgb(34, 34, 34); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; z-index: 10000002; display: none; width: 256px; height: 148px; position: absolute; left: 525px; top: 214px; background-color: white;"><div style="padding: 0px 0px 10px; font-size: 16px;">Map Data</div><div style="font-size: 13px;">Imagery ©2016 CNES / Astrium, DigitalGlobe, Landsat</div><div style="width: 13px; height: 13px; overflow: hidden; position: absolute; opacity: 0.7; right: 12px; top: 12px; z-index: 10000; cursor: pointer;"><img src="http://maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png" draggable="false" style="position: absolute; left: -2px; top: -336px; width: 59px; height: 492px; -webkit-user-select: none; border: 0px; padding: 0px; margin: 0px;"></div></div>' +
			// Data info
			//'<div class="gmnoprint" style="z-index: 1000001; position: absolute; right: 167px; bottom: 0px; width: 252px;"><div draggable="false" class="gm-style-cc" style="-webkit-user-select: none;"><div style="opacity: 0.7; width: 100%; height: 100%; position: absolute;"><div style="width: 1px;"></div><div style="width: auto; height: 100%; margin-left: 1px; background-color: rgb(245, 245, 245);"></div></div><div style="position: relative; padding-right: 6px; padding-left: 6px; font-family: Roboto, Arial, sans-serif; font-size: 10px; color: rgb(68, 68, 68); white-space: nowrap; direction: ltr; text-align: right;"><a style="color: rgb(68, 68, 68); text-decoration: none; cursor: pointer; display: none;">Map Data</a><span>Imagery ©2016 CNES / Astrium, DigitalGlobe, Landsat</span></div></div></div>' +
			// Data info2
			//'<div class="gmnoscreen" style="position: absolute; right: 0px; bottom: 0px;"><div style="font-family: Roboto, Arial, sans-serif; font-size: 11px; color: rgb(68, 68, 68); direction: ltr; text-align: right; background-color: rgb(245, 245, 245);">Imagery ©2016 CNES / Astrium, DigitalGlobe, Landsat</div></div>' +
			// Terms of use
			//'<div class="gmnoprint gm-style-cc" draggable="false" style="z-index: 1000001; -webkit-user-select: none; position: absolute; right: 95px; bottom: 0px;"><div style="opacity: 0.7; width: 100%; height: 100%; position: absolute;"><div style="width: 1px;"></div><div style="width: auto; height: 100%; margin-left: 1px; background-color: rgb(245, 245, 245);"></div></div><div style="position: relative; padding-right: 6px; padding-left: 6px; font-family: Roboto, Arial, sans-serif; font-size: 10px; color: rgb(68, 68, 68); white-space: nowrap; direction: ltr; text-align: right;"><a href="https://www.google.com/intl/en-US_US/help/terms_maps.html" target="_blank" style="text-decoration: none; cursor: pointer; color: rgb(68, 68, 68);">Terms of Use</a></div></div>' +
			// Report a problem
			// needs a function to call gmaps with center coords and zoom level
			//'<div draggable="false" class="gm-style-cc" style="-webkit-user-select: none; position: absolute; right: 0px; bottom: 0px;"><div style="opacity: 0.7; width: 100%; height: 100%; position: absolute;"><div style="width: 1px;"></div><div style="width: auto; height: 100%; margin-left: 1px; background-color: rgb(245, 245, 245);"></div></div><div style="position: relative; padding-right: 6px; padding-left: 6px; font-family: Roboto, Arial, sans-serif; font-size: 10px; color: rgb(68, 68, 68); white-space: nowrap; direction: ltr; text-align: right;"><a target="_new" title="Report errors in the road map or imagery to Google" href="https://www.google.com/maps/@53.961792,58.4280396,13z/data=!3m1!1e3!10m1!1e1!12b1?source=apiv3&amp;rapsrc=apiv3" style="font-family: Roboto, Arial, sans-serif; font-size: 10px; color: rgb(68, 68, 68); text-decoration: none; position: relative;">Report a map error</a></div></div>',
};

cmsMaps.baseMaps.baseLayers = {
	mapBoxStreets: {
		name: 'Mapbox streets',
		url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw',
		options: {
			id: 'mapbox.streets',
			attribution: cmsMaps.baseMaps.attributions.mapBox,
		}
	},
	mapBoxLight: {
		name: 'Mapbox light',
		url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw',
		options: {
			id: 'mapbox.light',
			attribution: cmsMaps.baseMaps.attributions.mapBox,
		}
	},
	openStreetMap: {
		name: 'Open street map',
		url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		options: {
			attribution: cmsMaps.baseMaps.attributions.openStreetMapFull
		}
	},
	openCycleMap: {
		name: 'Open Cycle Map',
		url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
		options: {
			attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, Map data ' + cmsMaps.baseMaps.attributions.openStreetMap
		}
	},
	cloudMade: {
		name: 'CloudMade',
		url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
		hidden: true,
		options: {
			attribution: 'Map data ' + cmsMaps.baseMaps.attributions.openStreetMap + ', Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
			styleId: 997,
			key: null
		}
	},
	MapQuestOpen_OSM: {
		name: 'Map Quest',
		url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
		options: {
			subdomains: '1234',
			type: 'osm',
			attribution: 'Map data ' + cmsMaps.baseMaps.attributions.openStreetMap + ', ' + cmsMaps.baseMaps.attributions.mapQuest
		}
	},
	OpenStreetMap_BlackAndWhite: {
		name: 'OpenStreetMap_BlackAndWhite',
		url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
		options: {
			attribution: cmsMaps.baseMaps.attributions.openStreetMap
		}
	},
	Hydda_Full: {
		name: 'Hydda_Full',
		url: 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
		options: {
			attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data ' + cmsMaps.baseMaps.attributions.openStreetMap
		}
	},
	Thunderforest_Outdoors: {
		name: 'Thunderforest_Outdoors',
		url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
		options: {
			attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, Map data ' + cmsMaps.baseMaps.attributions.openStreetMap
		}
	},
	OpenMapSurfer_Roads: {
		name: 'OpenMapSurfer_Roads',
		url: 'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}',
		options: {
			attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data ' + cmsMaps.baseMaps.attributions.openStreetMap,
			maxZoom: 20,
		}
	},
	Thunderforest_OpenCycleMap: {
		name: 'Thunderforest_OpenCycleMap',
		url: 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
		options: {
			attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, ' + cmsMaps.baseMaps.attributions.openStreetMap
		}
	},
	// ESRI
	Esri_WorldTopoMap: {
		name: 'Esri_WorldTopoMap',
		url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
		options: {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		}
	}, 
	Esri_DeLorme: {
		name: 'Esri_DeLorme',
		url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
		options: {
			attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
			minZoom: 1,
			maxZoom: 11
		}
	},
	// GOOGLE
	googleStreets: {
		name: 'googleStreets',
		url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
		options: {
			attribution: cmsMaps.baseMaps.attributions.google,
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3']
		}
	},
	googleStreetsWithTerain: {
		name: 'googleStreetsWithTerain',
		url: 'http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}',
		options: {
			attribution: cmsMaps.baseMaps.attributions.google,
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3']
		}
	}, 
	googleHybrid: {
		name: 'googleHybrid ',
		url: 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
		options: {
			attribution: cmsMaps.baseMaps.attributions.google,
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3']
		}
	}, 
	googleSat : {
		name: 'googleSat ',
		url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
		options: {
			attribution: cmsMaps.baseMaps.attributions.google,
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3']
		}
	}, 
	googleTerrain: {
		name: 'googleTerrain',
		url: 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
		options: {
			attribution: 	cmsMaps.baseMaps.attributions.google,
			maxZoom: 20,
			subdomains:['mt0','mt1','mt2','mt3']
		}
	},
	
};