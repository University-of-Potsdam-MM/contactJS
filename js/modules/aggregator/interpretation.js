/**
 * Created by tobias on 15.04.15.
 */
define(['easejs', 'interpreter', 'attributeList'],
    function(easejs, Interpreter, AttributeList) {
        var Class = easejs.Class;
        var Interpretation = Class('Interpretation', {
            'public interpreterId' : null,
            'public inAttributeTypes' : new AttributeList(),
            'public outAttributeTypes' : new AttributeList(),

            'public __construct' : function(_interpreterId, _inAttributes, _outAttributes){
                this.interpreterId = _interpreterId;
                this.inAttributeTypes = _inAttributes;
                this.outAttributeTypes = _outAttributes;
            }

        });

        return Interpretation;
    }
);