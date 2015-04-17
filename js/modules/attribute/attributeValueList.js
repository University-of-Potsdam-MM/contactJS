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
				var list = [];
				if (_attributeValueList instanceof Array) {
					list = _attributeValueList;
				} else if (Class.isA(AttributeValueList,
						_attributeValueList)) {
					list = _attributeValueList.getItems();
				}
				this.items = list;
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
			'public put' : function(_attributeValue, _multipleInstances) {
				if (Class.isA(AttributeValue, _attributeValue)) {
					if (_multipleInstances || !(this.containsAttributeType(_attributeValue.getAttributeType()))) {
						this.items.push(_attributeValue);
					} else {
						this.updateValue(_attributeValue);
					}
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
				for (var i in list) {
					this.put(list[i]);
				}
			},

			/**
			 * Verifies whether the given item is included
			 * in the list.
			 * 
			 * @public
			 * @alias contains
			 * @memberof AttributeValueList#
			 * @param {AttributeValue} _attributeValue AttributeValue that should be verified.
			 * @returns {boolean}
			 */
			'public contains' : function(_attributeValue) {
				if (Class.isA(AttributeValue, _attributeValue)) {
					for (var index in this.items) {
						var tmp = this.items[index];
						if (tmp.equals(_attributeValue)) {
							return true;
						}
					}
				}
				return false;
			},

			'public containsAttributeType': function(_attributeType) {
				if (Class.isA(AttributeType, _attributeType)) {
					for (var index in this.items) {
						var tmp = this.items[index].getAttributeType();
						if (tmp.equals(_attributeType)) {
							return true;
						}
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
					for (var index in _list.getItems()) {
						var theAttributeValue = _list.getItems()[index];
						if (!this.contains(theAttributeValue)) return false;
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
						var attribute = this.getValueObjectForAttributeType(attributeType);
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
						response.removeAttributeValuesWithAttributeType(attributeType);
					}
				}
				return response;
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
				return this.getValueObjectForAttributeType(_attributeType).getValue();
            },

			'public getValueObjectForAttributeType': function(_attributeType) {
				for (var index in this.getItems()) {
					var theAttributeValue = this.getItems()[index];
					if (theAttributeValue.getAttributeType().equals(_attributeType)) return theAttributeValue;
				}
			},

			'public removeAttributeValuesWithAttributeType': function(_attributeType) {
				for (var index in this.items) {
					var theAttributeValue = this.items[index];
					if (theAttributeValue.getAttributeType().equals(_attributeType)) this.items.splice(index, 1);
				}
			},

			'public updateValue': function(_attributeValue) {
				for (var index in this.items) {
					var theAttributeValue = this.items[index];
					if (theAttributeValue.getAttributeType().equals(_attributeValue.getAttributeType())) this.items[index] = _attributeValue;
				}
			}
		});

		return AttributeValueList;
	});