/**
	이동
**/
SmartGeoKit2D.prototype.moveCamera = function sgk2d_moveCamera( x, y ){
	if( typeof x != "number" ){
	return false;
	}
	if( typeof y != "number" ){
	return false;
	}
	this.camera.position.x = x;
	this.camera.position.y = y;
	return true;
};

/**
	회전
**/
SmartGeoKit2D.prototype.rotateCamera = function sgk2d_rotateCamera( angle, isDegree ){

	if( typeof angle !== "number" ){
		return false;
	}
	
	if( typeof isDegree != "boolean" ){
		isDegree = true;
	}
	
	if( isDegree === true ){
		angle = SmartGeoKit2D.Math.radians( angle );
	}
	this.camera.rotation.x = angle;
	this.camera.rotation.y = angle;
	return true;
};

/**
	확대
 **/
SmartGeoKit2D.prototype.zoomInCamera = function sgk2d_zoomIn(){
	var magnification = this.ENV.camera.zoomMagnification;
	this.camera.scale.x *= magnification;
	this.camera.scale.y *= magnification;
	return true;
};

/**
	축소
 **/
SmartGeoKit2D.prototype.zoomOutCamera = function sgk2d_zoomOut(){
	var magnification = this.ENV.camera.zoomMagnification;
	this.camera.scale.x /= magnification;
	this.camera.scale.y /= magnification;
	return true;
};

/**
	줌 설정
**/
SmartGeoKit2D.prototype.setZoomCamera = function sgk2d_setZoom( zoom ){
	
	if( typeof zoom != "number" ){
		return false;
	}
	
	if( zoom <= 0 ){
		return false;
	}
	
	this.camera.scale.set( zoom, zoom );
	return true;
};

/**
	확대 배율 변경
**/
SmartGeoKit2D.prototype.setZoomMagnification = function sgk2d_setZoomMagnification( magnification ){

	if( typeof magnification != "number" ){
		return false;
	}
	
	if( magnification <= 0 ){
		return false;
	}
	
	this.ENV.camera.zoomMagnification = magnification;
	return true;
};

/**
	보이고 있는 영역 조회
 **/
SmartGeoKit2D.prototype.getCameraBoundary = function sgk2d_getCameraViewSize(){
	
	var canvasWidth = this.renderer.canvas.width;
	var canvasHeight = this.renderer.canvas.height;
	
	var boundary = {
		"LEFT_TOP": new SmartGeoKit2D.Vector2( -canvasWidth/2, canvasHeight/2 ),
		"RIGHT_TOP": new SmartGeoKit2D.Vector2( canvasWidth/2, canvasHeight/2 ),
		"LEFT_BOTTOM": new SmartGeoKit2D.Vector2( -canvasWidth/2, -canvasHeight/2 ),
		"RIGHT_BOTTOM": new SmartGeoKit2D.Vector2( canvasWidth/2, -canvasHeight/2 )	
	};
		

	var tM = this.camera.position.getTranslateMatrix3();
	var rM = this.camera.rotation.getRotateMatrix3().getInverseMatrix3();
	var sM = this.camera.scale.getScaleMatrix3().getInverseMatrix3();
	
	for( var pos in boundary ){
		var point = boundary[ pos ];
		point.multiplyMatrix3( sM );
		point.multiplyMatrix3( rM );
		point.multiplyMatrix3( tM );
	}
	
	return boundary;
	
};


/**
	중심 위치 조회
 **/
SmartGeoKit2D.prototype.getCameraXy = function dsgk2d_getCenterXy(){
	return new SmartGeoKit2D.Vector2( this.camera.position.x, this.camera.position.y );
};

/**
	중심 위치 조회
**/
SmartGeoKit2D.prototype.getCameraPosition = SmartGeoKit2D.prototype.getCameraXy;
/**
	회전 값 조회
**/
SmartGeoKit2D.prototype.getCameraRotation = function dsgk2d_getCameraRotation(){
	return new SmartGeoKit2D.Vector2( this.camera.rotation.x, this.camera.rotation.y );
};
/**
	@TODO API 문서 작업 필요
**/
SmartGeoKit2D.prototype.getCameraZoom = function dsgk2d_getCameraZoom(){
	return this.camera.scale.x;
};