$(document).ready(function(){

	// Append a right arrow to end of top question links
	$('#top-questions ol li a, #related-links ol li a').append('<span class="right-arrow">&nbsp; &rarr;</span>');
	
	// Redirect to new URL when dropdown option is selected
	$(function(){
    	$("#select-brand").change( function(e) {
        	// assign the selected value to a variable
			var selectVal = $('#select-brand :selected').val();
			// redirect to new URL
			window.location.href = selectVal;
		});
	});
	
});