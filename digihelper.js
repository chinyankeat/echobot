"use strict";

$( document ).ready(function() {
//    $("#wc-popup-feedback").fadeIn(150);
});


function submitFeedback() {
	alert("form submitted =" +("#popup-feedback-stars input.full").val() + " text="+ $("#popup-feedback-remark").val());
    $("#wc-popup-feedback").fadeOut(150);
}