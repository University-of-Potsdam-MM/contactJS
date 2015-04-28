require(['configTest', 'qunit'], function() {
	QUnit.start();
	QUnit.test( "hello test", function( assert ) {
		assert.ok( 1 == "1", "Passed!" );
	});
});
