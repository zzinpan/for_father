(function Mode(){
	
	function getFn( fn ){
		if( typeof fn === "function" ){
			return fn;
		}
		return function basic(){};
	}
	
	function getObj( obj ){
		if( typeof obj === "object" ){
			return obj;
		}
		return {};
	}
	
	/**
	 * 모드 Class
	 */
	function Mode( data, fnStart, fnEnd ){
		
		this.fnStart = getFn( fnStart );
		this.fnEnd = getFn( fnEnd );
		this.data = getObj( data );
		
	}

	Mode.prototype.start = function(){
		this.fnStart();
	};

	Mode.prototype.end = function(){
		this.fnEnd();
	};
	
	window.Mode = Mode;
	
})();