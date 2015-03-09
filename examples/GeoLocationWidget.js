/**
 * This module represents a GeoLocationWidget. It is a subclass of Widget.
 * 
 * @module GeoLocationWidget
 * @fileOverview
 */
define([ 'easejs', 'contactJS' ],
	function(easejs, contactJS) {

		var Class = easejs.Class;
		/**
		 * @class GeoLocationWidget
		 * @classdesc This Widget provides the current position of the
		 *            device.
		 * @extends Widget
		 * @requires easejs
		 * @requires Widget
		 * @requires AttributeType
		 * @requires AttributeValue
		 * @requires AttributeTypeList
		 * @requires AttributeValueList
		 * @requires Callback
		 * @requires Parameter
		 */
	
		var GeoLocationWidget = Class('GeoLocationWidget').extend(contactJS.Widget,{

			/**
			 * @alias name
			 * @public
			 * @type {string}
			 * @memberof GeoLocationWidget#
			 * @desc Name of the Widget. In this case: GeoLocationWidget
			 */
			'public name' : 'GeoLocationWidget',

			/**
			 * Initializes attributes. For this class: Latitude and
			 * Longitude
			 * 
			 * @protected
			 * @alias initAttributes
			 * @memberof GeoLocationWidget#
			 */
			'protected initAttributes' : function() {
				var latitude = new contactJS.AttributeValue().withName('latitude')
											.withType('double')
											.withValue('undefined');
				this.addAttribute(latitude);
				var longitude = new contactJS.AttributeValue().withName('longitude')
											.withType('double')
											.withValue('undefined');
				this.addAttribute(longitude);
			},

			/**
			 * Initializes constantAttributes. For this class: no
			 * constantAttributes available
			 * 
			 * @protected
			 * @alias initConstantAttributes
			 * @memberof GeoLocationWidget#
			 */
			'protected initConstantAttributes' : function() {
			},

			/**
			 * Initializes Callbacks. For this class:
			 * UPDATE (latitude and longitude)
			 * 
			 * @protected
			 * @alias initCallbacks
			 * @memberof GeoLocationWidget#
			 */
			'protected initCallbacks' : function() {
				var list = new contactJS.AttributeTypeList();
				list.put(this.getWidgetAttributeTypes().getItem("latitude"));
				list.put(this.getWidgetAttributeTypes().getItem("longitude"));
				var call = new contactJS.Callback().withName('UPDATE').withAttributeTypes(list);
				this.addCallback(call);
			},

			
			'override public notify' : function() {
				var callbacks = this.queryCallbacks().getItems();
				for(var i in callbacks){
					this.sendToSubscriber(callbacks[i]);
				}
			},

			/**
			 * Implements queryGenerator(). Query latitude and
			 * longitude by calling
			 * navigator.geolocation.getCurrentPosition().
			 * 
			 * @override
			 * @protected
			 * @alias queryGenerator
			 * @memberof GeoLocationWidget#
			 */
			'override protected queryGenerator' : function(_function) {
				var self = this;
				if(navigator.geolocation){
					navigator.geolocation.getCurrentPosition(function(_position) {
                            self.onSuccess(_position, self, _function);
                        }, function(error) {
                            self.onError(error, self, _function);
                        });
				} else {
					alert("Keine Ortung moeglich");
				}
				
			},

			/**
			 * Success function for navigator.geolocation.getCurrentPosition() used in
			 * queryGenerator(). Stores the values in the associated attributes.
			 * 
			 * @callback
			 * @private
			 * @alias onSuccess
			 * @memberof GeoLocationWidget#
			 * @param _position
			 * @param {this} self
			 */
			'private onSuccess' : function(_position, self, _function) {
				var latitude = new contactJS.AttributeValue().withName('latitude')
												.withType('double')
												.withValue(_position.coords.latitude);
				var longitude = new contactJS.AttributeValue().withName('longitude')
												.withType('double')
												.withValue(_position.coords.longitude);
				var response = new contactJS.AttributeValueList();
				response.put(latitude);
				response.put(longitude);
				self.putData(response);
				self.notify();
				if (_function && typeof(_function) == 'function'){
					_function();
				}
			},

			/**
			 * Error function for navigator.geolocation.getCurrentPosition() used in
			 * queryGenerator().
			 * 
			 * @callback
			 * @private
			 * @alias onError
			 * @memberof GeoLocationWidget#
			 * @param error
			 */
			'private onError' : function(error, self, _function) {
                var latitude = new contactJS.AttributeValue().withName('latitude')
                    .withType('double')
                    .withValue("undefined");
                var longitude = new contactJS.AttributeValue().withName('longitude')
                    .withType('double')
                    .withValue("undefined");

                var response = new contactJS.AttributeValueList();
                response.put(latitude);
                response.put(longitude);
                self.putData(response);
                self.notify();
                if (_function && typeof(_function) == 'function'){
                    _function();
                }
			}
		});
		return GeoLocationWidget;
	});