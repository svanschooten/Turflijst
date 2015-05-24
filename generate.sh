#!/bin/bash

COUNTER=0

function compileLess {
	echo "compiling the .less stylesheets"
	mkdir -p ./static
	mkdir -p ./static/css
	lessc ./src/main.less > ./static/css/main.css;
	echo "done"
}

function makeClean {
	echo "compressing and cleaning the generated stylesheets"
	cleancss -o ./static/css/main.min.css ./static/css/main.css;
	echo "done"
}

function bundleJs {
	echo "precompiling and bundeling the JavaScript"
	mkdir -p ./static
	mkdir -p ./static/js
	browserify -t reactify ./src/main.js -o ./static/js/main.js;
	echo "done"
}

function compressJs {
	echo "compressing and uglifying the JavaScript bundle"
	uglifyjs ./static/js/main.js --compress --noerr --verbose --mangle -o ./static/js/main.min.js;
	echo "done"
}

function helpMessage {
	echo "Usage:"
	echo "	bash generate.sh (for complete generation)"
	echo "Arguments:"
	echo "	deploy	create a deployment package (webapp.zip)"
	echo "Options:"
	echo "	-s 		compile the .less stylesheets"
	echo "	-c 		compress and clean the generated stylesheets"
	echo "	-b 		precompile and bundle the JavaScript"
	echo "	-u 		compress and uglify the JavaScript bundle"
	echo "	-h 		display this help message"
}

while getopts scbuh FLAG; do
	COUNTER=$[$COUNTER +1]
	case $FLAG in
		s)
			compileLess
			;;
		c)
			makeClean
			;;
		b)
			bundleJs
			;;
		u)
			compressJs
			;;
		h)
			helpMessage
			;;
		\?)
			echo "Option -${BOLD}$OPTARG not allowed."
			helpMessage
			exit 1
			;;
	esac
done

shift $((OPTIND-1))

if [ $COUNTER -eq 0 ]; 
	then 
		compileLess
		makeClean
		bundleJs
		compressJs
fi

if [[ $1 == "deploy" ]]
	then
	echo "Creating deployment package (webapp.zip)"
	mv ./static/index.html ./static/index.html.tmp
	cp ./deploy/index.html ./static/index.html
	zip webapp ./static/index.html ./static/js/main.min.js ./config/config.json ./static/css/main.min.css app.js init.sh package.json generate.sh README.md attachments
	mv ./static/index.html.tmp ./static/index.html
	echo "done"
fi