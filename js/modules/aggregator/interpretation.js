/**
 * Created by tobias on 15.04.15.
 */
define(['interpreter', 'attributeList'],
    function(Interpreter, AttributeList) {

        var Interpretation = (function() {

            function Interpretation(interpreterId, inAttributes, outAttributes) {
                this.interpreterId = interpreterId;
                this.inAttributeTypes = inAttributes;
                this.outAttributeTypes = outAttributes;

                return this;
            }

            return Interpretation;
        })();

        return Interpretation;
    }
);