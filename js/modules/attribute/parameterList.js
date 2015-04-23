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
		var ParameterList = Class('ParameterList').extend(AbstractList, {
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
				if (_parameterList instanceof Array) {
					this.items = _parameterList;
				} else if (Class.isA(ParameterList, _parameterList)) {
					this.items = _parameterList.getItems();
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
					if (!(this.contains(_parameter))) {
						this.items.push(_parameter);
					}
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
				for (var i in list) {
					this.put(list[i]);
				}
			},

			/**
			 * Verifies whether the given item is contained in the list.
			 * 
			 * @public
			 * @alias contains
			 * @memberof ParameterList#
			 * @param {Parameter} _item Parameter that should be verified
			 * @returns {boolean}
			 */
			'public contains' : function(_item) {
				if (Class.isA(Parameter, _item)) {
					for (var index in this.items) {
						var tmp = this.items[index];
						if (tmp.equals(_item)) {
							return true;
						}
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
			 * @param {ParameterList} _parameterList ParameterList that should be compared
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
					var theParameter = this.items[key];
                    parameters[theParameter.getKey()] = theParameter.getValue();
                }
                return parameters;
            },

			'public hasInputParameter': function() {
				for (var index in this.items) {
					var theParameter = this.items[index];
					if (theParameter.getValue() == "PV_INPUT") return true;
				}
				return false;
			}
		});

		return ParameterList;
	});