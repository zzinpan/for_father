/**
	abstract class
 **/
SmartGeoKit2D.Renderer = function sgk2d_renderer( id, selector ){
	
	// 디버거
	var Debugger = SmartGeoKit2D.Debugger;
	Debugger.assert( id == null, {
		"arguments": id,
		"msg": "0번째 인자값이 잘못되었습니다. ( 필요값: string )"
	} );
	Debugger.assert( selector == null, {
		"arguments": selector,
		"msg": "1번째 인자값이 잘못되었습니다. ( 필요값: string )"
	} );
	
	var element = document.querySelector( selector );
	Debugger.assert( element == null, {
		"selector": selector,
		"msg": "1번째 인자값에 해당되는 요소가 없습니다."
	} );

	// 아이디
	this.id = id;
	
	// 컨테이너
	this.container = element;
	
	// 도화지
	this.canvas = document.createElement("canvas");
	this.container.appendChild( this.canvas );
	this.resize();
	
	// 도구
	this.ctx = this.canvas.getContext("2d");
//	this.ctx.imageSmoothingEnabled = false;
//	this.ctx.mozImageSmoothingEnabled = false;
//	this.ctx.webkitImageSmoothingEnabled = false;
//	this.ctx.msImageSmoothingEnabled = false;
	
};
SmartGeoKit2D.Renderer.prototype.isRenderer = true;
/**
	렌더
 **/
SmartGeoKit2D.Renderer.prototype.render = function sgk2d_renderer_render( camera, scene ){

	var canvas = this.canvas;
	var ctx = this.ctx;
	
	var csdX = 1 * scene.CSD.x;
	var csdY = -1 * scene.CSD.y;
	
	ctx.clearRect( 0,0, canvas.width, canvas.height );
	ctx.save();
	
	ctx.scale( csdX, csdY );
	
	// 카메라 좌표 / 줌 / 회전 적용
	
	// 중심으로 이동
	ctx.translate( csdX * canvas.width / 2, csdY * canvas.height / 2 );

	// 중심 기준 회전
	ctx.rotate( camera.rotation.x, camera.rotation.y );

	// 중심 기준 확대
	ctx.scale( camera.scale.x, camera.scale.y );
	
	// 카메라 이동
	ctx.translate( -camera.position.x, -camera.position.y );
	
	var childrens = scene.children;
	for( var i=0; i<childrens.length; ++i ){
		childrens[ i ].traverse( function( object2d ){
			
			ctx.save();
			ctx.translate( object2d.position.x, object2d.position.y );
			ctx.rotate( object2d.rotation.x, object2d.rotation.y );
			ctx.scale( object2d.scale.x, object2d.scale.y );
			if( object2d.isGroup === true ){
				ctx.translate( -object2d.pivot.x, -object2d.pivot.y );
			}
			ctx.save();
			ctx.scale( csdX, csdY );
			if( object2d.isShape === true ){
				ctx.globalAlpha = object2d.opacity;
				object2d.drawn( ctx, camera.scale.x, csdX, csdY );
			}
			ctx.restore();
			
		}, function( object2d ){
			ctx.restore();
		});
	}
	
	ctx.restore();
	
};
/**
	렌더러 사이즈를 컨테이너 크기와 동일하게 조정
 **/
SmartGeoKit2D.Renderer.prototype.resize = function sgk2d_renderer_resize(){
	
	// 현재 컨테이너 크기 조회
	var rect = this.container.getBoundingClientRect();
	var pl = parseFloat( this.container.style.paddingLeft );
	var pr = parseFloat( this.container.style.paddingRight );
	var pb = parseFloat( this.container.style.paddingBottom );
	var pt = parseFloat( this.container.style.paddingTop );
	
	if( isNaN( pl ) === false ){
		rect.width -= pl;
	}
	if( isNaN( pr ) === false ){
		rect.width -= pr;
	}
	if( isNaN( pb ) === false ){
		rect.height -= pb;
	}
	if( isNaN( pt ) === false ){
		rect.height -= pt;
	}
	this.canvas.width = rect.width;
	this.canvas.height = rect.height;
	this.boundingClientRect = rect;
	
};

/**
 	이미지 다운로드 기능
 **/
SmartGeoKit2D.Renderer.prototype.downloadImage = function sgk2d_renderer_downloadImage( imageName ){
	
	/**
	 * https://www.npmjs.com/package/download-canvas
	 */
	canvasToImage( this.canvas , {
		name: imageName,
		type: 'png',
		quality: 1
	});
};