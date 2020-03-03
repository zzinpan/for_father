(function extend_control(){
	
	var sgk2dCreator = window.SmartGeoKit2D;
	var Math = sgk2dCreator.Math;
	
	function SmartGeoKit2D(){
		
		var sgk2d = this;
		sgk2dCreator.apply( sgk2d, arguments );
		
		// 마우스 객체
		sgk2d.mouseControl = {
				
				// 판단
				isDraged: false, // 현재 드래그 여부
				isEnableMousearea: true, // 마우스 영역 사용 여부
				
				button: null, // 누르고 있는 버튼
				beforePageXy: new SmartGeoKit2D.Vector2(), // 이전 page 좌표
				downXy: new SmartGeoKit2D.Vector2(), // 버튼을 눌렀을 당시 좌표
				beforeCameraRotation: { x: 0, y: 0 } // 회전 전 카메라 회전값
			};
		
		// 선택 상자
		var selectBox = (function createSelectBox(){
				var sb = sgk2d.addRectangle("SGK2D.selectBox");
				sb.fillStyle = "rgba( 255, 0, 0, 0.2 )";
				sb.strokeStyle = "#ff0000";
				sb.lineWidth = 1;
				sb.zIndex = 99999;
				sgk2d.scene.remove( sb );
				return sb;
		})();
		
		// 이벤트 추가
		sgk2d.event.mousedown = {}; // 다운 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mouseup = {}; // 업 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mousemove = {}; // 이동 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.click = {}; // 클릭 완료 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mousearea = {}; // 왼쪽 버튼 드래그 완료 시점 ( Event, minX, minY, maxX, maxY ) 
		
		/**
			확대, 축소, 이동 관련 마우스 이벤트 등록
		 **/
		var DownAction = {
				"0": function showSelector( e ){
					selectBox.scale.set( 0, 0 );
					sgk2d.scene.add( selectBox );
				},
				"1": function (){
					sgk2d.mouseControl.beforeCameraRotation.x = sgk2d.camera.rotation.x;
					sgk2d.mouseControl.beforeCameraRotation.y = sgk2d.camera.rotation.y;
				},
				"2": function (){}
		};
		
		var UpAction = {
				"0": function hideSelector( e ){},
				"1": function hideSelector( e ){},
				"2": function hideSelector( e ){}
		};
		
		var DragAction = {
				"0": function selector( e ){
					
					if( sgk2d.mouseControl.isEnableMousearea === false ){
						return;
					}
					
					var csdX = sgk2d.scene.CSD.x;
					var csdY = -1 * sgk2d.scene.CSD.y;
					var downXy = sgk2d.getMouseXy();
					var width = downXy.x - sgk2d.mouseControl.downXy.x;
					var height = downXy.y - sgk2d.mouseControl.downXy.y;
					
					selectBox.position.x = sgk2d.mouseControl.downXy.x + width / 2;
					selectBox.position.y = sgk2d.mouseControl.downXy.y + height / 2;
					selectBox.scale.x = width;
					selectBox.scale.y = height;
					
				},
				"1": function rotate( e ){
					
					e.preventDefault();
					
					var downXy = sgk2d.getMouseXy();
					var downWidth = sgk2d.mouseControl.downXy.x - sgk2d.camera.position.x;
					var downHeight = sgk2d.mouseControl.downXy.y - sgk2d.camera.position.y;
					var dragWidth = downXy.x - sgk2d.camera.position.x;
					var dragHeight = downXy.y - sgk2d.camera.position.y;
					
					var downRadians = Math.atan2( downHeight, downWidth );
					var dragRadians = Math.atan2( dragHeight, dragWidth );
					var radians = dragRadians - downRadians;
					
					sgk2d.camera.rotation.x = sgk2d.mouseControl.beforeCameraRotation.x + radians;
					sgk2d.camera.rotation.y = sgk2d.mouseControl.beforeCameraRotation.y + radians;
					
				},
				"2": function translate( e ){
					var moveX = sgk2d.mouseControl.beforePageXy.x - e.pageX;
					var moveY = sgk2d.mouseControl.beforePageXy.y - e.pageY;
					sgk2d.camera.position.x += sgk2d.scene.CSD.x * moveX / sgk2d.camera.scale.x;
					sgk2d.camera.position.y += -sgk2d.scene.CSD.y * moveY / sgk2d.camera.scale.y;
					
				}
			};
		
		function onMousedown( e ){
			
			var downXy = sgk2d.getMouseXy();
			sgk2d.mouseControl.button = e.button;
			
			// 버튼 별 동작 처리
			DownAction[ e.button ]( e );
			
			sgk2d.mouseControl.downXy.x = downXy.x;
			sgk2d.mouseControl.downXy.y = downXy.y;
			
			sgk2d.mouseControl.beforePageXy.x = e.pageX;
			sgk2d.mouseControl.beforePageXy.y = e.pageY;
			
			sgk2d.event.executeCallback( "mousedown", e, downXy.x, downXy.y );
			
		}
		function onMousemove( e ){
			
			if( sgk2d.mouseControl.button != null ){
				
				var isDragX = sgk2d.mouseControl.beforePageXy.x != e.pageX;
				var isDragY = sgk2d.mouseControl.beforePageXy.y != e.pageY;
				
				if( isDragX || isDragY ){
					sgk2d.mouseControl.isDraged = true;
					DragAction[ sgk2d.mouseControl.button ]( e );
				}
			}
			
			sgk2d.mouseControl.beforePageXy.x = e.pageX;
			sgk2d.mouseControl.beforePageXy.y = e.pageY;
			
			
			var moveXy = sgk2d.getMouseXy();
			sgk2d.event.executeCallback( "mousemove", e, moveXy.x, moveXy.y );
			
		}
		function onMouseup( e ){
			var upXy = sgk2d.getMouseXy();

			// 선택 영역 제거
			sgk2d.scene.remove( selectBox );
			
			// 버튼 별 동작 처리
			UpAction[ e.button ]( e );
			if( sgk2d.mouseControl.isDraged === true ){
				
				if( sgk2d.mouseControl.isEnableMousearea === true ){
					if( e.button === 0 ){
						var minX = Math.min( sgk2d.mouseControl.downXy.x, upXy.x );
						var minY = Math.min( sgk2d.mouseControl.downXy.y, upXy.y );
						var maxX = Math.max( sgk2d.mouseControl.downXy.x, upXy.x );
						var maxY = Math.max( sgk2d.mouseControl.downXy.y, upXy.y );
						sgk2d.event.executeCallback( "mousearea", e, minX, minY, maxX, maxY );
					}
				}
				sgk2d.event.executeCallback( "mouseup", e, upXy.x, upXy.y );
			
			}else{
				sgk2d.event.executeCallback( "click", e, upXy.x, upXy.y );
			}
			
			// 마우스 객체 초기화
			sgk2d.mouseControl.isDraged = false;
			sgk2d.mouseControl.button = null;
		}
		function onMousewheel( e ){
			if( e.deltaY < 0 ){
				sgk2d.zoomInCamera();
				return;
			}
			sgk2d.zoomOutCamera();
		}
		function onContextmenu( e ){
			e.preventDefault();
		}
		
		sgk2d.renderer.canvas.addEventListener("mousedown", onMousedown);
		sgk2d.renderer.canvas.addEventListener("mousemove", onMousemove);
		sgk2d.renderer.canvas.addEventListener("mouseup", onMouseup);
		sgk2d.renderer.canvas.addEventListener("mousewheel", onMousewheel);
		sgk2d.renderer.canvas.addEventListener("contextmenu", onContextmenu);
		
	}
	
	for( var key in sgk2dCreator ){
		SmartGeoKit2D[key] = sgk2dCreator[ key ];
	}
	
	SmartGeoKit2D.prototype = Object.create( sgk2dCreator.prototype );
	SmartGeoKit2D.prototype.constructor = SmartGeoKit2D;
	SmartGeoKit2D.prototype.getMouseXy = function sgk2d_getMouseXy( _addX, _addY ){
		
		var sgk2d = this;
		
		var addX = _addX || 0;
		var addY = _addY || 0;
		
		var canvasWidth = sgk2d.renderer.canvas.width;
		var canvasHeight = sgk2d.renderer.canvas.height;

		var scaleX = sgk2d.camera.scale.x;
		var scaleY = sgk2d.camera.scale.y;
		
		var rotationX = sgk2d.camera.rotation.x;
		var rotationY = sgk2d.camera.rotation.y;
		
		var positionX = sgk2d.camera.position.x;
		var positionY = sgk2d.camera.position.y;
		
		var pointerX = sgk2d.mouseControl.beforePageXy.x + addX;
		var pointerY = sgk2d.mouseControl.beforePageXy.y + addY;

		var csdX = sgk2d.scene.CSD.x;
		var csdY = -1 * sgk2d.scene.CSD.y;
		
		var defaultX = pointerX - canvasWidth / 2;
		var defaultY = pointerY - canvasHeight / 2;
		
		var sX = defaultX / scaleX;
		var sY = defaultY / scaleY;
		
		var tX = sX + csdX * positionX;
		var tY = sY + csdY * positionY;
		
		return { x: csdX * tX, y: csdY * tY };
		
	};
	SmartGeoKit2D.prototype.enableMousearea = function sgk2d_enableMousearea(){
		this.mouseControl.isEnableMousearea = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMousearea = function sgk2d_disableMousearea(){
		this.mouseControl.isEnableMousearea = false;
		return true;
	};
	window.SmartGeoKit2D = SmartGeoKit2D;
	
	
})();