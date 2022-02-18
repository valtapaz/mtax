const mdp = (value) => {
	//Set initial text to new variable
	let newVal = value;
	//Set max width for images, audio, and video
	let mediaWidth = '60vw';
	
	//Style cheat sheet: 
	// $ is for basic text styling--bold, italic, underline, strikethrough--and is also used for links and text alignment
	// # is used for advanced text styling--color, highlighting, most things that need <span> elements or even functions--but must not use A-F to avoid conflict with hex codes
	// ! is used for media--images, audio, and video--and may possibly gain support for other visual or structural content in the future, such as tables

	// Set $b BOLD TEXT b$
	if (/\$b(.*\n*)*b\$/.test(value)) {
		console.log(`Applying bold`);
		newVal = newVal.replace(/\$b/g, '<strong>');
		newVal = newVal.replace(/b\$/g, '</strong>');
	}
	// Set $i ITALIC TEXT i$
	if (/\$i(.*\n*)*i\$/.test(value)) {
		console.log(`Applying italic`);
		newVal = newVal.replace(/\$i/g, '<em>');
		newVal = newVal.replace(/i\$/g, '</em>');
	}
	// Set $u UNDERLINED TEXT u$
	if (/\$u(.*\n*)*u\$/.test(value)) {
		console.log(`Applying underline`);
		newVal = newVal.replace(/\$u/g, '<u>');
		newVal = newVal.replace(/u\$/g, '</u>');
	}
	// Set $s STRIKETHROUGH TEXT s$
	if (/\$s(.*\n*)*s\$/.test(value)) {
		console.log(`Applying strikethrough`);
		newVal = newVal.replace(/\$s/g, '<s>');
		newVal = newVal.replace(/s\$/g, '</s>');
	}
	// Set $p CODE TEXT p$ (currently broken, as this function relies on translating HTML to rich text)
	if (/\$p(.*\n*)*p\$/.test(value)) {
		console.log(`Applying underline`);
		newVal = newVal.replace(/\$p/g, '<pre>');
		newVal = newVal.replace(/p\$/g, '</pre>');
	}
	// Set $r RIGHT-ALIGNED TEXT r$ (creates a new line)
	if (/\$r(.*\n*)*r\$/.test(value)) {
		console.log(`Applying right alignment`);
		newVal = newVal.replace(/\$r/g, '<span style="display:block;text-align:right;">');
		newVal = newVal.replace(/r\$/g, '</span>');
	}
	// Set $c CENTER-ALIGNED TEXT c$ (creates a new line)
	if (/\$c(.*\n*)*c\$/.test(value)) {
		console.log(`Applying center alignment`);
		newVal = newVal.replace(/\$c/g, '<span style="display:block;text-align:center;">');
		newVal = newVal.replace(/c\$/g, '</span>');
	}
	// Set $l LINK l$https://www.example.com
	if (/\$l(.*\n*)*l\$http\S+/.test(value)) {
		console.log(`Applying linking`);
		let newAnchor = value.match(new RegExp(/\$l(.*\n*)*l\$http\S+/g));
		//For each link, isolate the link, then assign it to a <a> element around the text
		for (const i in newAnchor) {
			let newLink = newAnchor[i].match(new RegExp(/http\S+/));
			newAnchor[i] = newAnchor[i].replace(/\$l/, '<a href="'+newLink+'">');
			newAnchor[i] = newAnchor[i].replace(/l\$http\S+/, '</a>');
			newVal = newVal.replace(/\$l(.*\n*)*l\$http\S+/,newAnchor[i]);
		}
	}
	
	// Set #t:red& TINTED TEXT t# (not #c for Color, as that would also pick up some hex color codes)
	if (/#t:\S{0,32}&(.*\n*)*t#/.test(value)) {
		console.log(`Applying text coloring`);
		let newColor = value.match(new RegExp(/#t:\S{0,32}&(.*\n*)*t#/g));
		newColor.forEach((instance) => {
			let color = instance.match(/#t:\S{0,32}&/);
			color = color[0];
			color = color.replace(/^\S{3}/,'');
			color = color.replace(/&$/,'');
			newVal = newVal.replace(/#t:\S{0,32}&/,`<span style='color:${color}'>`);
			newVal = newVal.replace(/t\#/,`</span>`);
		});
	}
	// Set #h:yellow& HIGHLIGHTED TEXT h#
	if (/#h:\S{0,32}&(.*\n*)*h#/.test(value)) {
		console.log(`Applying text coloring`);
		let newColor = value.match(new RegExp(/#h:\S{0,32}&(.*\n*)*h#/g));
		newColor.forEach((instance) => {
			let color = instance.match(/#h:\S{0,32}&/);
			color = color[0];
			color = color.replace(/^\S{3}/,'');
			color = color.replace(/&$/,'');
			newVal = newVal.replace(/#h:\S{0,32}&/,`<span style='background:${color}'>`);
			newVal = newVal.replace(/h\#/,`</span>`);
		});
	}
	// Set #s SPOILER TEXT s#
	if (/#s(.*\n*)*s#/.test(value)) {
		console.log(`Applying text coloring`);
		let newColor = value.match(new RegExp(/#s(.*\n*)*s#/g));
		console.log(newColor);
		newColor.forEach((instance) => {
			newVal = newVal.replace(/#s/,`<span style='transition:color 0.5s; color:rgba(0, 0, 0, 0); text-shadow:0 0 5px rgba(0, 0, 0, .5);' onclick='unhide(this)'>`);
			newVal = newVal.replace(/s\#/,`</span>`);
		});
	}
	if (/#l(.*\n*)*l#/.test(value)) {
		console.log(`Applying long text recognition`);
		newVal = newVal.replace(/#l/g, '<div style="background:#DDD;min-height:1em;border-radius:1em;padding:1em;" onclick="expand(this)">\
		<span class="click" style="display:inline;color:#444;">(Click to reveal)</span><span style="display:none;">');
		newVal = newVal.replace(/l#/g, '</span></div>');
	}

	// Set !Image with alt&https://upload.wikimedia.org/wikipedia/commons/4/41/Secretary_Blinken_Meets_With_Pope_Francis_%2851296283616%29.jpg
	if (/\!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/.test(value)) {
		console.log(`Finding image + applying alt`);
		let newImg = value.match(new RegExp(/\!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/g));
		//For each image with alt text, isolate the image link and alt text, then assign both to an <img> element
		for (const i in newImg) {
			let newLink = newImg[i].match(new RegExp(/http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/));
			newLink = newLink[0];
			let newAlt = newImg[i].replace(/&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/,'');
			newAlt=newAlt.replace(/^!/,'');
			newImg[i] = newImg[i].replace(/\!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/, `<img src="${newLink}" alt="${newAlt}" style="max-width:${mediaWidth}"/>`);
			newVal = newVal.replace(/\!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/,newImg[i]);
		}
	}
	// Set !https://upload.wikimedia.org/wikipedia/commons/4/41/Secretary_Blinken_Meets_With_Pope_Francis_%2851296283616%29.jpg (image without alt; not recommended)
	if (/\!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/.test(value)) {
		console.log(`Finding image`);
		let newImg = value.match(new RegExp(/\!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/g));
		//For each image without alt text, build an <img> element around the image link
		newImg.forEach((link)=>{
			link = link.replace(/!/,`<img src="`);
			link = link.replace(/$/,`" alt="" style="max-width:${mediaWidth}"/>`);
			newVal = newVal.replace(/\!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/, link);
		});
	}
	// Set !https://upload.wikimedia.org/wikipedia/commons/8/87/Beethoven%2C_Sonata_No._8_in_C_Minor_Pathetique%2C_Op._13_-_III._Rondo_-_Allegro.ogg (audio)
	if (/\!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/.test(value)) {
		console.log(`Finding audio`);
		let newImg = value.match(new RegExp(/\!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/g));
		//For each audio, build an <audio><source> element around the file link
		newImg.forEach((link)=>{
			link = link.replace(/!/,`<audio controls style="max-width:${mediaWidth}"><source src="`);
			link = link.replace(/$/,`"></audio>`);
			newVal = newVal.replace(/\!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/, link);
		});
	}
	// Set !http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov (video)
	if (/\!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/.test(value)) {
		console.log(`Finding audio`);
		let newImg = value.match(new RegExp(/\!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/g));
		//For each audio, build a <video><source> element around the file link
		newImg.forEach((link)=>{
			link = link.replace(/!/,`<video controls style="max-width:60vw"><source src="`);
			link = link.replace(/$/,`"></video>`);
			newVal = newVal.replace(/\!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/, link);
		});
	}
	console.log(newVal);
	document.getElementById('result').innerHTML = newVal;
} 

const unhide = (item) => {
	if (item.style.color === 'rgba(0, 0, 0, 0)') {
		item.style.color = 'rgba(0, 0, 0, 1)';
		item.style.textShadow = '0 0 5px rgba(0,0,0,0.0)';
		return;
	}
	item.style.textShadow = '0 0 5px rgba(0,0,0,0.5)';
}
const expand = (item) => {
	if (item.childNodes[2].style.display === 'none') {
		item.childNodes[1].style.display = 'none';
		item.childNodes[2].style.display = 'block';
		return;
	}
	item.childNodes[2].style.display = 'none';
	item.childNodes[1].style.display = 'inline';
}







/*
const mdp = (value) => {
	let newVal = value;
	if (/[^<]b\/.+\/b/.test(value) || /^b\/.+\/b/.test(value)) {
		console.log(`Applying style bold`);
		newVal = newVal.replace(/[^<]b\//, '<strong>');
		newVal = newVal.replace(/^b\//, '<strong>');
		newVal = newVal.replace(/\/b/, '</strong>');
	}
	if (/i\/.+\/i/.test(value)) {
		console.log(`Applying style emphasized`);
		newVal = newVal.replace(/[^<]i\//, '<em>');
		newVal = newVal.replace(/^i\//, '<em>');
		newVal = newVal.replace(/\/i/, '</em>');
	}

	newVal = newVal.replace(/u\//, '<u>');
	newVal = newVal.replace(/\/u/, '</u>');
	if (/[^<]s\/.+\/s/.test(value)) {
		newVal = newVal.replace(/[^<]s\//, '<s>');
		newVal = newVal.replace(/^s\//, '<s>');
		newVal = newVal.replace(/\/s/, '</s>');
	}
	console.log(newVal);
	console.log(/\/B/.test(value));
	document.getElementById('result').innerHTML = newVal;
} 
*/