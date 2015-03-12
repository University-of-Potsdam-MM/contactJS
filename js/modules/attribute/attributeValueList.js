/**
 * This module represents a AttributeValueList. It is a subclass of
 * AbstractList.
 * 
 * @module AttributeValueList
 * @fileOverview
 */
define(['easejs', 'abstractList', 'attributeValue', 'attributeType', 'attributeTypeList' ],
	function(easejs, AbstractList, AttributeValue, AttributeType, AttributeTypeList) {
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
			'protected items' : [],

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
				var list = new Array();
				if (_attributeValueList instanceof Array) {
					list = _attributeValueList;
				} else if (Class.isA(AttributeValueList,
						_attributeValueList)) {
					list = _attributeValueList.getItems();
				}
				for ( var i in list) {
					var attributeValue = list[i];
					if (Class.isA(AttributeValue, attributeValue)) {
						this.items[attributeValue.getName()] = attributeValue;
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
					if (!(this.containsKey(_attributeValue.getName()))) {
						this.counter++;
					}
					this.items[_attributeValue.getName()] = _attributeValue;
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
				var list = new Array();
				;
				if (_attributeValueList instanceof Array) {
					list = _attributeValueList;
				} else if (Class.isA(AttributeValueList, _attributeValueList)) {
					list = _attributeValueList.getItems();
				}
				for ( var i in list) {
					var attributeValue = list[i];
					if (Class.isA(AttributeValue, attributeValue)) {
						if (!(this.containsKey(attributeValue.getName()))) {
							this.counter++;
						}
						this.items[attributeValue.getName()] = attributeValue;
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
					var tmp = this.getItem(_item.getName());
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
				var list = new Array();
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList,	_attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for ( var i in list) {
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {
						var attribute = this.items[attributeType.getName()];
						if (attribute) {
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
				var list = new Array();
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList,	_attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for ( var i in list) {
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {
						response.removeItem(attributeType.getName());
					}
				}
				return response;
			},

            /**
             * Alias for {#getItem}.
             *
             * @public
             * @alias getValue
             * @param _key The value key.
             * @returns {*}
             */
            'public getValue': function(_key) {
                return this.getItem(_key);
            }

		});

		return AttributeValueList;
	});