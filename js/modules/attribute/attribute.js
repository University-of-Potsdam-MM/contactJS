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
        function Attribute(overrideBuilderDependency) {

            // avoid inexpert meddling with attribute construction
            if (typeof overrideBuilderDependency == 'undefined' || !overrideBuilderDependency)
                throw new Error("Attributes must be created by discoverer's buildAttribute() method!");

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
            this._value = 'CV_UNKNOWN';

            /**
             * Time when the value was set.
             *
             * @type {Date}
             * @private
             */
            this._timestamp = new Date();

            return this;
        }

        Attribute.fromAttributeDescription = function(discoverer, attributeDescription) {
            return discoverer.buildAttribute(
                attributeDescription.name,
                attributeDescription.type,
                attributeDescription.parameterList,
                true);
        };

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
         * Builder for synonyms from single translation.
         *
         * @param translation
         * @returns {Attribute}
         */
        Attribute.prototype.withSynonym = function(translation){
            this.addSynonym(translation);
            return this;
        };

        /**
         * Builder for synonyms from (several) translations.
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
         * Returns the list of synonyms.
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
         * Adds a synonym to synonymList.
         *
         * @param synonym
         */
        Attribute.prototype.addSynonym = function(synonym){
            if (synonym instanceof Attribute)
                this._synonymList.push(synonym);
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
         * Returns true if the attribute has synonyms.
         *
         * @returns {boolean}
         */
        Attribute.prototype.hasSynonyms = function() {
            return this._synonymList.length > 0;
        };

        /**
         * Returns true if the attribute has the given attribute in its synonymList.
         *
         * @param attribute
         * @returns {boolean}
         */
        Attribute.prototype.hasSynonym = function(attribute) {
            for (var i in this._synonymList)
                if (this._synonymList[i].equalsTypeOf(attribute)) return true;
            return false;
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
            // name, type and parameters equivalent
            if(this._equalsTypeOf(attribute))
                return true;

            // check synonyms for equality
            var theseSynonyms = this.getSynonyms();

            if (attribute instanceof Attribute) {
                var thoseSynonyms = attribute.getSynonyms();
                for (var i in theseSynonyms) {
                    var thisSynonym = theseSynonyms[i];
                    if (attribute._equalsTypeOf(thisSynonym)) {
                        return true;
                    }
                }
                for (var i in thoseSynonyms) {
                    var thatSynonym = thoseSynonyms[i];
                    if (this._equalsTypeOf(thatSynonym)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Auxiliary function comparing only name, type and parameters (without synonyms)
         *
         * @param attribute
         * @returns {boolean}
         * @private
         */
        Attribute.prototype._equalsTypeOf = function(attribute) {
            if (attribute instanceof Attribute) {
                if ((this.getName() == attribute.getName()
                    && this.getType() == attribute.getType()
                    && this.getParameters().equals(attribute.getParameters()))) {
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
         * Format: (AttributeName:AttributeType)#[FirstParameterName:FirstParameterType:FirstParameterValue]…
         *
         * @returns {String}
         * @example (CI_USER_LOCATION_DISTANCE:FLOAT)#[CP_TARGET_LATITUDE:INTEGER:52][CP_TARGET_LONGITUDE:INTEGER:13][CP_UNIT:STRING:KILOMETERS]
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