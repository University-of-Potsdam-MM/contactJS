define(['interpreter', 'attributeList'], function(Interpreter, AttributeList) {
    return (function () {
        /**
         *
         * @param {String} interpreterId
         * @param {AttributeList} inAttributes
         * @param {AttributeList} outAttributes
         * @returns {Interpretation}
         * @constructs Interpretation
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