const mdp = (value) => {
	//Set initial text to new variable
	let newVal = value;
	//Set max width for images, audio, and video
	let mediaWidth = '60vw';
	
	//Style cheat sheet: 
	// $ is for basic text styling--bold, italic, underline, strikethrough--and is also used for links and text alignment
	// # is used for advanced text styling--color, highlighting, most things that need <span> elements or even functions--but must not use A-F to avoid conflict with hex codes
	// ! is used for media--images, audio, and video--and may possibly gain support for other visual or structural content in the future, such as tables

	// Set b$ BOLD TEXT $b
	if (/b\$(\n|.)+\$b/.test(value)) {
		console.log(`Applying bold`);
		newVal = newVal.replace(/b\$/g, '<strong>').replace(/\$b/g, '</strong>');
	}
	// Set i$ ITALIC TEXT $i
	if (/i\$(\n|.)+\$i/.test(value)) {
		console.log(`Applying italic`);
		newVal = newVal.replace(/i\$/g, '<em>').replace(/\$i/g, '</em>');
	}
	// Set u$ UNDERLINED TEXT $u
	if (/u\$(\n|.)+\$u/.test(value)) {
		console.log(`Applying underline`);
		newVal = newVal.replace(/u\$/g, '<u>').replace(/\$u/g, '</u>');
	}
	// Set s$ STRIKETHROUGH TEXT $s
	if (/s\$(\n|.)+\$s/.test(value)) {
		console.log(`Applying strikethrough`);
		newVal = newVal.replace(/s\$/g, '<s>').replace(/\$s/g, '</s>');
	}
	// Set p$ CODE TEXT $p (currently broken, as this function relies on translating HTML to rich text)
	if (/p\$(\n|.)+\$p/.test(value)) {
		console.log(`Applying underline`);
		newVal = newVal.replace(/p\$/g, '<pre>').replace(/\$p/g, '</pre>');
	}
	// Set r$ RIGHT-ALIGNED TEXT $r (creates a new line)
	if (/r\$(\n|.)+\$r/.test(value)) {
		console.log(`Applying right alignment`);
		newVal = newVal
			.replace(/r\$/g, '<span style="display:block;text-align:right;">')
			.replace(/\$r/g, '</span>');
	}
	// Set c$ CENTER-ALIGNED TEXT $c (creates a new line)
	if (/c\$(\n|.)+\$c/.test(value)) {
		console.log(`Applying center alignment`);
		newVal = newVal
			.replace(/c\$/g, '<span style="display:block;text-align:center;">')
			.replace(/\$c/g, '</span>');
	}
	// Set l$ LINK $https://www.example.com
	if (/l\$(\n|.)+\$\S+/.test(value)) {
		console.log(`Applying linking`);
		let regQuery = new RegExp(/l\$(\n|.)+\$\S+/);
		let newAnchor = value.match(new RegExp(/l\$(\n|.)+\$\S+/g));
		//For each link, isolate the link, then assign it to a <a> element around the text
		for (const i in newAnchor) {
			//If the link ends with punctuation, save the punctuation, remove it from the URL, and move it to after the closing </a> tag
			if (/\$\S+[^][\.,\!\?-]+$/.test(newAnchor[i])) {
				let punctuation = newAnchor[i].match(new RegExp(/[\.,\!\?-]+$/));
				let newLink = newAnchor[i].match(new RegExp(/(?<=l\$.+\$)\S+/));
				newLink[0] = newLink[0].replace(/[\.,\!\?-]+$/,'');
				newAnchor = newAnchor[i]
					.replace(/[\.,\!\?-]+$/,'')
					.replace(/l\$/,`<a href="${newLink[0]}">`)
					.replace(/(?<=.+)\$\S+/,`</a>${punctuation[0]}`);
			} else {
				let newLink = newAnchor[i].match(new RegExp(/(?<=l\$.+\$)\S+/));
				newAnchor = newAnchor[i]
					.replace(/l\$/,`<a href="${newLink[0]}">`)
					.replace(/(?<=.+)\$\S+/,'</a>');
			}
			newVal = newVal.replace(regQuery,newAnchor[i]);
		}
	}
	// Alternative: set l$https://www.example.com
	if (/l\$\S+/.test(value)) {
		console.log(`Applying basic linking`);
		let regQuery = new RegExp(/l\$\S+/);
		let newAnchor = value.match(new RegExp(/l\$\S+/g));
		//For each link, isolate the link, then assign it to a <a> element around the text
		for (const i in newAnchor) {
			//If the link ends with punctuation, save the punctuation, remove it from the URL, and move it to after the closing </a> tag
			if (/\$\S+[\.,\!\?-]+$/.test(newAnchor[i])) {
				let punctuation = newAnchor[i].match(new RegExp(/[\.,\!\?-]+$/));
				let newLink = newAnchor[i].match(new RegExp(/(?<=l\$)\S+/));
				newLink = newLink[0].replace(/[\.,\!\?-\]"\/]+$/,'');
				newAnchor = newAnchor[i]
					.replace(/[\.,\!\?-\]"\/]+$/,'')
					.replace(/l\$/,`<a href="${newLink}">`) + `</a>${punctuation[0]}`;
			} else {
				let newLink = newAnchor[i].match(new RegExp(/(?<=l\$)\S+/));
				newAnchor = newAnchor[i].replace(/l\$/,`<a href="${newLink}">`)+'</a>';
			}
			newVal = newVal.replace(regQuery,newAnchor);
		}
	}
	
	// Set t#red& TINTED TEXT #t (not #c for Color, as that would also pick up some hex color codes)
	if (/t#\S{0,32}&(\n|.)+#t/.test(value)) {
		console.log(`Applying text coloring`);
		let newColor = value.match(new RegExp(/t#\S{0,32}&(\n|.)+#t/g));
		newColor.forEach((instance) => {
			let color = instance.match(/t#\S{0,32}&/);
			color = color[0].replace(/^\S{2}/,'').replace(/&$/,'');
			newVal = newVal
				.replace(/t#\S{0,32}&/,`<span style='color:${color}'>`)
				.replace(/#t/,`</span>`);
		});
	}
	// Set h#yellow& HIGHLIGHTED TEXT #h
	if (/h#\S{0,32}&(\n|.)+#h/.test(value)) {
		console.log(`Applying text highlighting`);
		let newColor = value.match(new RegExp(/h#\S{0,32}&(\n|.)+#h/g));
		newColor.forEach((instance) => {
			let color = instance.match(/h#\S{0,32}&/);
			color = color[0].replace(/^\S{2}/,'').replace(/&$/,'');
			newVal = newVal
				.replace(/h#\S{0,32}&/,`<span style='background:${color}'>`)
				.replace(/#h/,`</span>`);
		});
	}
	// Set s# SPOILER TEXT #s
	if (/s#(\n|.)+#s/.test(value)) {
		console.log(`Applying spoiler text`);
		let newColor = value.match(new RegExp(/s#(\n|.)+#s/g));
		console.log(newColor);
		newColor.forEach((instance) => {
			newVal = newVal
				.replace(/s#/,`<span style='transition:color 0.5s; color:rgba(0, 0, 0, 0); text-shadow:0 0 5px rgba(0, 0, 0, .5);' onclick='unhide(this)'>`)
				.replace(/#s/,`</span>`);
		});
	}
	//Set l# LONG/EXPANDABLE TEXT #l
	if (/l#(\n|.)+#l/.test(value)) {
		console.log(`Condensing long text`);
		newVal = newVal
			.replace(/l#/g, '<div style="background:#DDD;min-height:1em;border-radius:1em;padding:1em;" onclick="expand(this)">\
					<span class="click" style="display:inline;color:#444;">(Click to reveal)</span><span style="display:none;">')
			.replace(/#l/g, '</span></div>');
	}

	// Set i!Image with alt&https://upload.wikimedia.org/wikipedia/commons/4/41/Secretary_Blinken_Meets_With_Pope_Francis_%2851296283616%29.jpg
	if (/!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/.test(value) || /i!.+&http\S+/.test(value)) {
		console.log(`Finding image + applying alt`);
		// First, match the two potential image methods (i!http... or http...jpg) and build newImg, which will combine them (or, if one is null, refer to the match that isn't)
		let newImgStandard = value.match(new RegExp(/i!.+&http\S+/g));
		let newImgAuto = value.match(new RegExp(/(?<!i)!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/g));
		let newImg;
		if (newImgAuto === null) {newImg = newImgStandard;}
		else if (newImgStandard === null) {newImg = newImgAuto;}
		else {newImg = [...newImgStandard, ...newImgAuto];}
		//For each image with alt text, isolate the image link and alt text, then assign both to an <img> element
		newImg.forEach((oldLink)=>{
			let newLink = oldLink.match(/(?<=!.+&)\S+/);
			newLink = newLink[0].replace(/^/,`<img src="`);
			let newAlt = oldLink.replace(/&http\S+/, '').replace(/^i{0,1}!/,'');
			newLink += `" alt="${newAlt}" style="max-width:${mediaWidth}"/>`;
			if (/^i!/.test(oldLink)) {
				newVal = newVal.replace(/i!.+(?<=&)http\S+/,newLink);
			} else {
				newVal = newVal.replace(/!.+&http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/,newLink);
			}
		});
	}
	// Set i!https://upload.wikimedia.org/wikipedia/commons/4/41/Secretary_Blinken_Meets_With_Pope_Francis_%2851296283616%29.jpg (image without alt; not recommended)
	if (/!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/.test(value) || /i!\http\S+/.test(value)) {
		console.log(`Finding image`);
		// First, match the two potential image methods (i!http... or http...jpg)
		let newImgStandard = value.match(new RegExp(/i!http\S+/g));
		let newImgAuto = value.match(new RegExp(/(?<!i)!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/g));
		let newImg;
		// Build newImg: if one set is null, refer to the other one; otherwise, combine both
		if (newImgAuto === null) {newImg = newImgStandard;}
		else if (newImgStandard === null) {newImg = newImgAuto;}
		else {newImg = [...newImgStandard, ...newImgAuto];}
		// For each image without alt text, build an <img> element around the image link
		newImg.forEach((oldLink)=>{
			let newLink = oldLink.replace(/^i{0,1}!/,`<img src="`) + `" alt="" style="max-width:${mediaWidth}"/>`;
			if (/^i!/.test(oldLink)) {
				newVal = newVal.replace(/i!\S+/, newLink);
			} else {
				newVal = newVal.replace(/!http\S+\.(jpg|png|webp|gif|apng|avif|svg|heic|bmp|ico|cur|tif|tiff)/, newLink);
			}
		});
	}
	// Set a!https://upload.wikimedia.org/wikipedia/commons/8/87/Beethoven%2C_Sonata_No._8_in_C_Minor_Pathetique%2C_Op._13_-_III._Rondo_-_Allegro.ogg (audio)
	if (/!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/.test(value) || /a!\http\S+/.test(value)) {
		console.log(`Finding audio`);
		let newAudioStandard = value.match(new regExp(/a!\http\S+/));
		let newAudioAuto = value.match(new RegExp(/(?<!a)!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/g));
		let newAudio;
		// Build newAudio: if one set is null, refer to the other one; otherwise, combine both
		if (newAudioAuto === null) {newAudio = newAudioStandard;}
		else if (newImgStandard === null) {newAudio = newAudioAuto;}
		else {newAudio = [...newAudioStandard, ...newAudioAuto];}
		//For each audio, build an <audio><source> element around the file link
		newAudio.forEach((oldLink)=>{
			let newLink = oldLink.replace(/a{0,1}!/,`<audio controls style="max-width:${mediaWidth}"><source src="`) + `"></audio>`;
			if (/^a!/.test(oldLink)) {
				newVal = newVal.replace(/a!\http\S+/, newLink);
			} else {
				newVal = newVal.replace(/!\http\S+\.(wav|wave|mp3|m4a|adts|flac|ogg|oga|ogx|spx|opus|aicc|flac)/, newLink);
			}
		});
	}
	// Set v!http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov (video)
	if (/!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/.test(value) || /v!\http\S+/.test(value)) {
		console.log(`Finding video`);
		//Below: grab both "v!" and "!.mp4"-style models, and employ (?<!v) on the latter to avoid duplicates
		let newVideoStandard = value.match(new RegExp(/v{0,1}!\http\S+/g));
		let newVideoAuto = value.match(new RegExp(/(?<!v)!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/g));
		let newVideo;
		// Build newVideo: if one set is null, refer to the other one; otherwise, combine both
		if (newVideoAuto === null) {newVideo = newVideoStandard;}
		else if (newVideoStandard === null) {newVideo = newVideoAuto;}
		else {newVideo = [...newVideoStandard, ...newVideoAuto];}
		//For each video, build a <video><source> element around the file link
		newVideo.forEach((oldLink)=>{
			let newLink = oldLink.replace(/v{0,1}!/,`<video controls style="max-width:${mediaWidth}"><source src="`) + `"></video>`;
			if (/^v!/.test(oldLink)) {
				newVal = newVal.replace(/v!\http\S+/, newLink);
			} else {
				newVal = newVal.replace(/!\http\S+\.(webm|ogv|mov|mp4|m4v|m4p|m4b)/, newLink);
			}
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
	item.style.color = 'rgba(0, 0, 0, 0)';
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