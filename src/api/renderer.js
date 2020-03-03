/**
	엔진 렌더링 가동
**/
SmartGeoKit2D.prototype.run = function sgk2d_run(){
	var sgk2d = this;
	(function run(){
		sgk2d.event.executeCallback( "beforeRender" );
		sgk2d.RAF.rendering = requestAnimationFrame( run );
		sgk2d.renderer.render( sgk2d.camera, sgk2d.scene );
		sgk2d.event.executeCallback( "afterRender" );
	})();
};

/**
	엔진 렌더링 정지
**/
SmartGeoKit2D.prototype.stop = function sgk2d_stop(){
	cancelAnimationFrame( this.RAF.rendering );
	this.RAF.rendering = null;
};

/**
	엔진 좌표계 설정
 **/
SmartGeoKit2D.prototype.setCSD = function sgk2d_setCSD( quadrant ){
	
	var x = null;
	var y = null;

	var fnAlignLeftObjects = SmartGeoKit2D.prototype.alignLeftObjects;
	var fnAlignRightObjects = SmartGeoKit2D.prototype.alignRightObjects;
	var fnAlignTopObjects = SmartGeoKit2D.prototype.alignTopObjects;
	var fnAlignBottomObjects = SmartGeoKit2D.prototype.alignBottomObjects;
	
	switch( quadrant ){
		case 1:
			x =  1;
			y =  1;
			
			this.alignLeftObjects = fnAlignLeftObjects;
			this.alignRightObjects = fnAlignRightObjects;
			this.alignTopObjects = fnAlignTopObjects;
			this.alignBottomObjects = fnAlignBottomObjects;
			break;
		case 2:
			x = -1;
			y =  1;
			
			this.alignLeftObjects = fnAlignRightObjects;
			this.alignRightObjects = fnAlignLeftObjects;
			this.alignTopObjects = fnAlignTopObjects;
			this.alignBottomObjects = fnAlignBottomObjects;
			break;
		case 3:
			x = -1;
			y = -1;
			
			this.alignLeftObjects = fnAlignRightObjects;
			this.alignRightObjects = fnAlignLeftObjects;
			this.alignTopObjects = fnAlignBottomObjects;
			this.alignBottomObjects = fnAlignTopObjects;
			break;
		case 4:
			x =  1;
			y = -1;
			
			this.alignLeftObjects = fnAlignLeftObjects;
			this.alignRightObjects = fnAlignRightObjects;
			this.alignTopObjects = fnAlignBottomObjects;
			this.alignBottomObjects = fnAlignTopObjects;
			break;
		default:
			return false;
	}
	
	this.scene.setCSD( x, y );
	return true;
	
};

/**
	배경 색 변경
 **/
SmartGeoKit2D.prototype.setBackgroundColor = function sgk2d_setBackgroundColor( color ){
	this.renderer.canvas.style.backgroundColor = color;
};

/**
	배경 이미지 변경
 **/
SmartGeoKit2D.prototype.setBackgroundImage = function sgk2d_setBackgroundImage( image ){
	this.renderer.canvas.style.backgroundImage = image;
};

/**
	화면 크기 재조정
**/
SmartGeoKit2D.prototype.resize = function sgk2d_resize(){
	
	var beforeWidth = this.renderer.canvas.width;
	var beforeHeight = this.renderer.canvas.height;
	this.renderer.resize();
	
	var afterWidth = this.renderer.canvas.width;
	var afterHeight = this.renderer.canvas.height;
	
	// 변경 감지시, 리사이즈 콜백
	if( beforeWidth != afterWidth || beforeHeight != afterHeight ){
		this.event.executeCallback( "resize", afterWidth, afterHeight );
	}
	
};

/**
	이미지 데이터 출력
	sx,sy,ex,ey가 지정된 경우: 특정 영역을 이미지 데이터 출력
	sx,sy,ex,ey가 지정되지 않은 경우: 현재 화면을 이미지 데이터 출력
**/
SmartGeoKit2D.prototype.toDataURL = function( sx, sy, ex, ey ){
	
	if( sx == null || sy == null || ex == null || ey == null ){
		return this.renderer.canvas.toDataURL();
	}
	
	var tempCanvas = document.createElement("canvas");
	
	tempCanvas.width = Math.abs( ex - sx );
	tempCanvas.height = Math.abs( ey - sy );
	
	
	var originalCanvas = this.renderer.canvas;
	var originalCtx = this.renderer.ctx;
	
	this.renderer.canvas = tempCanvas;
	this.renderer.ctx = tempCanvas.getContext("2d");
	
	var tempCamera = new SmartGeoKit2D.Camera("tempCamera");
	tempCamera.position.set( ( sx + ex ) / 2, ( sy + ey ) / 2 );
	this.renderer.render( tempCamera, this.scene );
	
	var dataURL = this.renderer.canvas.toDataURL();
	
	this.renderer.canvas = originalCanvas;
	this.renderer.ctx = originalCtx;
	
	return dataURL;
	
};

/**
	이미지 다운로드
	sx,sy,ex,ey가 지정된 경우: 특정 영역을 이미지로 저장
	sx,sy,ex,ey가 지정되지 않은 경우: 현재 화면을 이미지로 저장
 **/
SmartGeoKit2D.prototype.downloadImage = function sgk2d_downloadImage( imageName, sx, sy, ex, ey ){
	
	if( sx == null || sy == null || ex == null || ey == null ){
		this.renderer.downloadImage( imageName );
		return;
	}
	
	var tempCanvas = document.createElement("canvas");
	
	tempCanvas.width = Math.abs( ex - sx );
	tempCanvas.height = Math.abs( ey - sy );
	
	
	var originalCanvas = this.renderer.canvas;
	var originalCtx = this.renderer.ctx;
	
	this.renderer.canvas = tempCanvas;
	this.renderer.ctx = tempCanvas.getContext("2d");
	
	var tempCamera = new SmartGeoKit2D.Camera("tempCamera");
	tempCamera.position.set( ( sx + ex ) / 2, ( sy + ey ) / 2 );
	this.renderer.render( tempCamera, this.scene );
	this.renderer.downloadImage( imageName );
	
	this.renderer.canvas = originalCanvas;
	this.renderer.ctx = originalCtx;
	
	//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	
};
