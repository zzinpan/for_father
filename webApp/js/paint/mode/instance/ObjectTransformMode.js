$(function object2dangleDrawMode(){ with( window.Global ){
	
	Global.ModeList.ObjectTransformMode = new Mode( 

			// 모드 데이터
			{
				object2d: null,
				handle: null,
				downX: null,
				downY: null,
				moveX: null,
				moveY: null,
				needsUpdateView: false,
				beforeMode: null,
				sgk2dDrawEventIdList: [],
				endCallback: function(){}
			},
			
			function start(){
				
				$botImgBtn.stop().fadeIn( 500 );
				
				var mode = this;
				var margin = $viewer.offset().top;
				
				// 이미 object2dangleDrawMode 에서 object2d데이터를 전달 받음
				sgk2dDraw.selectObject( mode.data.object2d );
				
				mode.data.sgk2dDrawEventIdList.push( 
					sgk2dDraw.on("mousedown", function( e, x, y ){
					
						var objects = sgk2dDraw.getObjectsByXy( x, y, true );
						mode.data.downX = x;
						mode.data.downY = y;
						mode.data.moveX = x;
						mode.data.moveY = y;
						mode.data.handle = objects[ 0 ];
						
					}) 
				);
				
				mode.data.sgk2dDrawEventIdList.push(
					sgk2dDraw.on("mousemove", function( e, x, y ){
						
						if( mode.data.downX == null ){
							// 커서
							ModeList.ObjectDrawMode.data.cursor.image = ModeList.ObjectDrawMode.data.defaultCursorImage;
							ModeList.ObjectDrawMode.data.cursor.userData.pivot.x = -10;
							ModeList.ObjectDrawMode.data.cursor.userData.pivot.y = 10;
							
							var objects = sgk2dDraw.getObjectsByXy( x, y, true );
							if( objects.length > 0 ){
								
								for( var i=0; i<objects.length; ++i ){
									var object = objects[ i ];
									if( object.isHandle === true ){
										if( objects[ i ].handleType == "PANEL" ){
											ModeList.ObjectDrawMode.data.cursor.image = ModeList.ObjectDrawMode.data.moveCursorImage;
										}else if( objects[ i ].handleType == "ROTE" ){
											ModeList.ObjectDrawMode.data.cursor.image = ModeList.ObjectDrawMode.data.rotateCursorImage;
										}else if( objects[ i ] ){
											ModeList.ObjectDrawMode.data.cursor.image = ModeList.ObjectDrawMode.data.scaleCursorImage;
										}
										ModeList.ObjectDrawMode.data.cursor.userData.pivot.x = 0;
										ModeList.ObjectDrawMode.data.cursor.userData.pivot.y = 0;
										break;
									}
								}
								
							}
							
							var pivotX = x - ModeList.ObjectDrawMode.data.cursor.userData.pivot.x;
							var pivotY = y - ModeList.ObjectDrawMode.data.cursor.userData.pivot.y;
							ModeList.ObjectDrawMode.data.cursor.position.x = pivotX;
							ModeList.ObjectDrawMode.data.cursor.position.y = pivotY;
							
						}
						
						if( mode.data.handle == null ){
							return;
						}
						
						var object2d = mode.data.object2d;
						
						switch( mode.data.handle.handleType ){
						
							case "ROTE": {
								
								var beforeRadians = Math.atan2( 
										mode.data.moveY - object2d.position.y, 
										mode.data.moveX - object2d.position.x 
									);
								
								var nowRadians = Math.atan2(
										y - object2d.position.y,
										x - object2d.position.x
									);
								
								var minus = nowRadians - beforeRadians;
								sgk2dDraw.rotateObjectsByHandle( minus );
								mode.data.moveX = x;
								mode.data.moveY = y;
								break;
							}
							
							case "PANEL": {
								
								var movedX = x - mode.data.moveX;
								var movedY = y - mode.data.moveY;
								sgk2dDraw.moveObjectsByHandle( movedX, movedY );
								mode.data.moveX = x;
								mode.data.moveY = y;
								break;
							}
							
							case "L": {
								
								var objectSnap = getSnapPoint( object2d );
								var l = objectSnap.l;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								l.multiplyMatrix3( itM );
								l.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - l.x;
								sgk2dDraw.scaleObjectsByHandleL( -movedX );
								break;
							}
							
							case "R": {
								
								var objectSnap = getSnapPoint( object2d );
								var r = objectSnap.r;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								r.multiplyMatrix3( itM );
								r.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - r.x;
								sgk2dDraw.scaleObjectsByHandleR( movedX );
								break;
							}
							
							case "T": {
	
								var objectSnap = getSnapPoint( object2d );
								var t = objectSnap.t;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								t.multiplyMatrix3( itM );
								t.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedY = pointer.y - t.y;
								sgk2dDraw.scaleObjectsByHandleT( movedY );
								break;
							}
							
							case "B": {
	
								var objectSnap = getSnapPoint( object2d );
								var b = objectSnap.b;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								b.multiplyMatrix3( itM );
								b.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedY = pointer.y - b.y;
								sgk2dDraw.scaleObjectsByHandleB( -movedY );
								break;
							}
			
							case "LT": {
	
								var objectSnap = getSnapPoint( object2d );
								var lt = objectSnap.lt;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								lt.multiplyMatrix3( itM );
								lt.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - lt.x;
								var movedY = pointer.y - lt.y;
								
								sgk2dDraw.scaleObjectsByHandleT( movedY );
								sgk2dDraw.scaleObjectsByHandleL( -movedX );
								break;
							}
			
							case "RT": {
	
								var objectSnap = getSnapPoint( object2d );
								var rt = objectSnap.rt;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								rt.multiplyMatrix3( itM );
								rt.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - rt.x;
								var movedY = pointer.y - rt.y;
								
								sgk2dDraw.scaleObjectsByHandleT( movedY );
								sgk2dDraw.scaleObjectsByHandleR( movedX );
								break;
							}
			
							case "LB": {
	
								var objectSnap = getSnapPoint( object2d );
								var lb = objectSnap.lb;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								lb.multiplyMatrix3( itM );
								lb.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - lb.x;
								var movedY = pointer.y - lb.y;
								
								sgk2dDraw.scaleObjectsByHandleB( -movedY );
								sgk2dDraw.scaleObjectsByHandleL( -movedX );
								break;
							}
			
							case "RB": {
	
								var objectSnap = getSnapPoint( object2d );
								var rb = objectSnap.rb;
								
								var pointer = new SmartGeoKit2D.Vector2( x, y );
								
								// 역행렬 조회
								var tM = object2d.position.getTranslateMatrix3();
								var itM = tM.getInverseMatrix3();
	
								// 역행렬 조회
								var rM = object2d.rotation.getRotateMatrix3();
								var irM = rM.getInverseMatrix3();
								
								// lt의 스케일값만 확인
								rb.multiplyMatrix3( itM );
								rb.multiplyMatrix3( irM );
	
								// pointer의 스케일값만 확인
								pointer.multiplyMatrix3( itM );
								pointer.multiplyMatrix3( irM );
								
								var movedX = pointer.x - rb.x;
								var movedY = pointer.y - rb.y;
								
								sgk2dDraw.scaleObjectsByHandleB( -movedY );
								sgk2dDraw.scaleObjectsByHandleR( movedX );
								break;
							}
						
						} // end - switch( handleType )
						
					})
				);
				
				mode.data.sgk2dDrawEventIdList.push(
					sgk2dDraw.on("mouseup", function( e, x, y ){
						
						var downX = mode.data.downX;
						var downY = mode.data.downY;
						
						mode.data.handle = null;
						mode.data.downX = null;
						mode.data.downY = null;

						// 클릭할때만 종료판단 
						if( downX != x || downY != y ){
							return;
						}

						var objects = sgk2dDraw.getObjectsByXy( x, y, true );
						
						// 객체를 선택 안한 경우
						if( objects.length === 0 ){
							mode.data.endCallback = function(){
								sgk2dDraw.addObject( ModeList.ObjectDrawMode.data.cursor );
								ModeList.ObjectDrawMode.data.cursor.image = ModeList.ObjectDrawMode.data.scaleCursorImage;
							}
							mode.end();
						}
						
					})
				);
				
				mode.data.sgk2dDrawEventIdList.push(
						// 렌더링을 한번 처리하고나서 초기화작업
						sgk2dDraw.on("afterRender", function(){
							
							if( mode.data.needsUpdateView === false ){
								return;
							}
							
							sgk2dView.renderer.ctx.drawImage( sgk2dDraw.renderer.canvas, 0, 0 );
							sgk2dDraw.removeObjectAll();
							
							// 초기화
							mode.data.object2d = null;
							mode.data.handle = null;
							mode.data.downX = null;
							mode.data.downY = null;
							mode.data.moveX = null;
							mode.data.moveY = null;
							mode.data.needsUpdateView = false;
							
							// 이벤트 제거
							for( var i=0; i<mode.data.sgk2dDrawEventIdList.length; ++i ){
								var eventId = mode.data.sgk2dDrawEventIdList[ i ];
								sgk2dDraw.off( eventId );
							}
							mode.data.sgk2dDrawEventIdList = [];
							ModeList.ObjectDrawMode.data.isObjectTransform = false;
							mode.data.beforeMode = null;
							
							mode.data.endCallback();
							mode.data.endCallback = function(){};
							
						})
				);
				
			},
			function end(){
				
				$botImgBtn.stop().fadeOut( 500 );
				
				var mode = this;
				
				// draw 엔진을 view 반영
				sgk2dDraw.unSelectObject( mode.data.object2d );
				sgk2dDraw.removeObject( ModeList.ObjectDrawMode.data.cursor );
				mode.data.needsUpdateView = true;
				
			}
		);

	// 스냅 포인트 조회
	function getSnapPoint( object2d ){
		var minX = Math.min.apply( null, object2d.selectRange.x );
		var maxX = Math.max.apply( null, object2d.selectRange.x );
		var minY = Math.min.apply( null, object2d.selectRange.y );
		var maxY = Math.max.apply( null, object2d.selectRange.y );
		var centerX = minX + ( maxX - minX ) / 2;
		var centerY = minY + ( maxY - minY ) / 2;

		var sM = object2d.scale.getScaleMatrix3();
		var rM = object2d.rotation.getRotateMatrix3();
		var tM = object2d.position.getTranslateMatrix3();
		
		var lt = new SmartGeoKit2D.Vector2( minX, maxY );
		lt.multiplyMatrix3( sM );
		lt.multiplyMatrix3( rM );
		lt.multiplyMatrix3( tM );
		
		var t = new SmartGeoKit2D.Vector2( centerX, maxY );
		t.multiplyMatrix3( sM );
		t.multiplyMatrix3( rM );
		t.multiplyMatrix3( tM );
		
		var rt = new SmartGeoKit2D.Vector2( maxX, maxY );
		rt.multiplyMatrix3( sM );
		rt.multiplyMatrix3( rM );
		rt.multiplyMatrix3( tM );

		var l = new SmartGeoKit2D.Vector2( minX, centerY );
		l.multiplyMatrix3( sM );
		l.multiplyMatrix3( rM );
		l.multiplyMatrix3( tM );
		
		var c = new SmartGeoKit2D.Vector2( centerX, centerY );
		c.multiplyMatrix3( sM );
		c.multiplyMatrix3( rM );
		c.multiplyMatrix3( tM );
		
		var r = new SmartGeoKit2D.Vector2( maxX, centerY );
		r.multiplyMatrix3( sM );
		r.multiplyMatrix3( rM );
		r.multiplyMatrix3( tM );
		
		var lb = new SmartGeoKit2D.Vector2( minX, minY );
		lb.multiplyMatrix3( sM );
		lb.multiplyMatrix3( rM );
		lb.multiplyMatrix3( tM );
		
		var b = new SmartGeoKit2D.Vector2( centerX, minY );
		b.multiplyMatrix3( sM );
		b.multiplyMatrix3( rM );
		b.multiplyMatrix3( tM );
		
		var rb = new SmartGeoKit2D.Vector2( maxX, minY );
		rb.multiplyMatrix3( sM );
		rb.multiplyMatrix3( rM );
		rb.multiplyMatrix3( tM );
		
		return { lt: lt, t: t, rt: rt, l: l, c: c, r: r, lb: lb, b: b, rb: rb };
		
	}
	
}});