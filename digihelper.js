"use strict";

// ============================================================
// Show feedback after 15 seconds idle
var feedbackIdleTime = 0;
var idleInterval = 0;
var feedbackTimerStarted = 0;	
var botInteraction = 0;	// current interactions

// Popup for feedback under the following conditions 
var feedbackPopupShown = 0;			// Has we popup dialog before? 0=no, 1=yes
var feedbackPopupInteraction = 20;	// popup after 15 interactions
var feedbackPopupTimer = 40;		// popup after 60 seconds idle
$( document ).ready(function() {
    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        feedbackIdleTime = 0;
    });
    $(this).keypress(function (e) {
        feedbackIdleTime = 0;
    });
});

// hide popup URL window if press esc
$('#wc-popup-url').keypress(function(e){
    if(e.which == 27){
		$("#wc-popup-feedback").fadeOut(150);
    }
});

// hide popup feedback window if press esc
$('#wc-popup-feedback').keypress(function(e){
    if(e.which == 27){
		$("#wc-popup-feedback").fadeOut(150);
    }
});

// Start Feedback Timer whenever there is user interaction with Bot
function startFeedbackTimer() {
	botInteraction++;
	
	if((botInteraction == feedbackPopupInteraction) && !feedbackPopupShown) {
		feedbackPopupShown++;
		$("#wc-popup-feedback").fadeIn(150);
		clearInterval(idleInterval);		
	}
	
	if(!feedbackTimerStarted) {	// only start feedback timer once, after user had the first interaction with bot
		feedbackTimerStarted++;
		//Increment the idle time counter every second.
		idleInterval = setInterval(timerIncrement, 1000); // 1 second		
	}
}

function timerIncrement() {
    feedbackIdleTime++;
    if (feedbackIdleTime >= feedbackPopupTimer) { // Popup after certain timer
		if(!feedbackPopupShown) {
			feedbackPopupShown++;
			$("#wc-popup-feedback").fadeIn(150);
			clearInterval(idleInterval);			
		}
    }
}

function submitFeedback() {
//	alert("form submitted =" +$("#popup-feedback-stars :radio:checked").val() + " text="+ $("#popup-feedback-remark").val());
	if ($("#popup-feedback-stars :radio:checked").val() == undefined ) {
		$('#popup-feedback-comment').text("Please help to rate us");
		return;
	}

	// Send Update Feedback to our database
	var form = new FormData();
	form.append("data", "{\"command\": \"update_chat_log\",\"auth_key\": \"a6hea2\",\"chat_id\": \"rating\",\n\"dialog_id\":\"rating\",\"dialog_state\":\"1\",\"dialog_type\":\"text\",\"dialog_input\":\""+$("#popup-feedback-stars :radio:checked").val()+" star"+"\",\"chat_log\": \""+$("#popup-feedback-remark").val()+"\"}");

	var settings = {
	  "async": true,
	  "url": "https://digibid.azurewebsites.net/action.ashx?action=json",
	  "method": "POST",
	  "headers": {
		"cache-control": "no-cache",
		"postman-token": "363b94ba-f457-55e5-89d1-a50ba8a4b1ae"
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});	

	$("#wc-popup-feedback").hide();
	$('#wc-popup-feedback-thankyou').show();
	setTimeout( hideFeedbackThankYou, 2000);	// hide thank you after 2 seconds
}

function hideFeedbackThankYou() {
	$('#wc-popup-feedback-thankyou').fadeOut(150)
}