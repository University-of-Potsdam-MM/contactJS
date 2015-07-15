requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../js',
    //except, if the module ID starts with another path,
    //load them from their respective directory.
    paths:
    {
        jquery: '../libs/jquery/jquery',
        MathUuid: '../libs/uuid/Math.uuid',
        qunit: "../libs/qunit/qunit",
        contactJS: '../dist/contactJS'
    },
    
    shim:{
        'jquery' : {
            exports : '$'
        },
        'MathUuid' : {
            exports : 'MathUuid'
        }
    }
});