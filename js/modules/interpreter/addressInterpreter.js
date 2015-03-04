/**
 * This module representing an AddressInterpreter.
 * 
 * @module AddressInterpreter
 * @fileOverview
 */
define(['easejs', 'jquery', 'interpreter', 'attributeType', 'attributeValue'],
	function(easejs, $, Interpreter, AttributeType, AttributeValue) {
		var Class = easejs.Class;
		/**
		 * @class AddressInterpreter
		 * @classdesc This Widget returns the address of specified coordinates.
		 * @extends Interpreter
		 * @requires easejs
		 * @requires jquery
		 * @requires Interpreter
		 * @requires AttributeType
		 * @requires AttributeValue
		 * @requires Parameter
		 */
		var AddressInterpreter = Class('AddressInterpreter').extend(Interpreter,{
			/**
			 * @alias name
			 * @public
			 * @type {String}
			 * @memberof AddressInterpreter#
			 * @desc Name of the Interpreter. In this case: AddressInterpreter
			 */
			'public name' : 'AddressInterpreter',
			/**
			 * @alias adress
			 * @private
			 * @type {Array}
			 * @memberof AddressInterpreter#
			 */
			'private address' : [],

			/**
			 * Initializes inAttributes. For this class: Latitude and
			 * Longitude
			 * 
			 * @protected
			 * @alias initInAttributes
			 * @memberof AddressInterpreter#
			 */
			'protected initInAttributes' : function() {
				var latitude = new AttributeType()
						.withName('latitude').withType('double');
				this.inAttributeTypes.put(latitude);
				var longitude = new AttributeType()
						.withName('longitude').withType('double');
				this.inAttributeTypes.put(longitude);
			},

			/**
			 * Initializes outAttributes. For this class: Address as String
			 * 
			 * @protected
			 * @alias initOutAttributes
			 * @memberof AddressInterpreter#
			 */
			'protected initOutAttributes' : function() {
				var formattedAddress = new AttributeType()
						.withName('formattedAddress')
						.withType('string');
				this.outAttributeTypes.put(formattedAddress);
			},

			/**
			 * Changes coordinates to address
			 * 
			 * @protected
			 * @alias interpretData
			 * @memberof AddressInterpreter#
			 * @param {AttributeValueList} _data list of data that should be interpreted
			 * @param {?function} _function for additional actions, if an asynchronous function is used
			 */
			'protected interpretData' : function(_data, _function) {
				if(navigator.onLine){
					var self = this;
					var lat = _data.getItem('latitude');
					var lng = _data.getItem('longitude');
					if (lat.getValue() && lng.getValue()) {
						var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="
								+ lat.getValue()+ ","+ lng.getValue()+ "&sensor=false";
						$.getJSON(url, function(json) {self.createAddress(json,	self.response, self, _function);});
					}
				} else {
					alert("Keine Internetverbindung verfuegbar");
				};
			},

			/**
			 * Success function for callback createAddress() used in interpretData().
			 * Sets the outAttributes.
			 * 
			 * @callback
			 * @private
			 * @alias response
			 * @memberof AddressInterpreter#
			 * @param {AddressInterpreter} self 
			 * @param {?function} _function for additional actions, if an asynchronous function is used
			   
			 */
			'private response' : function(self, _function) {
				self.setOutAttribute('formattedAddress','string', self.address["formatted_address"]);
				if (_function && typeof(_function) == 'function'){
					_function();
				}
			},

			/**
			 * Creates the address.
			 * 
			 * @callback
			 * @private
			 * @alias createAddress
			 * @memberof AddressInterpreter#
			 * @param {Array} json
			 * @param {function} _function for additional actions, because an asynchronous function is used
			 * @param {AddressInterpreter} self for usage in callback
			 * @param {?function} secondFunction for additional actions, if an asynchronous function is used
			 */
			'private createAddress' : function(json, _function, self, secondFunction) {
				if (!self.checkStatus(json)){
					alert("Keine Adresse ermittelbar");
				} else {
					self.address['formatted_address'] = self.googleGetAddress(json, self);
					_function(self, secondFunction);
				}
			},

			/**
			 * Check status.
			 * 
			 * @private
			 * @alias checkStatus
			 * @memberof AddressInterpreter#
			 * @param {Array} json
			 */
			'private checkStatus' : function(json) {
				if (json["status"] == "OK")
					return true;
				return false;
			},

			/**
			 * Stores address in array.
			 * 
			 * @private
			 * @alias googleGetAddress
			 * @memberof AddressInterpreter#
			 * @param {Array} json
			 * @param {AddressInterpreter} self
			 */
			'private googleGetAddress' : function(json,
					self) {
				return json["results"][0]["formatted_address"];
			},

							});

			return AddressInterpreter;
		});