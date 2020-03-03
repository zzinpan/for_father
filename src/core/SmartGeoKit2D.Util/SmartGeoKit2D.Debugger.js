/**
	SmartGeoKit2D.Debugger
 **/
SmartGeoKit2D.Debugger = {
	
	/*
		디버깅 레벨
		0: 일반 사용자
		1: 웹 개발자
		2: SGK2D 개발자
	 */
	level: 0,
		
	assert: function sgk2d_debugger_assert( bool, msg ){
		if( bool == true ){
			throw msg;
		}
	},
	
	log: function sgk2d_debugger_log(){
		window.console.log.apply( window.console, arguments );
	},
	warn: function sgk2d_debugger_warn(){
		window.console.warn.apply( window.console, arguments );
	},
	debug: function sgk2d_debugger_debug(){
		if( this.level > 1 ){
			window.console.log.apply( window.console, arguments );
		}
	},
	
};

