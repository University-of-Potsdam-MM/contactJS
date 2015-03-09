requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../js',
    //except, if the module ID starts with another path,
    //load them from their respective directory.
    paths:
    {
        jquery: '../libs/jquery/jquery',
        easejs: '../libs/ease.js/ease-full',
        MathUuid: '../libs/uuid/Math.uuid',
        contactJS: '../dist/contactJS'
    },
    
    shim:{
    	
      'easejs' : {
        exports : 'easejs'
      },
      'jquery' : {
          exports : '$'
        },
        
      'MathUuid' : {
          exports : 'MathUuid'
        }
         
    }

});