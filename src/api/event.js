/**
	콜백 등록
**/
SmartGeoKit2D.prototype.on = function sgk2d_on( type, callback ){
	var callbacks = this.event[ type ];
	if( callbacks == null ){
		return false;
	}
	
	if( typeof callback !== "function" ){
		return false;
	}
	
	var sequence = this.event.sequence;
	callbacks[ sequence ] = callback;
	this.event.sequence++;
	
	return sequence;
};

/**
	콜백 제거
**/
SmartGeoKit2D.prototype.off = function sgk2d_off( reqSequence ){
	
	for( var type in this.event ){
		var callbacks = this.event[ type ];
		for( var sequence in callbacks ){
			if( sequence == reqSequence ){
				delete callbacks[ sequence ];
				return true;
			}
		}
	}
	
	return false;
};