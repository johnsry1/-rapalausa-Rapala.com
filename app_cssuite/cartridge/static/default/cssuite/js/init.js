jQuery(document).ready(function() {
   	$('#accordion').accordion({
		header: ".ui-accordion-header",
		clearStyle: true
	});

  	//tabs


	//$('#LeftPane').resizable({
	//		handles: 'e',
	//		minWidth: 200,
	//		maxWidth: 800
	//	});

	// Manually set the outer splitter's height to fill the browser window.
	// This must be re-done any time the browser window is resized.
	/*$(window).bind("resize", function(){
		var $ms = $("#MySplitter");
		var top = $ms.offset().top;		// from dimensions.js
		var wh = $(window).height();

		// Account for margin or border on the splitter container
		$ms.css("height", (wh-top-15)+"px");

		//resize left pane
		var $lp = $("#LeftPane");
		$lp.css("height", (wh-top-15)+"px");

		//resize order table
		var $ort = $("#id_order_results_table");
		$ort.css("height", (wh-top-90)+"px");

		//resize BottomPane
		//var $bp = $("#BottomPane");
		//var bptop = $bp.offset().top;
		//$bp.css("height", (wh-bptop-1)+"px");
		//CSSuite.debug("LeftPane-top:" + top + ", BottomPane-top: " + bptop);

		// IE fires resize for splitter; others don't so do it here
		if ( !jQuery.browser.msie )
			$ms.trigger("resize");
	}).trigger("resize");
	
	*/
	
	// The "tab widgets" to handle.
	  var tabs = $('.tabs'),

	    // This selector will be reused when selecting actual tab widget A elements.
	    tab_a_selector = 'ul.ui-tabs-nav a';

	  // Enable tabs on all tab widgets. The `event` property must be overridden so
	  // that the tabs aren't changed on click, and any custom event name can be
	  // specified. Note that if you define a callback for the 'select' event, it
	  // will be executed for the selected tab whenever the hash changes.
	  tabs.tabs({ event: 'change' });

	  // Define our own click handler for the tabs, overriding the default.
	  tabs.find( tab_a_selector ).click(function(){
	    var state = {},

	      // Get the id of this tab widget.
	      id = $(this).closest( '.ui-tabs' ).attr( 'id' ),

	      // Get the index of this tab.
	      idx = $(this).parent().prevAll().length;

	    // Set the state!
	    state[ id ] = idx;
	    $.bbq.pushState( state );
	  });

	  // Bind an event to window.onhashchange that, when the history state changes,
	  // iterates over all tab widgets, changing the current tab as necessary.
	  $(window).bind( 'hashchange', function(e) {

	    // Iterate over all tab widgets.
	    tabs.each(function(){

	      // Get the index for this tab widget from the hash, based on the
	      // appropriate id property. In jQuery 1.4, you should use e.getState()
	      // instead of $.bbq.getState(). The second, 'true' argument coerces the
	      // string value to a number.
	      var idx = $.bbq.getState( this.id, true ) || 0;

	      // Select the appropriate tab for this tab widget by triggering the custom
	      // event specified in the .tabs() init above (you could keep track of what
	      // tab each widget is on using .data, and only select a tab if it has
	      // changed).
	      $(this).find( tab_a_selector ).eq( idx ).triggerHandler( 'change' );
	      if (idx){
	    	 //$("#order_list").hide()
		  	 $("#product_detail").hide();
	    	 //$("#order_list").hide();
	      }
	    });
	  })
	  // Since the event is only triggered when the hash changes, we need to trigger
	  // the event now, to handle the hash the page may have loaded with.
	  $(window).trigger('hashchange');
	  var anchor = location.hash;
	  if (anchor.length === 0) {
		  tabs.find( tab_a_selector ).eq(0).triggerHandler( 'change' );
		  window.location.hash=tabs.attr('id');
	  }
});