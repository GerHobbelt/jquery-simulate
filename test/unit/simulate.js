(function () {

module( "mouse events" );

test( "click on checkbox triggers change", function () {
	var input = $( "#radiocheckbox-3" ),
		checked = input.prop( "checked" );

	input.simulate( "click" );

	notEqual( checked, input.prop( "checked" ), "checkbox state changed" );
});

test( "click on radio triggers change", function () {
	var firstRadio = $( "#radiocheckbox-1" ),
		secondRadio = $( "#radiocheckbox-2" ),
		checked = firstRadio.prop( "checked" );

	if ( checked ) {
		secondRadio.simulate( "click" );
	} else {
		firstRadio.simulate( "click" );
	}

	notEqual( checked, firstRadio.prop( "checked" ), "radio state changed" );
});

test( "accept dragstart event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "dragstart", function (e) {
		bindCalled = true;
	}).simulate( "dragstart", {} );
	equal( bindCalled, true );
});

test( "accept dragenter event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "dragenter", function (e) {
		bindCalled = true;
	}).simulate( "dragenter", {} );
	equal( bindCalled, true );
});

test( "accept drageleave event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "dragleave", function (e) {
		bindCalled = true;
	}).simulate( "dragleave", {} );
	equal( bindCalled, true );
});

test( "accept drageover event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "dragover", function (e) {
		bindCalled = true;
	}).simulate( "dragover", {} );
	equal( bindCalled, true );
});

test( "accept dragend event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "dragend", function (e) {
		bindCalled = true;
	}).simulate( "dragend", {} );
	equal( bindCalled, true );
});

test( "accept drop event", function () {
	var bindCalled = false;
	jQuery( "<div></div>" ).bind( "drop", function (e) {
		bindCalled = true;
	}).simulate( "drop", {} );
	equal( bindCalled, true );
});

test( "do not accept dragunknown event", function () {
	var bindCalled = false;
	var expectException = false;
	try {
		jQuery( "<div></div>" ).bind( "dragunknown", function (e) {
			bindCalled = true;
		}).simulate( "dragunknown", {} );
	} catch (e) {
		expectException = true;
	}
	notEqual( bindCalled, true );
	equal( expectException, true );
});


var key = jQuery.simulate.keyCode,
	keyEvents = [ "keydown", "keyup", "keypress" ],
	i = 0;

module( "key events" );

function testKeyEvent ( keyEvent ) {
	test( keyEvent, function () {
		expect( 2 );
		jQuery( "<div></div>" ).bind( keyEvent, function ( event ) {
			ok( true, keyEvent + " event fired" );
			equal( event.keyCode, key.PAGE_UP, keyEvent + " event has correct keyCode" );
		}).appendTo( "#qunit-fixture" ).simulate( keyEvent, {
			keyCode: key.PAGE_UP
		});
	});
}

for ( ; i < keyEvents.length; i++ ) {
	testKeyEvent( keyEvents[ i ] );
}

module( "mousemove events" );

asyncTest( "fire mouseover/mouseout events on DOM elements the mouse collides with", function () {

	var moves = 4,
		calls = 1,
		el = jQuery( "<div class='top-left'></div>" ).appendTo( "#qunit-fixture" ),
		auditTrail = [];

	// Expect one assertion per event, and one test of the audit trail
	expect(
		// Once for the element having been entered
		1 +
		// Once for the element having been exited
		1 +
		// Once for each mouse move
		moves +
		// Once for the audit trail
		1
	);

	el
		// Listen to the element for mouseover events
		.bind( "mouseover", function () {
			ok( true, "mouseover event fired at the element" );

			// Record the event
			auditTrail.push( "call" + calls + ";mouseover" );
		})
		// Listen to the element for mouseout events
		.bind( "mouseout", function () {
			ok( true, "mouseout event fired at the element" );

			// Record the event
			auditTrail.push( "call" + calls + ";mouseout" );
		});
	jQuery( document ).bind( "mousemove", function () {
		ok( true, "mousemove event fired at the document" );

		// Record the event
		auditTrail.push( "call" + calls + ";mousemove" );

		if ( ++calls > moves ) {
			deepEqual( auditTrail, [
				// The first move should have resulted in a simple mousemove
				"call1;mousemove",
				// The second move should have resulted in a mouseover on the element followed by a mousemove on the document
				"call2;mouseover",
				"call2;mousemove",
				// The third call should have resulted in a simple mousemove
				"call3;mousemove",
				// The fourth call should have resulted in a mouseout on the element followed by a mousemove on the document
				"call4;mouseout",
				"call4;mousemove"
			]);

			// Clean up
			jQuery( document ).unbind( "mousemove" );
			el.unbind( "mouseover" ).unbind( "mouseout" );

			// Tell QUnit to give'r
			start();
		}
	});

	jQuery( document )
		// Start outside the element
		.simulate( "mousemove", {
			clientX: 0,
			clientY: 2
		})
		// Move over top of the element
		.simulate( "mousemove", {
			clientX: 0,
			clientY: 1
		})
		// Move within the element
		.simulate( "mousemove", {
			clientX: 1,
			clientY: 1
		})
		// Move out of the element
		.simulate( "mousemove", {
			clientX: 2,
			clientY: 1
		});
});

module( "complex events" );

asyncTest( "alt key and click", function() {

	var el = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		button = jQuery( "<button></button>" ).appendTo( "#qunit-fixture" ),
		calls = 0;

	expect( 2 );

	el.bind( "click", function( event ) {
		ok( event.altKey, "alt key pressed while click on div" );
		el.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		altKey: true
	});

	button.bind( "click", function( event ) {
		ok( event.altKey, "alt key pressed while click on button" );
		button.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		altKey: true
	});
});

asyncTest( "ctrl key and click", function() {

	var el = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		button = jQuery( "<button></button>" ).appendTo( "#qunit-fixture" ),
		calls = 0;

	expect( 2 );

	el.bind( "click", function( event ) {
		ok( event.ctrlKey, "ctrl key pressed while click on div" );
		el.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		ctrlKey: true
	});

	button.bind( "click", function( event ) {
		ok( event.ctrlKey, "ctrl key pressed while click on button" );
		button.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		ctrlKey: true
	});
});

asyncTest( "meta key and click", function() {

	var el = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		button = jQuery( "<button></button>" ).appendTo( "#qunit-fixture" ),
		calls = 0;

	expect( 2 );

	el.bind( "click", function( event ) {
		ok( event.metaKey, "meta key pressed while click on div" );
		el.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		metaKey: true
	});

	button.bind( "click", function( event ) {
		ok( event.metaKey, "meta key pressed while click on button" );
		button.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		metaKey: true
	});
});

asyncTest( "shift key and click", function() {

	var el = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		button = jQuery( "<button></button>" ).appendTo( "#qunit-fixture" ),
		calls = 0;

	expect( 2 );

	el.bind( "click", function( event ) {
		ok( event.shiftKey, "shift key pressed while click" );
		el.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		shiftKey: true
	});

	button.bind( "click", function( event ) {
		ok( event.shiftKey, "shift key pressed while click on button" );
		button.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		shiftKey: true
	});
});

asyncTest( "right mouse click", function() {

	var el = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		button = jQuery( "<button></button>" ).appendTo( "#qunit-fixture" ),
		calls = 0;

	expect( 2 );

	el.bind( "click", function( event ) {
		equal( 2, event.button, "right mouse click on div" );
		el.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		button: 2
	});

	button.bind( "click", function( event ) {
		equal( 2, event.button, "right mouse click on button" );
		button.unbind( "click" );
		if ( ++calls === 2 ) {
			start();
		}
	}).simulate( "click", {
		button: 2
	});
});

asyncTest( "drag moves option", function () {
	var expectedMoves = 20,
		expectedUps = 6,
		expectedDowns = 6,
		callsMoves = 0,
		callsUp = 0,
		el = jQuery( "<div class='top-left'></div>" ).appendTo( "#qunit-fixture" ),
		position;

	expect(expectedUps + expectedDowns + expectedMoves);

	jQuery(document).bind( "mousedown", function (event) {
		ok( true, "mousedown event fired at the document" );
		position = {
			clientX: event.clientX,
			clientY: event.clientY
		};
	}).bind( "mouseup", function () {
		ok( true, "mouseup event fired at the document" );
		if (++callsUp === expectedUps) {
			jQuery(document)
				.unbind( "mousedown" )
				.unbind( "mousemove" )
				.unbind( "mouseup" );
			start();
		}
	}).bind( "mousemove", function (event) {
		ok( true, "mousemove event fired at the document" );
		if (++callsMoves === expectedMoves - 2 - 3) {
			equal(position.clientX + 10, event.clientX, "last mousemove fired at correct clientX" );
			equal(position.clientY + 20, event.clientY, "last mousemove fired at correct clientX" );
		}
	});

	el.simulate( "drag", {
		moves: 1,
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		moves: 5,
		dx: 10,
		dy: 20
	});

	// falsey defaults to 3
	el.simulate( "drag", {
		moves: 0,
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		dx: 10,
		dy: 20
	}).simulate( "drag", {
		moves: null,
		dx: 10,
		dy: 20
	});
	
	// no moves
	el.simulate( "drag", {
		moves: 0,
		dx: 0,
		dy: 0
	});
});

})();
