(function extend_control(){
	
	// 상태 저장소
	var sgk2dCreator = window.SmartGeoKit2D;
	function SmartGeoKit2D(){
		
		var sgk2d = this;
		sgk2dCreator.apply( sgk2d, arguments );
		
		// 상태 저장소
		sgk2d.stateStore = {
				
				// 현재 상태
				stateSeq: -1,
				
				// 데이터
				data: [
					
//						{
//							redo: function(){},
//							undo: function(){}
//						},...
					
				]
		
		};
		
	}
	
	for( var key in sgk2dCreator ){
		SmartGeoKit2D[key] = sgk2dCreator[ key ];
	}
	
	SmartGeoKit2D.prototype = Object.create( sgk2dCreator.prototype );
	SmartGeoKit2D.prototype.constructor = SmartGeoKit2D;
	SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.StateStore" );

	// 상태 추가
	SmartGeoKit2D.prototype.addStates = function sgk2d_addState( redo, undo ){
		
		// 2. 추가된 데이터를 최신 상태로 변경
		this.stateStore.stateSeq++;

		// 1. 현재 상태에서 다음 모든 이력 제거 + 데이터 추가
		var deleteLength = this.stateStore.data.length - this.stateStore.stateSeq;
		this.stateStore.data.splice( this.stateStore.stateSeq, deleteLength, { redo: redo, undo: undo } );
		
		
	};
	
	// UNDO
	SmartGeoKit2D.prototype.undo = function sgk2d_undo(){
		
		if( this.stateStore.stateSeq === -1 ){
			return;
		}
		var doPackage = this.stateStore.data[ this.stateStore.stateSeq ];
			doPackage.undo();
		this.stateStore.stateSeq--;
		
	};

	// REDO
	SmartGeoKit2D.prototype.redo = function sgk2d_redo(){
		
		if( this.stateStore.stateSeq === this.stateStore.data.length-1 ){
			return;
		}
		this.stateStore.stateSeq++;
		var doPackage = this.stateStore.data[ this.stateStore.stateSeq ];
			doPackage.redo();
		
	};
	
	window.SmartGeoKit2D = SmartGeoKit2D;
	
})();