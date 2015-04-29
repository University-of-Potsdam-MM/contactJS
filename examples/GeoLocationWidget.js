/**
 * Created by tobias on 25.04.15.
 */
define(['contactJS'], function (contactJS) {
	return (function() {
		/**
		 *
		 * @requires contactJS
		 * @extends Widget
		 * @param discoverer
		 * @constructor
		 */
		function GeoLocationWidget(discoverer) {
			contactJS.Widget.call(this, discoverer);
			this.name = 'GeoLocationWidget';
		}

		GeoLocationWidget.prototype = Object.create(contactJS.Widget.prototype);

		GeoLocationWidget.prototype._initOutAttributes = function() {
			var latitude = new contactJS.Attribute()
				.withName('latitude')
				.withType('double');

			var longitude = new contactJS.Attribute()
				.withName('longitude')
				.withType('double');

			this.addOutAttribute(latitude);
			this.addOutAttribute(longitude);
		};

		GeoLocationWidget.prototype._initConstantOutAttributes = function() {

		};

		GeoLocationWidget.prototype._initCallbacks = function() {
			this._addCallback(new contactJS.Callback().withName('UPDATE').withAttributeTypes(this.getOutAttributes()));
		};

		GeoLocationWidget.prototype.queryGenerator = function (callback) {
			var self = this;
			var response = new contactJS.AttributeList();

			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position) {
					response.put(self.getOutAttributes().getItems()[0].setValue(position.coords.latitude));
					response.put(self.getOutAttributes().getItems()[1].setValue(position.coords.longitude));

					self._sendResponse(response, callback);
				}, function(error) {
					//TODO: handle error
					self._sendResponse(response, callback);
				});
			} else {
				//TODO: handle error
				self._sendResponse(response, callback);
			}
		};

		GeoLocationWidget.prototype._sendResponse = function(response, callback) {
			this.putData(response);
			this.notify();

			if (callback && typeof(callback) == 'function') {
				callback();
			}
		};

		return GeoLocationWidget;
	})();
});