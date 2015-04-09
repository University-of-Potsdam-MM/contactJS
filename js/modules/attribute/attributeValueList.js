/**
 * This module represents a AttributeValueList. It is a subclass of
 * AbstractList.
 * 
 * @module AttributeValueList
 * @fileOverview
 */
define(['easejs', 'abstractList', 'attributeValue', 'attributeType', 'attributeTypeList', 'parameterList'],
	function(easejs, AbstractList, AttributeValue, AttributeType, AttributeTypeList, ParameterList) {
		var Class = easejs.Class;

		/**
		 * @class AttributeValueList
		 * @classdesc This class represents a list for AttributeValue.
		 * @extends AbstractList
		 * @requires easejs
		 * @requires AbstractList
		 * @requires AttributeValue
		 * @requires AttributeType
		 * @requires AttributeTypeList)
		 */
		var AttributeValueList = Class('AttributeValueList').extend(AbstractList,{
			/**
			 * @alias counter
			 * @protected
			 * @type {integer}
			 * @memberof AttributeValueList#
			 * @desc Number of items.
			 */
			'protected counter' : 0,
			/**
			 * @alias items
			 * @protected
			 * @type {AttributeValueList}
			 * @memberof AttributeValueList#
			 * @desc ItemList.
			 */
			'protected items' : {},

			/**
			 * Builder for item list.
			 * 
			 * @public
			 * @alias withItems
			 * @memberof AttributeValueList#
			 * @param {(AttributeValueListst|Array)} _attributeValueList AttributeValueList
			 * @returns {AttributeValueList}
			 */
			'public withItems' : function(_attributeValueList) {
				var list = [];
				if (_attributeValueList instanceof Array) {
					list = _attributeValueList;
				} else if (Class.isA(AttributeValueList,
						_attributeValueList)) {
					list = _attributeValueList.getItems();
				}
				for (var i in list) {
					var attributeValue = list[i];
					if (Class.isA(AttributeValue, attributeValue)) {
						this.items[attributeValue.getIdentifier()] = attributeValue;
						this.counter++;
					}
				}
				return this;
			},

			/**
			 * Add the specified item to this itemList.
			 * 
			 * @public
			 * @alias put
			 * @memberof AttributeValueList#
			 * @param {AttributeValue} _attributeValue AttributeValue
			 */
			'public put' : function(_attributeValue) {
				if (Class.isA(AttributeValue, _attributeValue)) {
					if (!(this.containsKey(_attributeValue.getIdentifier()))) {
						this.counter++;
					}
					this.items[_attributeValue.getIdentifier()] = _attributeValue;
				}
			},

			/**
			 * Adds all items in the specified list to this.
			 * itemList
			 * 
			 * @public
			 * @alias putAll
			 * @memberof AttributeValueList#
			 * @param {AttributeValueList} _attributeValueList AttributeValueList
			 */
			'public putAll' : function(_attributeValueList) {
				var list = [];
				if (_attributeValueList instanceof Array) {
					list = _attributeValueList;
				} else if (Class.isA(AttributeValueList, _attributeValueList)) {
					list = _attributeValueList.getItems();
				}
				for ( var i in list) {
					var attributeValue = list[i];
					if (Class.isA(AttributeValue, attributeValue)) {
						if (!(this.containsKey(attributeValue.getIdentifier()))) {
							this.counter++;
						}
						this.items[attributeValue.getIdentifier()] = attributeValue;
					}
				}
			},

			/**
			 * Verifies whether the given item is included
			 * in the list.
			 * 
			 * @public
			 * @alias contains
			 * @memberof AttributeValueList#
			 * @param {AttributeValue} _item AttributeValue that should be verified.
			 * @returns {boolean}
			 */
			'public contains' : function(_item) {
				if (Class.isA(AttributeValue, _item)) {
					var tmp = this.getItem(_item.getIdentifier());
					if (!(typeof tmp === 'undefined') && tmp.equals(_item)) {
						return true;
					}
				}
				return false;
			},

			/**
			 * Compare the specified AttributeValueList with
			 * this instance.
			 * 
			 * @public
			 * @alias equals
			 * @memberof AttributeValueList#
			 * @param {AttributeValueList} _list AttributeValueList that should be compared.
			 * @returns {boolean}
			 */
			'public equals' : function(_list) {
				if (Class.isA(AttributeValueList, _list) && _list.size() == this.size()) {
					var items = _list.getItems();
					for ( var i in items) {
						var item = items[i];
						if (!this.contains(item)) {
							return false;
						}
					}
					return true;
				}
				return false;
			},

			/**
			 * Returns only this values that matches to the
			 * given type.
			 * 
			 * @public
			 * @alias getSubset
			 * @memberof AttributeValueList#
			 * @param {(AttributeTypeList|Array)} _attributeTypeList AttributeTypes that should be returned.
			 * @returns {AttributeValueList}
			 */
			'public getSubset' : function(_attributeTypeList) {
				var response = new AttributeValueList();
				var list = [];
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList,	_attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for ( var i in list) {
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {
						var attribute = this.items[attributeType.getIdentifier()];
						if (typeof attribute != "undefined") {
							response.put(attribute);
						}
					}
				}
				return response;
			},
			
			/**
			 * Returns a subset without the given types.
			 * 
			 * @public
			 * @alias getSubsetWithoutItems
			 * @memberof AttributeValueList#
			 * @param {(AttributeTypeList|Array)} _attributeTypeList AttributeTypes that should not be included
			 * @returns {AttributeValueList}
			 */
			'public getSubsetWithoutItems' : function(_attributeTypeList) {
				var response = this;
				var list = [];
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList,	_attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for (var i in list) {
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {
						response.removeItem(attributeType.getIdentifier());
					}
				}
				return response;
			},

            /**
             * Alias for {#getItem}.
             *
             * @public
             * @alias getValue
			 * @memberof AttributeValueList#
             * @param _key The value key.
             * @returns {*}
             */
            'public getAttributeValue': function(_key) {
                return this.getItem(_key);
            },

			/**
			 * Returns the attribute value that matches the provided attribute type.
			 *
			 * @public
			 * @alias getValueForAttributeType
			 * @memberof AttributeValueList#
			 * @param {AttributeType} _attributeType
			 * @returns {AttributeValue}
			 */
            'public getValueForAttributeType': function(_attributeType) {
                return this.getAttributeValue(_attributeType.getIdentifier()).getValue();
            }

		});

		return AttributeValueList;
	});