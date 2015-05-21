/**
 * Created by tobias on 15.04.15.
 */
define(['interpreter', 'attributeList'], function(Interpreter, AttributeList) {
    return (function () {
        /**
         *
         * @param {String} interpreterId
         * @param {AttributeList} inAttributes
         * @param {AttributeList} outAttributes
         * @returns {Interpretation}
         * @constructor
         */
        function Interpretation(interpreterId, inAttributes, outAttributes) {
            /**
             *
             * @type {String}
             */
            this.interpreterId = interpreterId;

            /**
             *
             * @type {AttributeList}
             */
            this.inAttributeTypes = inAttributes;

            /**
             *
             * @type {AttributeList}
             */
            this.outAttributeTypes = outAttributes;

            return this;
        }

        return Interpretation;
    })();
});