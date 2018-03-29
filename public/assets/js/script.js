var socket = io();
var uploader = new SocketIOFileClient(socket);




var body = jQuery("body");
var stage = jQuery("#stage");
var back = jQuery("a.class");



var bar = jQuery('.upload-bar');
var percent = jQuery('.upload-percent');

var percentComplete = 0;

function step(i) {

	if (i == 1) {
		back.fadeOut();
	}
	else {
		back.fadeIn();
	}

	// Move the #stage div. Changing the top property will trigger
	// a css transition on the element. i-1 because we want the
	// steps to start from 1:

	stage.css('top', (-(i - 1) * 100) + '%');
}

jQuery("#step1 .encrypt").click(function () {
	body.attr('class', 'encrypt');
	step(2);
});


jQuery("#step1 .decrypt").click(function () {
	body.attr('class', 'decrypt');
	step(2);
});

jQuery("#step1 .hash").click(function () {
	body.attr('class', 'hash');
	step(2);
});


jQuery('#step2 .btn-large').click(function () {
	// Trigger the file browser dialog
	$(this).parent().find('input').click();
});

var file = null;

function getRadioChoose (){
	var radios = document.getElementsByName('group1');

	for (var i = 0, length = radios.length; i < length; i++)
	{
	 if (radios[i].checked)
	 {
	  // do whatever you want with the checked radio
	  return radios[i].value ;

	  // only one radio can be logically checked, don't check the rest
	  break;
	 }
	}
	return "";
}

function uploadFile(stage_type) {
	var file2Upload = document.getElementById(stage_type.toString());
	uploader.upload(file2Upload, {
		data: { 
			password: jQuery('#en-password').val(),
			algorithm: getRadioChoose()
		 }
	});
	console.log(jQuery('#en-password').val());
}

jQuery('#step2').on('change', '#encrypt-input', function (e) {

	// Has a file been selected?

	if (e.target.files.length != 1) {
		alert('Please select a file to encrypt!');
		return false;
	}
	file = e.target.files[0];
	uploadFile('encrypt-input');

	// if(file.size > 1024*1024){
	// 	alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
	// 	return;
	// }

	//step(3);
});

jQuery('#step2').on('change', '#decrypt-input', function (e) {

	// Has a file been selected?

	if (e.target.files.length != 1) {
		alert('Please select a file to encrypt!');
		return false;
	}
	file = e.target.files[0];
	uploadFile('decrypt-input');

	// if(file.size > 1024*1024){
	// 	alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
	// 	return;
	// }

	//step(3);
});

jQuery('#step2').on('change', '#hash-input', function (e) {

	// Has a file been selected?

	if (e.target.files.length != 1) {
		alert('Please select a file to encrypt!');
		return false;
	}
	file = e.target.files[0];
	uploadFile('hash-input');

	// if(file.size > 1024*1024){
	// 	alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
	// 	return;
	// }

	
});

jQuery('a.btn-large.process').click(function () {

	var input = $(this).parent().find('input[type=password]'),
		a = $('#step4 a.download'),
		password = input.val();

	input.val('');

	if (password.length < 5) {
		alert('Please choose a longer password!');
		return;
	}

	// The HTML5 FileReader object will allow us to read the 
	// contents of the	selected file.

	var reader = new FileReader();

	if (body.hasClass('encrypt')) {

			a.attr('href', '/data/' + file.name + '.encrypted');
			a.attr('download', file.name );
			step(4);
		
	}
	else {

		// Decrypt it!

		reader.onload = function (e) {

			var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
				.toString(CryptoJS.enc.Latin1);

			if (!/^data:/.test(decrypted)) {
				alert("Invalid pass phrase or file! Please try again.");
				return false;
			}

			a.attr('href', decrypted);
			a.attr('download', file.name.replace('.encrypted', ''));

			step(4);
		};

		reader.readAsText(file);
	}
});




uploader.on('start', function (fileInfo) {
	jQuery('#upload-status').html('Uploading...');
});




uploader.on('stream', function (fileInfo) {

	var percentVal = Math.round(fileInfo.sent/fileInfo.size*100) ;	
	bar.width(percentVal*4);
	percent.html(percentVal + '%');
	


});
uploader.on('complete', function (fileInfo) {
	bar.width(400);
	percent.html('100%');
	jQuery('#upload-status').html("Upload complete!");
	step(3);
});
uploader.on('error', function (err) {
	console.log('Error!', err);
});
uploader.on('abort', function (fileInfo) {
	console.log('Aborted: ', fileInfo);
});

socket.on('connect', function () {
	console.log("connect");
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

