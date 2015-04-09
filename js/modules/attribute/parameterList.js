/**
 * This module represents a ParameterList. It is a subclass of AbstractList.
 * 
 * @module ParameterList
 * @fileOverview
 */
define([ 'easejs', 'abstractList', 'parameter' ],
	function(easejs, AbstractList, Parameter) {
		var Class = easejs.Class;
		/**			 
		 * @class ParameterList
		 * @classdesc This class represents a list for Parameter.
		 * @extends AbstractList
		 * @requires easejs
		 * @requires AbstractList
		 * @requires Parameter
		 */
		var ParameterList = Class('ParameterList').extend(AbstractList,{

			/**
			 * @alias counter
			 * @protected
			 * @type {integer}
			 * @memberof ParameterList#
			 * @desc Number of items.
			 */
			'protected counter' : 0,
			/**
			 * @alias items
			 * @protected
			 * @type {ParameterList}
			 * @memberof ParameterList#
			 * @desc ItemList
			 */
			'protected items' : [],

			/**
			 * Builder for item list.
			 * 
			 * @public
			 * @alias withItems
			 * @memberof ParameterList#
			 * @param {(ParameterList|Array)} _parameterList ParameterList
			 * @returns {ParameterList}
			 */
			'public withItems' : function(_parameterList) {
				var list = [];
				if (_parameterList instanceof Array) {
					list = _parameterList;
				} else if (Class.isA(ParameterList, _parameterList)) {
					list = _parameterList.getItems();
				}
				for ( var i in list) {
					var parameter = list[i];
					if (Class.isA(Parameter, parameter)) {
						this.items[parameter.getKey()] = parameter.getValue();
						this.counter++;
					}
				}
				return this;
			},

			/**
			 * Adds the specified item to the item list.
			 * 
			 * @public
			 * @alias put
			 * @memberof ParameterList#
			 * @param {Parameter} _parameter ParameterList
			 */
			'public put' : function(_parameter) {
				if (Class.isA(Parameter, _parameter)) {

					if (!(this.containsKey(_parameter.getKey()))) {
						this.counter++;
					}
					this.items[_parameter.getKey()] = _parameter.getValue();
				}
			},

			/**
			 * Adds all items in the specified list to the item list.
			 * 
			 * @public
			 * @alias putAll
			 * @memberof ParameterList#
			 * @param {ParameterList} _parameterList ParameterList
			 */
			'public putAll' : function(_parameterList) {
				var list = [];
				if (_parameterList instanceof Array) {
					list = _parameterList;
				} else if (Class.isA(ParameterList,	_parameterList)) {
					list = _parameterList.getItems();
				}
				for ( var i in list) {
					var parameter = list[i];
					if (Class.isA(Parameter, parameter)) {
						if (!(this.containsKey(parameter.getKey()))) {
							this.counter++;
						}
						this.items[parameter.getKey()] = parameter.getValue();
					}
				}
			},

			/**
			 * Verifies whether the given item is contained in the list.
			 * 
			 * @public
			 * @alias contains
			 * @memberof ParameterList#
			 * @param {Parameter}
			 *            _item Parameter that should be
			 *            verified
			 * @returns {boolean}
			 */
			'public contains' : function(_item) {
				if (Class.isA(Parameter, _item)) {
					var tmp = this.getItem(_item.getKey());
					if (tmp === _item.getValue()) {
						return true;
					}
				}
				return false;
			},

			/**
			 * Compare the specified ParameterList with this instance. 
			 * 
			 * @public
			 * @alias equals
			 * @memberof ParameterList#
			 * @param {ParameterList} _list ParameterList that should be compared
			 * @returns {boolean}
			 */
			'public equals' : function(_parameterList) {
				if (Class.isA(ParameterList, _parameterList) && _parameterList.size() == this.size()) {
                    for (var index in _parameterList.getItems()) {
                        var theParameter = _parameterList.getItems()[index];
                        if (!this.contains(theParameter)) return false;
                    }
					return true;
				}
				return false;
			},

			/**
			 * Returns all items as parameter objects.
			 * @public
			 * @alias getItems
			 * @memberof ParameterList#
			 * @returns {Array<Parameter>}
			 */
			'override public getItems' : function() {
				var parameters = [];
				for (var key in this.items) {
					var parameter = new Parameter().withKey(key)
									.withValue(this.items[key]);
					parameters.push(parameter);
				}
				return parameters;
			},

			/**
			 * Returns the objects of the list as JSON objects.
			 *
			 * @public
			 * @alias getItemsAsJson
			 * @memberof ParameterList#
			 * @returns {{}}
			 */
            'public getItemsAsJson': function() {
                var parameters = {};
                for (var key in this.items) {
                    parameters[key] = this.items[key];
                }
                return parameters;
            },

			/**
			 * Returns an identifier of all the parameters in the list.
			 * The identifier can be used to compare two parameter lists. <br/>
			 * Format: [FirstParameterName:FirstParameterValue][SecondParameterName:SecondParameterValue]…
			 *
			 * @public
			 * @alias getIdentifier
			 * @memberof ParameterList#
			 * @returns {String}
			 * @example [CP_TARGET_LATITUDE:52][CP_TARGET_LONGITUDE:13][CP_UNIT:KILOMETERS]
			 */
            'public getIdentifier': function() {
                var identifier = "";
                for (var key in this.items) {
                    var value = this.items[key];
					if (value != "PV_INPUT") {
						identifier += "["+key+":"+value+"]";
					} else {
						identifier += "["+key+"]";
					}
                }
                return identifier;
            }
		});

		return ParameterList;
	});