import os, shutil
from distutils import dir_util, file_util
from jsmin import jsmin

# set the working directory in the file location dir
os.chdir(os.path.dirname(os.path.realpath(__file__)))

fileList = [
	#'../cmsMaps/leaflet/leaflet.css',
	'../cmsMaps/leaflet/leaflet.js',
	'../cmsMaps/leaflet/leaflet-plugins/layer/vector/KML.js',
	'../cmsMaps/leaflet/leaflet-plugins/layer/vector/GPX.js',
	'../cmsMaps/cmsMaps.js',
]

rawData = ''.join([open(i, 'rb').read() for i in fileList])
minified = jsmin(rawData)

with open('cmsMaps-min.js', 'w') as m:
    m.write(minified)

# copy leaflet images folder
#shutil.copytree('../cmsMaps/leaflet/images', '../build/images', False, True)

dir_util.copy_tree('../cmsMaps/leaflet/images', '../build/images')
file_util.copy_file('../cmsMaps/leaflet/leaflet.css', '../build/cmsMaps.css')
	