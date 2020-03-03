(function extend_control(){
	
	var sgk2dCreator = window.SmartGeoKit2D;
	var Math = sgk2dCreator.Math;
	
	
	/**
	 * 핸들 정보
	 */
	var edgeSize = 8;
	var edgeFillStyle = "#616161";
	var edgeStrokeStyle = "#616161";
	
	
	var rotateImage = (function makeRotateArrowImage(){
		
		// size: 540 x 540
		var canvas = document.createElement("canvas");
		canvas.width = 60;
		canvas.height = 60;
		var ctx = canvas.getContext("2d");
		
		ctx.fillStyle = edgeFillStyle;
		
		ctx.translate( 35, 30 );
		ctx.scale( -1, 1 );
		
		ctx.beginPath();
		ctx.arc( 0, 0, 25, 0, Math.PI * 2 );
		ctx.closePath();
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc( 0, 0, 15, 0, Math.PI * 2 );
		ctx.closePath();
		
		ctx.save();
			ctx.clip();
			ctx.clearRect( -25, -25, 50, 50 );
		ctx.restore();
		
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.arc( 0, 0, 26, 0, 90 * Math.PI / 180 );
		ctx.lineTo( 0, 0 );
		ctx.closePath();
		
		ctx.save();
			ctx.clip();
			ctx.clearRect( 0, 0, 50, 50 );
		ctx.restore();

		ctx.translate( 25 - 5, 0 );
		ctx.beginPath();
		ctx.moveTo( 0,0 );
		ctx.lineTo( -15,0 );
		ctx.lineTo( 0, 20 );
		ctx.lineTo( 15,0 );
		ctx.closePath();
		ctx.fill();

		return canvas;
		
	})();
	
	function SmartGeoKit2D(){
		
		var sgk2d = this;
		sgk2dCreator.apply( sgk2d, arguments );
		sgk2d.RAF.selector = {
				// rafId
		};
		sgk2d.selectList = {
				/*
				id: {
					object2d: SmartGeoKit2D.Object2D,
					handle: SmartGeoKit2D.Object
				}
				*/
		};
		sgk2d.selectOption = {
				enableRotate: true,
				enableTranslate: true,
				enableScale: true,
				enableInnerShape: true,
				enableOuterShape: true
		};
	}
	
	for( var key in sgk2dCreator ){
		SmartGeoKit2D[key] = sgk2dCreator[ key ];
	}
	SmartGeoKit2D.prototype = Object.create( sgk2dCreator.prototype );
	SmartGeoKit2D.prototype.constructor = SmartGeoKit2D;
	SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.Selector" );
	
	/**
		객체 아이디로 핸들 조회
	 **/
	SmartGeoKit2D.prototype.getHandleById = function sg2d_getHandleById( id ){
		var sgk2d = this;
		var selectInfo = sgk2d.selectList[ id ];
		if( selectInfo == null ){
			return null;
		}
		return selectInfo.handle;
	};
	/**
		객체 선택
	 **/
	SmartGeoKit2D.prototype.selectObject = function sg2d_selectObject( object2d ){
		
		var id = object2d.id;
		
		var sgk2d = this;
		
		if( sgk2d.selectList[ id ] != null ){
			return false;
		}
		
		var csdX = 1 * sgk2d.scene.CSD.x;
		var csdY = -1 * sgk2d.scene.CSD.y;
		
		var arrs = SmartGeoKit2D.Util.getObjectWorldSelectRangeWithOutRotation( object2d );
		var selectRangeAllX = arrs.xArr;
		var selectRangeAllY = arrs.yArr;

		var minX = csdX * Math.min.apply( null, selectRangeAllX );
		var minY = csdY * Math.min.apply( null, selectRangeAllY );
		var maxX = csdX * Math.max.apply( null, selectRangeAllX );
		var maxY = csdY * Math.max.apply( null, selectRangeAllY );
		var width = Math.abs( maxX - minX );
		var height = Math.abs( maxY - minY );
		var maxWH = Math.max( width, height );
		var minWH = Math.min( width, height );
		
		var handleBasicType = "PANEL";
		if( sgk2d.selectOption.enableTranslate === false ){
			handleBasicType = "PANEL_NO_MOVE";
		}
		
		// 그룹
		var handle = (function createHandle(){
			var handle = sgk2d.addGroup( "SGK2D.handle:" + id );
			handle.position = object2d.position;
			handle.rotation = object2d.rotation;
			handle.scale.x = width * object2d.handleScale.x;
			handle.scale.y = height * object2d.handleScale.y;
//			handle.scale = object2d.scale;
//			handle.position.x = object2d.position.x;
//			handle.position.y = object2d.position.y;
//			handle.rotation.x = object2d.rotation.x;
//			handle.rotation.y = object2d.rotation.y;
			handle.zIndex = object2d.zIndex;
			handle.handleType = handleBasicType;
			handle.isHandle = true;
			handle.selectTarget = object2d;
			return handle;
			
		})();
		
		sgk2d.selectList[ id ] = {
				object2d: object2d,
				handle: handle
		};
		
		if( object2d.isPolyline === true || object2d.isLine === true || object2d.isPolygon === true ){
			
			(function(){
				if( sgk2d.selectOption.enableOuterShape == false ){
					return true;
				}
				for( var i=0; i<object2d.path.length; ++i ){
					var edge = sgk2d.addCircle( "SGK2D.handleEdgePoint:" + id + "_" + i );
					handle.add( edge );
					edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
					edge.position.x = object2d.calcPathX[i] / handle.scale.x * object2d.scale.x;
					edge.position.y = object2d.calcPathY[i] / handle.scale.y * object2d.scale.y;
					edge.fillStyle = "#76FF03";
					edge.isFixedSize = true;
					edge.handleType = "POINT";
					edge.handlePathIdx = i;
					edge.isHandle = true;
					edge.selectTarget = object2d;
					edge.zIndex = 12;
				}
				
			})();
			
		}
		
		if( sgk2d.selectOption.enableScale != false ){
			
			// LT
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeLT:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = -0.5;
				edge.position.y = 0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "LT";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.LT = edge;
			})();
			
			// RB
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeRB:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = 0.5;
				edge.position.y = -0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "RB";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.RB = edge;
			})();
			
			// panel
			(function createHandlePanel(){
				var panel = sgk2d.addRectangle( "SGK2D.handlePanel:" + id );
				handle.add( panel );
				panel.scale.x = 1;
				panel.scale.y = 1;
				panel.fillStyle = "rgba( 0,0,0,0 )";
				panel.isFixedLineWidth = true;
				panel.handleType = handleBasicType;
				panel.isHandle = true;
				panel.selectTarget = object2d;
				handle.panel = panel;
			})();
			
			// L
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeL:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = -0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "L";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.L = edge;
			})();
			
			// R
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeR:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = 0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "R";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.R = edge;
			})();
		
			// T
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeT:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.y = 0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "T";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.T = edge;
			})();
			
			// B
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeB:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.y = -0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "B";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.B = edge;
			})();
			
			// RT
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeRT:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = 0.5;
				edge.position.y = 0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "RT";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.RT = edge;
			})();
			
			// LB
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeLB:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
				edge.position.x = -0.5;
				edge.position.y = -0.5;
				edge.fillStyle = edgeFillStyle;
				edge.isFixedSize = true;
				edge.handleType = "LB";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				handle.LB = edge;
			})();
			
		}
		
		if( sgk2d.selectOption.enableRotate != false ){
		
			// 회전점
			(function createHandleEdge(){
				var edge = sgk2d.addRectangle( "SGK2D.handleEdgeRotate:" + id );
				handle.add( edge );
				edge.scale.set( edgeSize * 2 / handle.scale.x, edgeSize * 2 / handle.scale.y );
				edge.position.y = sgk2d.scene.CSD.y * 0.6;
				edge.fillStyle = "rgba(0,0,0,0)";
				edge.isFixedSize = true;
				edge.handleType = "ROTE";
				edge.isHandle = true;
				edge.selectTarget = object2d;
				edge.zIndex = 10;
				edge.image = rotateImage;
				handle.ROTE = edge;
			
				(function selectorRAF(){
					edge.position.y = sgk2d.scene.CSD.y * ( 0.5 + (  30 / handle.scale.y / sgk2d.camera.scale.x ) );
					sgk2d.RAF.selector[ "SGK2D.handleEdgeRotate:" + id ] = requestAnimationFrame( selectorRAF );
				})();
				
			})();
		}
		
		if( sgk2d.selectOption.enableInnerShape != false ){
			
			// 수정 가능한 핸들 x
			(function createHandleEdge(){
				for( var handleId in object2d.xHandles ){
					var xHandle = object2d.xHandles[ handleId ];
					var edge = sgk2d.addRhombus( "SGK2D.handleEdge" + handleId + ":" + id );
					
					var scale = Math.min( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
					
					handle.add( edge );
					edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
					edge.position.set( xHandle.x * sgk2d.scene.CSD.x, xHandle.y * sgk2d.scene.CSD.y );
					edge.fillStyle = "#FFC107";
					edge.isFixedSize = true;
					edge.handleType = "x";
					edge.isHandle = true;
					edge.selectTarget = object2d;
					edge.selectTargetPoint = xHandle;
					edge.zIndex = 13;
					
					
					handle[ handleId ] = edge;
				}
			})();
			
			(function createHandleEdge(){
				for( var handleId in object2d.yHandles ){
					var yHandle = object2d.yHandles[ handleId ];
					var edge = sgk2d.addRhombus( "SGK2D.handleEdge" + handleId + ":" + id );
					handle.add( edge );
					edge.scale.set( edgeSize / handle.scale.x, edgeSize / handle.scale.y );
					edge.position.set( yHandle.x * sgk2d.scene.CSD.x, yHandle.y * sgk2d.scene.CSD.y );
					edge.fillStyle = "#FFC107";
					edge.isFixedSize = true;
					edge.handleType = "y";
					edge.isHandle = true;
					edge.selectTarget = object2d;
					edge.selectTargetPoint = yHandle;
					edge.zIndex = 13;
					handle[ handleId ] = edge;
				}
			})();
			
		}
		
		return true;
		
	};
	
	/**
		선택 옵션
	**/
	SmartGeoKit2D.prototype.setSelectOption = function( options ){
		
		if( typeof options.enableRotate === "boolean" ){
			this.selectOption.enableRotate = options.enableRotate;
		}
		if( typeof options.enableTranslate === "boolean" ){
			this.selectOption.enableTranslate = options.enableTranslate;
		}
		if( typeof options.enableScale === "boolean" ){
			this.selectOption.enableScale = options.enableScale;
		}
		if( typeof options.enableInnerShape === "boolean" ){
			this.selectOption.enableInnerShape = options.enableInnerShape;
		}
		if( typeof options.enableOuterShape === "boolean" ){
			this.selectOption.enableOuterShape = options.enableOuterShape;
		}
		
	};
	
	/**
		선택된 객체 삭제
	 **/
	SmartGeoKit2D.prototype.removeObjectsByHandle = function sgk2d_removeObjectsByHandle(){
		for( var id in this.selectList ){
			var object = this.selectList[id].object2d;
			this.unSelectObject( object );
			this.removeObject( object );
		}
	};
	/**
		선택된 객체 조회
	 **/
	SmartGeoKit2D.prototype.getObjectsByHandle = function sgk2d_getObjectsByHandle(){
		var arr = [];
		for( var id in this.selectList ){
			arr.push( this.selectList[id].object2d );
		}
		return arr;
	};
	/**
		특정 객체 선택 해제
	 **/
	SmartGeoKit2D.prototype.unSelectObject = function sgk2d_unSelectObject( object2d ){
		var id = object2d.id;
		cancelAnimationFrame( this.RAF.selector[ "SGK2D.handleEdgeRotate:" + id ] );
		cancelAnimationFrame( this.RAF.selector[ "SGK2D.handleForLine:" + id ] );
		delete this.RAF.selector[ "SGK2D.handleEdgeRotate:" + id ];
		delete this.RAF.selector[ "SGK2D.handleForLine:" + id ];
		var handle = this.getObjectById( "SGK2D.handle:" + id );
		if( handle == null ){
			return false;
		}
		this.removeObject( handle );
		delete this.selectList[ id ];
	};
	/**
		모든 선택 객체 해제
	 **/
	SmartGeoKit2D.prototype.unSelectObjectAll = function sgk2d_unSelectObjectAll(){
		for( var id in this.selectList ){
			this.unSelectObject( this.selectList[id].object2d );
		}
	};
	/**
		선택 객체 색상 변경
	 **/
	SmartGeoKit2D.prototype.changeColorObjectsByHandle = function sgk2d_changeColorObjectsByHandle( color ){
		for( var id in this.selectList ){
			this.selectList[id].object2d.fillStyle = color;
		}
	};
	// 상대 이동
	SmartGeoKit2D.prototype.moveObjectsByHandle = function sgk2d_moveObjectByHandle( x, y ){
		for( var id in this.selectList ){
			this.selectList[ id ].object2d.position.x += x;
			this.selectList[ id ].object2d.position.y += y;
		}
	};

	// 상대 회전
	SmartGeoKit2D.prototype.rotateObjectsByHandle = function sgk2d_moveObjectByHandle( radians ){
		
		var PI2 = Math.PI * 2;
		
		for( var id in this.selectList ){
			var rotationVector = this.selectList[ id ].object2d.rotation;
			rotationVector.x += radians;
			rotationVector.y += radians;
			while( true ){
				if( rotationVector.x >= 0 ){
					break;
				}
				rotationVector.x += PI2;
			}
			while( true ){
				if( rotationVector.y >= 0 ){
					break;
				}
				rotationVector.y += PI2;
			}
			while( true ){
				if( rotationVector.x < PI2 ){
					break;
				}
				rotationVector.x -= PI2;
			}
			while( true ){
				if( rotationVector.y < PI2 ){
					break;
				}
				rotationVector.y -= PI2;
			}
		}
	};

	// 상대 크기L
	SmartGeoKit2D.prototype.scaleObjectsByHandleL = function sgk2d_scaleObjectsByHandleL( movedX ){
		
		
		var selectObjects = [];
		for( var id in this.selectList ){
			selectObjects.push( this.selectList[ id ].object2d );
		}
		
		this.unSelectObjectAll();
		for( var i=0; i<selectObjects.length; ++i ){
			var object = selectObjects[ i ];
			
			var arrs = SmartGeoKit2D.Util.getObjectSelectRange( object );
			var minX = Math.min.apply( null, arrs.xArr );
			var maxX = Math.max.apply( null, arrs.xArr );
			var bottomX = Math.abs( minX );
			var topX = Math.abs( maxX );
			var targetX = Math.max( bottomX, topX );
			var width = targetX*2;
			
			var vector2 = new SmartGeoKit2D.Vector2( -movedX/2, 0 );
			var rM = object.rotation.getRotateMatrix3();
			vector2.multiplyMatrix3( rM );
			
			if( object.scale.x + movedX/width > 0 ){
				object.scale.x += movedX/width;
				object.position.x += vector2.x;
				object.position.y += vector2.y;
			}
			
			this.selectObject( object );
			
		}
		
	};

	// 상대 크기R
	SmartGeoKit2D.prototype.scaleObjectsByHandleR = function sgk2d_scaleObjectsByHandleR( movedX ){
		
		var selectObjects = [];
		for( var id in this.selectList ){
			selectObjects.push( this.selectList[ id ].object2d );
		}
		
		this.unSelectObjectAll();
		for( var i=0; i<selectObjects.length; ++i ){
			var object = selectObjects[ i ];
			
			var arrs = SmartGeoKit2D.Util.getObjectSelectRange( object );
			var minX = Math.min.apply( null, arrs.xArr );
			var maxX = Math.max.apply( null, arrs.xArr );
			var bottomX = Math.abs( minX );
			var topX = Math.abs( maxX );
			var targetX = Math.max( bottomX, topX );
			var width = targetX*2;
			
			var vector2 = new SmartGeoKit2D.Vector2( movedX/2, 0 );
			var rM = object.rotation.getRotateMatrix3();
			vector2.multiplyMatrix3( rM );
			
			if( object.scale.x + movedX/width > 0 ){
				object.scale.x += movedX/width;
				object.position.x += vector2.x;
				object.position.y += vector2.y;
			}
			
			this.selectObject( object );
			
		}
		
	};
	
	// 상대 크기T
	SmartGeoKit2D.prototype.scaleObjectsByHandleT = function sgk2d_scaleObjectsByHandleT( movedY ){
		
		var selectObjects = [];
		for( var id in this.selectList ){
			selectObjects.push( this.selectList[ id ].object2d );
		}
		
		this.unSelectObjectAll();
		for( var i=0; i<selectObjects.length; ++i ){
			var object = selectObjects[ i ];
			
			var arrs = SmartGeoKit2D.Util.getObjectSelectRange( object );
			var minY = Math.min.apply( null, arrs.yArr );
			var maxY = Math.max.apply( null, arrs.yArr );
			var bottomY = Math.abs( minY );
			var topY = Math.abs( maxY );
			var targetY = Math.max( bottomY, topY );
			var height = targetY*2;
			
			var vector2 = new SmartGeoKit2D.Vector2( 0, movedY/2 );
			var rM = object.rotation.getRotateMatrix3();
			vector2.multiplyMatrix3( rM );
			
			if( object.scale.y + movedY/height > 0 ){
				object.scale.y += movedY/height;
				object.position.x += vector2.x;
				object.position.y += vector2.y;
			}
			
			this.selectObject( object );
			
		}
		
	};
	
	// 상대 크기B
	SmartGeoKit2D.prototype.scaleObjectsByHandleB = function sgk2d_scaleObjectsByHandleB( movedY ){
		
		var selectObjects = [];
		for( var id in this.selectList ){
			selectObjects.push( this.selectList[ id ].object2d );
		}
		
		this.unSelectObjectAll();
		for( var i=0; i<selectObjects.length; ++i ){
			var object = selectObjects[ i ];
			
			var arrs = SmartGeoKit2D.Util.getObjectSelectRange( object );
			var minY = Math.min.apply( null, arrs.yArr );
			var maxY = Math.max.apply( null, arrs.yArr );
			var bottomY = Math.abs( minY );
			var topY = Math.abs( maxY );
			var targetY = Math.max( bottomY, topY );
			var height = targetY*2;
			
			var vector2 = new SmartGeoKit2D.Vector2( 0, -movedY/2 );
			var rM = object.rotation.getRotateMatrix3();
			vector2.multiplyMatrix3( rM );
			
			
			if( object.scale.y + movedY/height > 0 ){
				object.scale.y += movedY/height;
				object.position.x += vector2.x;
				object.position.y += vector2.y;
			}
			
			this.selectObject( object );
			
		}
		
	};
	
	window.SmartGeoKit2D = SmartGeoKit2D;
	
	
})();