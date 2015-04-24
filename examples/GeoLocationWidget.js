/**
 * Created by tobias on 25.04.15.
 */
define(['easejs', 'contactJS'], function (easejs, contactJS) {
	var Class = easejs.Class;

	var GeoLocationWidget = Class('GeoLocationWidget').extend(contactJS.Widget, {
		'public name': 'GeoLocationWidget',

		'protected initAttributes': function () {
			var latitude = new contactJS.Attribute()
				.withName('latitude')
				.withType('double');

			var longitude = new contactJS.Attribute()
				.withName('longitude')
				.withType('double');

			this.addAttribute(latitude);
			this.addAttribute(longitude);
		},

		'protected initConstantAttributes': function () {

		},

		'protected initCallbacks': function () {
			this.addCallback(new contactJS.Callback().withName('UPDATE').withAttributeTypes(this.getAttributes()));
		},

		'override protected queryGenerator': function (_function) {
			var self = this;
			var response = new contactJS.AttributeList();

			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(_position) {
					response.put(self.getAttributes().getItems()[0].setValue(_position.coords.latitude));
					response.put(self.getAttributes().getItems()[1].setValue(_position.coords.longitude));

					self.sendResponse(response, _function);
				}, function(error) {
					//TODO: handle error
					self.sendResponse(response, _function);
				});
			} else {
				//TODO: handle error
				self.sendResponse(response, _function);
			}
		},

		'private sendResponse': function(response, _function) {
			this.putData(response);
			this.notify();

			if (_function && typeof(_function) == 'function') {
				_function();
			}
		}
	});

	return GeoLocationWidget;
});