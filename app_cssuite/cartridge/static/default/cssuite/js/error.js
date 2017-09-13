/**
 *	This is the function for generall error handling if doing a jquery.ajax() call.
 */
function handleError(XMLHttpRequest, textStatus, errorThrown) {
	
	if (XMLHttpRequest.status == "401") {
		window.location.href = CSSuite.sessionExpiredURL;
	} else {
		Dialog.message("An error occured", "<div>There was an error calling \"" + CSSuite.info + "\". Please contact your technical support.</div>", function(){window.location.href = CSSuite.homeUrl;});
	}
	
}
