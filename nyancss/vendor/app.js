var nyancss = {
	version: 'v0.5-alpha',
	lastCommit: 'Marc 6, 2017',
	cdnLink: 'https://cdnjs.com/nyancss/nyan.min.css',
	downloadLink: ''
}
var cdnE = document.getElementById('cdnLink');
cdnE.innerText = cdnE.innerText.replace('-link-', nyancss.cdnLink);

var downE = document.getElementById('downloadLink');
downE.href = nyancss.downloadLink;
downE.innerText = downE.innerText.replace('-VERSION-', nyancss.version);

var versE = document.querySelector('.version');
versE.innerText = nyancss.version;

var lastE = document.querySelector('.lastCommit');
lastE.innerText = nyancss.lastCommit;