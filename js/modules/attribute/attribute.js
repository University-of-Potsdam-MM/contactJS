/**
 * @module Attribute
 */
define(['parameterList'], function(ParameterList) {
    return (function() {
        /**
         * Initializes the Attribute.
         *
         * @classdesc Attribute defines name, type (string, double,...) an associated parameter of an attribute.
         * @constructs Attribute
         */
        function Attribute() {
            /**
             * Name of the Attribute.
             *
             * @type {String}
             * @private
             */
            this._name = '';

            /**
             * Defines the type of the Attribute (i.e String, Double,...).
             *
             * @type {string}
             * @private
             */
            this._type = '';

            /**
             *
             * @type {ParameterList}
             * @private
             */
            this._parameterList = new ParameterList();

            /**
             *
             * @type {Array}
             * @private
             */
            this._synonymList = [];

            /**
             *
             * @type {string}
             * @private
             */
            this._value = 'NO_VALUE';

            /**
             * Time when the value was set.
             *
             * @type {Date}
             * @private
             */
            this._timestamp = new Date();

            return this;
        }

        /**
         * Builder for name.
         *
         * @param {String} name The attribute name to build with.
         * @returns {Attribute}
         */
        Attribute.prototype.withName = function(name){
            this.setName(name);
            return this;
        };

        /**
         * Builder for type.
         *
         * @param {String} type The attribute type to build with.
         * @returns {Attribute}
         */
        Attribute.prototype.withType = function(type){
            this.setType(type);
            return this;
        };

        /**
         * Builder for one parameter.
         *
         * @param {Parameter} parameter The parameter to build with.
         * @returns {Attribute}
         */
        Attribute.prototype.withParameter = function(parameter){
            this.addParameter(parameter);
            return this;
        };

        /**
         * Builder for parameterList.
         *
         * @param {(ParameterList|Array)} parameterList ParameterList
         * @returns {Attribute}
         */
        Attribute.prototype.withParameters = function(parameterList){
            this.setParameters(parameterList);
            return this;
        };

        /**
         * Builder for value.
         *
         * @param {String} value value
         * @returns {Attribute}
         */
        Attribute.prototype.withValue = function(value) {
            this.setValue(value);
            this.setTimestamp(new Date());
            return this;
        };

        /**
         * Builder for timestamp.
         *
         * @param {Date} timestamp timestamp
         * @returns {Attribute}
         */
        Attribute.prototype.withTimestamp = function(timestamp) {
            this.setTimestamp(timestamp);
            return this;
        };

        /**
         * Builder for synonyms from single translation, called by discoverer's buildAttribute().
         *
         * @param translation
         * @returns {Attribute}
         */
        Attribute.prototype.withSynonym = function(translation){
            this.addSynonym(translation);
            return this;
        };

        /**
         * Builder for synonyms from translations, called by discoverer's buildAttribute().
         *
         * @param translations
         * @returns {Attribute}
         */
        Attribute.prototype.withSynonyms = function(translations){
            this.setSynonyms(translations);
            return this;
        };

        /**
         * Returns the name.
         *
         * @returns {string}
         */
        Attribute.prototype.getName = function(){
            return this._name;
        };

        /**
         * Returns the type.
         *
         * @returns {string}
         */
        Attribute.prototype.getType = function(){
            return this._type;
        };

        /**
         * Returns the parameters.
         *
         * @returns {ParameterList}
         */
        Attribute.prototype.getParameters = function(){
            return this._parameterList;
        };

        /**
         * Returns the list of synonyms
         *
         * @returns {Array}
         */
        Attribute.prototype.getSynonyms = function(){
            return this._synonymList;
        };

        /**
         * Sets the name.
         *
         * @param {string} name Name
         */
        Attribute.prototype.setName = function(name){
            if(typeof name === 'string'){
                this._name = name;
            }
        };

        /**
         * Sets the type.
         *
         * @param {string} type Type
         */
        Attribute.prototype.setType = function(type){
            if(typeof type === 'string'){
                this._type = type;
            }
        };

        /**
         * Adds a parameter.
         *
         * @param {Parameter} parameter Parameter
         */
        Attribute.prototype.addParameter = function(parameter){
            this._parameterList.put(parameter);
        };

        /**
         * Adds one synonym.
         *
         * @param synonym
         */
        Attribute.prototype.addSynonym = function(synonym){
            if (synonym instanceof Attribute)
                this.synonymList.push(synonym.getName());
            else if (typeof _synonym == 'string')
                this.synonymList.push(synonym);
        };

        /**
         * Adds a list of Parameter.
         *
         * @param {ParameterList} parameters ParameterList
         */
        Attribute.prototype.setParameters = function(parameters){
            this._parameterList.putAll(parameters);
        };

        /**
         * Adds a list of synonyms.
         *
         * @param synonyms
         */
        Attribute.prototype.setSynonyms = function(synonyms){
            for (var synIndex in synonyms) {
                this.addSynonym(synonyms[synIndex]);
            }
        };

        /**
         * Returns true if the attribute is parameterized.
         *
         * @returns {boolean}
         */
        Attribute.prototype.hasParameters = function() {
            return this._parameterList.size() > 0;
        };

        /**
         * Sets the value.
         *
         * @param {string} value value
         * @returns {Attribute}
         */
        Attribute.prototype.setValue = function(value) {
            this._value = value;
            return this;
        };

        /**
         * Returns the value.
         *
         * @returns {string}
         */
        Attribute.prototype.getValue = function() {
            return this._value;
        };

        /**
         * Sets the timestamp.
         *
         * @param {Date} time timestamp
         */
        Attribute.prototype.setTimestamp = function(time) {
            this._timestamp = time;
        };

        /**
         * Returns the timestamp.
         *
         * @returns {Number}
         */
        Attribute.prototype.getTimestamp = function() {
            return this._timestamp;
        };

        /**
         *
         * @returns {boolean}
         */
        Attribute.prototype.hasInputParameter = function() {
            return this.hasParameters() && this._parameterList.hasInputParameter();
        };

        /**
         * Compares this instance with the given one.
         *
         * @param {Attribute} attribute Attribute that should be compared.
         * @returns {boolean}
         */
        Attribute.prototype.equalsTypeOf = function(attribute) {
            var name = attribute.getName();
            if (attribute instanceof Attribute) {
                if ((this.getName() == name || this.getSynonyms().indexOf(name) != -1)
                    && this.getType() == attribute.getType()
                    && this.getParameters().equals(attribute.getParameters())) {
                    return true;
                }
            }
            return false;
        };

        /**
         *
         * @param {Attribute} attribute
         * @returns {Boolean}
         */
        Attribute.prototype.equalsValueOf = function(attribute) {
            if (attribute instanceof Attribute) {
                if (this.equalsTypeOf(attribute) && this.getValue() == attribute.getValue()) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns an identifier that uniquely describes the attribute type and its parameters.
         * The identifier can be used to compare two attribute types. <br/>
         * Format: (AttributeName:AttributeType)#[FirstParameterName:FirstParameterValue]…
         *
         * @returns {String}
         * @example (CI_USER_LOCATION_DISTANCE:FLOAT)#[CP_TARGET_LATITUDE:52][CP_TARGET_LONGITUDE:13][CP_UNIT:KILOMETERS]
         */
        Attribute.prototype.toString = function(typeOnly) {
            var identifier = "(" + this.getName() + ":" + this.getType() + ")";
            if (this.hasParameters()) {
                identifier += "#";
                for (var index in this.getParameters().getItems()) {
                    var theParameter = this.getParameters().getItems()[index];
                    identifier += theParameter.toString();
                }
            }
            if (!typeOnly) identifier += ":" + this.getValue();
            return identifier;
        };

        return Attribute;
    })();
});