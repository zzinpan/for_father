(function extend_control(){
	
	var sgk2dCreator = window.SmartGeoKit2D;
	var Math = sgk2dCreator.Math;
	
	function changeButtonEvent( originEvent ){
		
		var cloneEvent = {};
		for( var key in originEvent ){
			cloneEvent[ key ] = originEvent[ key ];
		}
		cloneEvent.prototype = originEvent;
		cloneEvent.button = 2 - originEvent.button;
		cloneEvent.which = 4 - originEvent.which;
		
		return cloneEvent;
		
	}
	
	function SmartGeoKit2D(){
		
		var sgk2d = this;
		sgk2dCreator.apply( sgk2d, arguments );
		
		// 마우스 객체
		sgk2d.mouseControl = {
				
				isEnable: false,
				isEnableMousearea: true, // 마우스 영역 사용 여부
				isEnableMousemove: true, // 마우스 이동 사용 여부
				isEnableMouserotate: true, // 마우스 회전 사용 여부
				isEnableMousezoom: true, // 마우스 줌 사용 여부
				isEnableMousemoveByMousezoom: true, // 마우스 확대 시, 이동 여부
				
				// 판단
				isDraged: false, // 현재 드래그 여부
				
				button: null, // 누르고 있는 버튼
				downPageXy: new SmartGeoKit2D.Vector2(), // 다운 당시 page 좌표
				beforePageXy: new SmartGeoKit2D.Vector2(), // 이전 page 좌표
				downXy: new SmartGeoKit2D.Vector2(), // 버튼을 눌렀을 당시 좌표
				beforeCameraRotation: { x: 0, y: 0 }, // 회전 전 카메라 회전값
				
				isReverseButton: false, // 버튼 맵핑 반대 여부
				
			};
		
		// 선택 상자
		var selectBox = (function createSelectBox(){
				var sb = sgk2d.addRectangle("SGK2D.selectBox");
				sb.fillStyle = "rgba( 255, 0, 0, 0.2 )";
				sb.strokeStyle = "#ff0000";
				sb.lineWidth = 1;
				sb.zIndex = 99999;
				sb.isScan = false;
				sgk2d.scene.remove( sb );
				return sb;
		})();
		
		// 이벤트 추가
		sgk2d.event.mousedown = {}; // 다운 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mouseup = {}; // 업 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mousemove = {}; // 이동 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.click = {}; // 클릭 완료 시점 ( Event, x좌표, y좌표 )
		sgk2d.event.mousearea = {}; // 왼쪽 버튼 드래그 완료 시점 ( Event, minX, minY, maxX, maxY ) 
		sgk2d.event.mousewheel = {}; // 이동 시점 ( Event, "ZOOM_IN" || "ZOOM_OUT", 카메라줌 )
		sgk2d.event.mouseenter = {}; // 마우스 들어오기 ( Event )
		sgk2d.event.mouseleave = {}; // 마우스 나가기 ( Event )
		
		/**
			확대, 축소, 이동 관련 마우스 이벤트 등록
		 **/
		var DownAction = {
				"0": function showSelector( e ){
					selectBox.scale.set( 0, 0 );
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

					sgk2d.scene.add( selectBox );
					
					var csdX = sgk2d.scene.CSD.x;
					var csdY = -1 * sgk2d.scene.CSD.y;
					var dragXy = sgk2d.getMouseXy();
					
					var tM = sgk2d.camera.position.getTranslateMatrix3();
					var itM = tM.getInverseMatrix3();
					
					var rM = sgk2d.camera.rotation.getRotateMatrix3();
					var irM = rM.getInverseMatrix3();
					
					var width = dragXy.x - sgk2d.mouseControl.downXy.x;
					var height = dragXy.y - sgk2d.mouseControl.downXy.y;
					
					selectBox.position.x = sgk2d.mouseControl.downXy.x + width / 2;
					selectBox.position.y = sgk2d.mouseControl.downXy.y + height / 2;
					selectBox.scale.x = width;
					selectBox.scale.y = height;
					
				},
				"1": function rotate( e ){

					if( sgk2d.mouseControl.isEnableMouserotate === false ){
						return;
					}
					
					var centerX = sgk2d.renderer.canvas.width / 2;
					var centerY = sgk2d.renderer.canvas.height / 2;
					
					var downWidth = centerX - sgk2d.mouseControl.downPageXy.x + sgk2d.renderer.canvas.offsetLeft;
					var downHeight = centerY - sgk2d.mouseControl.downPageXy.y + sgk2d.renderer.canvas.offsetTop;
					
					var dragWidth = centerX - e.pageX + sgk2d.renderer.canvas.offsetLeft;
					var dragHeight = centerY - e.pageY + sgk2d.renderer.canvas.offsetTop;
					
					var downRadians = Math.atan2( downHeight, downWidth );
					var dragRadians = Math.atan2( dragHeight, dragWidth );
					var radians = dragRadians - downRadians;

					sgk2d.camera.rotation.x = sgk2d.mouseControl.beforeCameraRotation.x - radians;
					sgk2d.camera.rotation.y = sgk2d.mouseControl.beforeCameraRotation.y - radians;
					
				},
				"2": function translate( e ){
					
					if( sgk2d.mouseControl.isEnableMousemove === false ){
						return;
					}
					
					var moveX = sgk2d.mouseControl.beforePageXy.x - e.pageX;
					var moveY = sgk2d.mouseControl.beforePageXy.y - e.pageY;
					
					var vector2 = new SmartGeoKit2D.Vector2( moveX, moveY );
					var rM = sgk2d.camera.rotation.getRotateMatrix3();
					vector2.multiplyMatrix3( rM );
					
					sgk2d.camera.position.x += sgk2d.scene.CSD.x * vector2.x / sgk2d.camera.scale.x;
					sgk2d.camera.position.y += -sgk2d.scene.CSD.y * vector2.y / sgk2d.camera.scale.y;
					
				}
			};
		
		function onMousedown( e ){
			
			if( sgk2d.mouseControl.isEnable === false ){
				return;
			}
			
			e.preventDefault();
			if( sgk2d.mouseControl.isReverseButton === true ){
				e = changeButtonEvent( e );
			}
			
			var downXy = sgk2d.getMouseXy();
			sgk2d.mouseControl.button = e.button;
			
			// 버튼 별 동작 처리
			DownAction[ e.button ]( e );
			
			sgk2d.mouseControl.downXy.x = downXy.x;
			sgk2d.mouseControl.downXy.y = downXy.y;
			
			sgk2d.mouseControl.beforePageXy.x = e.pageX;
			sgk2d.mouseControl.beforePageXy.y = e.pageY;

			sgk2d.mouseControl.downPageXy.x = e.pageX;
			sgk2d.mouseControl.downPageXy.y = e.pageY;
			
			sgk2d.event.executeCallback( "mousedown", e, downXy.x, downXy.y );
			
		}
		function onMousemove( e ){
			
			if( sgk2d.mouseControl.isEnable === false ){
				return;
			}
			
			e.preventDefault();
			if( sgk2d.mouseControl.isReverseButton === true ){
				e = changeButtonEvent( e );
			}
			
			if( sgk2d.mouseControl.button != null ){
				
				var isDragX = Math.abs( sgk2d.mouseControl.downPageXy.x - e.pageX ) > 1;
				var isDragY = Math.abs( sgk2d.mouseControl.downPageXy.y - e.pageY ) > 1;
				
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
			
			if( sgk2d.mouseControl.isEnable === false ){
				return;
			}
			
			e.preventDefault();
			if( sgk2d.mouseControl.isReverseButton === true ){
				e = changeButtonEvent( e );
			}
			
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
				sgk2d.event.executeCallback( "mouseup", e, upXy.x, upXy.y );
				sgk2d.event.executeCallback( "click", e, upXy.x, upXy.y );
			}
			
			// 마우스 객체 초기화
			sgk2d.mouseControl.isDraged = false;
			sgk2d.mouseControl.button = null;
		}
		function onMousewheel( e ){
			
			if( sgk2d.mouseControl.isEnable === false ){
				return;
			}

			if( sgk2d.mouseControl.isEnableMousezoom === false ){
				return;
			}
			
			e.preventDefault();
			
			var beforeMouseXy = sgk2d.getMouseXy();
			function move(){
					
				if( sgk2d.mouseControl.isEnableMousemoveByMousezoom === false ){
					return;
				}
				
				var cameraXy = sgk2d.getCameraXy();
				var mouseXy = sgk2d.getMouseXy();
				
				var moveX = cameraXy.x - ( mouseXy.x - beforeMouseXy.x );
				var moveY = cameraXy.y - ( mouseXy.y - beforeMouseXy.y );
				
				sgk2d.moveCamera( moveX, moveY );
			}
			
			if( e.wheelDelta > 0 ){
				sgk2d.zoomInCamera();
				move();
				sgk2d.event.executeCallback( "mousewheel", e, "ZOOM_IN", sgk2d.camera.scale.x );
				return;
			}
			sgk2d.zoomOutCamera();
			move();
			sgk2d.event.executeCallback( "mousewheel", e, "ZOOM_OUT", sgk2d.camera.scale.x );
		}
		function onContextmenu( e ){
			e.preventDefault();
		}
		function onMouseenter( e ){
			e.preventDefault();
			if( sgk2d.mouseControl.isReverseButton === true ){
				e = changeButtonEvent( e );
			}
			sgk2d.event.executeCallback( "mouseenter", e );
		}
		function onMouseleave( e ){
			e.preventDefault();
			if( sgk2d.mouseControl.isReverseButton === true ){
				e = changeButtonEvent( e );
			}
			sgk2d.event.executeCallback( "mouseleave", e );
		}
		
		
		sgk2d.renderer.container.addEventListener("mouseenter", onMouseenter);
		sgk2d.renderer.container.addEventListener("mouseleave", onMouseleave);
		sgk2d.renderer.container.addEventListener("mousedown", onMousedown);
		sgk2d.renderer.container.addEventListener("mousemove", onMousemove);
		sgk2d.renderer.container.addEventListener("mouseup", onMouseup);
		sgk2d.renderer.container.addEventListener("mousewheel", onMousewheel);
		sgk2d.renderer.container.addEventListener("contextmenu", onContextmenu);
		
	}
	
	for( var key in sgk2dCreator ){
		SmartGeoKit2D[key] = sgk2dCreator[ key ];
	}
	
	SmartGeoKit2D.prototype = Object.create( sgk2dCreator.prototype );
	SmartGeoKit2D.prototype.constructor = SmartGeoKit2D;
	SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.MouseControl" );
	SmartGeoKit2D.prototype.enableMouseControl = function sgk2d_enableMouseControl(){
		this.mouseControl.isEnable = true;
	};
	SmartGeoKit2D.prototype.disableMouseControl = function sgk2d_disableMouseControl(){
		this.mouseControl.isEnable = false;
	};
	SmartGeoKit2D.prototype.getMouseXy = function sgk2d_getMouseXy( _addX, _addY ){
		
		var sgk2d = this;
		
		var addX = _addX || 0;
		var addY = _addY || 0;
		
		var canvasWidth = sgk2d.renderer.canvas.width;
		var canvasHeight = sgk2d.renderer.canvas.height;

		var scaleX = sgk2d.camera.scale.x;
		var scaleY = sgk2d.camera.scale.y;
		
		var positionX = sgk2d.camera.position.x;
		var positionY = sgk2d.camera.position.y;
		
		var pointerX = sgk2d.mouseControl.beforePageXy.x + addX - sgk2d.renderer.boundingClientRect.left;
		var pointerY = sgk2d.mouseControl.beforePageXy.y + addY - sgk2d.renderer.boundingClientRect.top;

		var csdX = sgk2d.scene.CSD.x;
		var csdY = -1 * sgk2d.scene.CSD.y;
		
		var centerX = pointerX - canvasWidth / 2;
		var centerY = pointerY - canvasHeight / 2;
		
		
		var sX = centerX / scaleX;
		var sY = centerY / scaleY;

		var vector2 = new SmartGeoKit2D.Vector2( sX, sY );
		
		var rM = sgk2d.camera.rotation.getRotateMatrix3();
		vector2.multiplyMatrix3( rM );
		
		var tX = vector2.x + csdX * positionX;
		var tY = vector2.y + csdY * positionY;
		
		return new SmartGeoKit2D.Vector2( csdX * tX, csdY * tY );
		
	};
	
	SmartGeoKit2D.prototype.setNormalButton = function sgk2d_normalButtonMapping(){
		this.mouseControl.isReverseButton = false;
		return true;
	};
	SmartGeoKit2D.prototype.setReverseButton = function sgk2d_reverseButtonMapping(){
		this.mouseControl.isReverseButton = true;
		return true;
	};
	SmartGeoKit2D.prototype.enableMousearea = function sgk2d_enableMousearea(){
		this.mouseControl.isEnableMousearea = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMousearea = function sgk2d_disableMousearea(){
		this.mouseControl.isEnableMousearea = false;
		return true;
	};
	
	SmartGeoKit2D.prototype.enableMousemove = function sgk2d_enableMousemove(){
		this.mouseControl.isEnableMousemove = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMousemove = function sgk2d_disableMousemove(){
		this.mouseControl.isEnableMousemove = false;
		return true;
	};
	
	SmartGeoKit2D.prototype.enableMouserotate = function sgk2d_enableMouserotate(){
		this.mouseControl.isEnableMouserotate = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMouserotate = function sgk2d_disableMouserotate(){
		this.mouseControl.isEnableMouserotate = false;
		return true;
	};
	
	SmartGeoKit2D.prototype.enableMousezoom = function sgk2d_enableMousezoom(){
		this.mouseControl.isEnableMousezoom = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMousezoom = function sgk2d_disableMousezoom(){
		this.mouseControl.isEnableMousezoom = false;
		return true;
	};
	SmartGeoKit2D.prototype.enableMousemoveByMousezoom = function sgk2d_enableMousemoveByMousezoom(){
		this.mouseControl.isEnableMousemoveByMousezoom = true;
		return true;
	};
	SmartGeoKit2D.prototype.disableMousemoveByMousezoom = function sgk2d_disableMousemoveByMousezoom(){
		this.mouseControl.isEnableMousemoveByMousezoom = false;
		return true;
	};
	window.SmartGeoKit2D = SmartGeoKit2D;
	
	
})();