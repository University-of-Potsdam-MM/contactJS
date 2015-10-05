define(['interpreter', 'contextInformationList'], function(Interpreter, ContextInformationList) {
    return (function () {
        /**
         *
         * @param {String} interpreterId
         * @param {ContextInformationList} inContextInformation
         * @param {ContextInformationList} outContextInformation
         * @returns {Interpretation}
         * @class Interpretation
         */
        function Interpretation(interpreterId, inContextInformation, outContextInformation) {
            /**
             *
             * @type {String}
             */
            this.interpreterId = interpreterId;

            /**
             *
             * @type {ContextInformationList}
             */
            this.inContextInformation = inContextInformation;

            /**
             *
             * @type {ContextInformationList}
             */
            this.outContextInformation = outContextInformation;

            return this;
        }

        return Interpretation;
    })();
});