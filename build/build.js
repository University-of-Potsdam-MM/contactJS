({
	
	baseUrl: '../js',
	mainConfigFile: "../js/config.js",
    name : '../libs/almond/almond',
    paths: {
    	contactJS: '../build/contactJS'
    },
    include: ['contactJS'],
    exclude: ["easejs", "jquery", "MathUuid"],
    out: "../dist/contactJS.js",
    wrap: {
        startFile: "wrap.start",
        endFile: "wrap.end"
    },
    optimize: "none"
    
})

	 
	
	 