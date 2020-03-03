$(function ObjectDrawMode(){ with( window.Global ){
	
	Global.ModeList.ObjectDrawMode = new Mode( 

			// 모드 데이터
			{
				downButton: null,
				downX: null,
				downY: null,
				object2d: null,
				isObjectTransform: false,
				sgk2dDrawEventIdList: [],
				defaultCursorImage: (function defaultCursorImage(){
					var image = new Image();
					image.src = "/image/paint/default.png";
					return image;
				})(),
				moveCursorImage: (function moveCursorImage(){
					var image = new Image();
					image.src = "/image/paint/move.png";
					return image;
				})(),
				rotateCursorImage: (function rotateCursorImage(){
					var image = new Image();
					image.src = "/image/paint/rotate.png";
					return image;
				})(),
				scaleCursorImage: (function scaleCursorImage(){
					var image = new Image();
					image.src = "/image/paint/scale.png";
					return image;
				})(),
				cursor: (function createCursor(){
					var cursor = new SmartGeoKit2D.Rectangle("cursor");
					cursor.scale.set( 20, 20 );
					cursor.fillStyle = "rgba(0,0,0,0)";
					cursor.userData.pivot = { x: 0, y: 0 };
					return cursor;
				})()
			},
			
			function start(){
				
				var mode = this;
				var margin = $viewer.offset().top;
				
				// 커서
				mode.data.cursor.image = mode.data.scaleCursorImage;
				
				// draw엔진 실행
				sgk2dDraw.run();
				sgk2dDraw.enableMouseControl();
				sgk2dDraw.disableMousearea();
				sgk2dDraw.disableMousemove();
				sgk2dDraw.disableMouserotate();
				sgk2dDraw.disableMousezoom();
				
				// 지우개 설정
				var sgk2dViewCtx = sgk2dView.renderer.ctx;
				sgk2dViewCtx.save();
				
				mode.data.sgk2dDrawEventIdList.push( 
					sgk2dDraw.on("mousedown", function( e, x, y ){
					
						if( mode.data.isObjectTransform === true ){
							return;
						}
						
						mode.data.downButton = e.button;
						mode.data.downX = x;
						mode.data.downY = y;
						
						if( mode.data.downButton != 0 ){
							return;
						}

						// 마우스 왼쪽 버튼만 가능
						
						var shape = $tools.filter(".active").attr("data-shape");
						var method = "add" + shape;
						
						mode.data.object2d = sgk2dDraw[ method ]( "object_" + Date.now().toString() );
						mode.data.object2d.fillStyle = "rgba(0,0,0,0)";
						mode.data.object2d.strokeStyle = Global.color;
						mode.data.object2d.lineWidth = Global.thickness;
						mode.data.object2d.position.set( x, y );
						
					}) 
				);
				
				mode.data.sgk2dDrawEventIdList.push(
					sgk2dDraw.on("mousemove", function( e, x, y ){
						
						var cursorX = x - mode.data.cursor.userData.pivot.x;
						var cursorY = y - mode.data.cursor.userData.pivot.y;
						mode.data.cursor.position.set( cursorX, cursorY );
						
						if( mode.data.isObjectTransform === true ){
							return;
						}
						
						// 왼쪽 드래그
						if( mode.data.downButton === 0 ){
							
							var minX = Math.min.apply( null, mode.data.object2d.selectRange.x );
							var minY = Math.min.apply( null, mode.data.object2d.selectRange.y );
							var maxX = Math.max.apply( null, mode.data.object2d.selectRange.x );
							var maxY = Math.max.apply( null, mode.data.object2d.selectRange.y );
							
							var ratioX = maxX - minX;
							var ratioY = maxY - minY;
							
							var width = ( x - mode.data.downX );
							var height = -( y - mode.data.downY );
							
							mode.data.object2d.position.set( x - width / 2, y + height / 2 );
							mode.data.object2d.scale.set( width / ratioX, height / ratioY );
							
						}
						
					})
				);
				
				mode.data.sgk2dDrawEventIdList.push(
					sgk2dDraw.on("mouseup", function( e, x, y ){
						
						if( mode.data.isObjectTransform === true ){
							return;
						}
						
						// 마우스 다운 지점과 업 지점이 다를 경우만 그린 것으로 간주
						if( mode.data.downX != x || mode.data.downY != y ){
							// 사각형을 그린 경우, 사각형 변형 모드 실행
							mode.data.isObjectTransform = true;
							
							// 사각형의 scale 바로잡기
							if( mode.data.object2d.scale.y < 0 ){
								mode.data.object2d.scale.y = Math.abs( mode.data.object2d.scale.y );
								mode.data.object2d.rotation.set( Math.PI, Math.PI );
							}
							if( mode.data.object2d.scale.x < 0 ){
								mode.data.object2d.scale.x = Math.abs( mode.data.object2d.scale.x );
							}
							ModeList.ObjectTransformMode.data.object2d = mode.data.object2d;
							ModeList.ObjectTransformMode.data.beforeMode = mode;
							ModeList.ObjectTransformMode.start();
						}else{
							mode.data.isObjectTransform = false;
						}
						
						mode.data.downButton = null;
						mode.data.downX = null;
						mode.data.downY = null;
						mode.data.object2d = null;
						
					})
				);
				
				mode.data.sgk2dDrawEventIdList.push(
						sgk2dDraw.on("mouseenter", function( e ){
							sgk2dDraw.addObject( mode.data.cursor );
						})	
				);
				
				mode.data.sgk2dDrawEventIdList.push(
						sgk2dDraw.on("mouseleave", function( e ){
							sgk2dDraw.removeObject( mode.data.cursor );
						})	
				);
				
			},
			function end(){
				
				var mode = this;
				
				mode.data.downButton = null;
				mode.data.downX = null;
				mode.data.downY = null;
				mode.data.object2d = null;
				if( mode.data.isObjectTransform === true ){
					ModeList.ObjectTransformMode.end();
				}
				mode.data.isObjectTransform = false;
				sgk2dDraw.removeObject( mode.data.cursor );
				
				for( var i=0; i<mode.data.sgk2dDrawEventIdList.length; ++i ){
					var eventId = mode.data.sgk2dDrawEventIdList[ i ];
					sgk2dDraw.off( eventId );
				}
				mode.data.sgk2dDrawEventIdList = [];
				
			}
		);

}});