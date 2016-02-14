import os
from jsmin import jsmin

# set the working directory in the file location dir
os.chdir(os.path.dirname(os.path.realpath(__file__)))

fileList = [
	#'../cmsMaps/leaflet/leaflet.css',
	#'../cmsMaps/leaflet/leaflet.js',
	'../cmsMaps/leaflet/leaflet-plugins/layer/vector/KML.js',
	'../cmsMaps/leaflet/leaflet-plugins/layer/vector/GPX.js',
	'../cmsMaps/cmsMaps.js',
]

rawData = ''.join([open(i, 'rb').read() for i in fileList])
minified = jsmin(rawData)

with open('cmsMaps-min.js', 'w') as m:
    m.write(minified)
