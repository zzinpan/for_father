/**
	extends SmartGeoKit2D.Object2D
	L형 책상
 **/
SmartGeoKit2D.DeskL = function sgk2d_deskL( id ){
	SmartGeoKit2D.Shape.call( this, id );
	
	/**
	 	상세 수치 조정 가능한 핸들
	 **/
	var horizontal = new SmartGeoKit2D.Vector2( 0, -0.5 );
	horizontal.minY = 0;
	horizontal.maxY = 0;
	horizontal.minX = -0.5;
	horizontal.maxX = 0.5;
	this.xHandles = {
		horizontal: horizontal
	};
	
	var vertical = new SmartGeoKit2D.Vector2( -0.5, 0 );
	vertical.minX = -0.5;
	vertical.maxX = -0.5;
	vertical.minY = -0.5;
	vertical.maxY = 0.5;
	this.yHandles = { 
		vertical: vertical
	};
	
	this.edgeStyle = "rgba(0,0,0,0)";
	
};
SmartGeoKit2D.DeskL.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.DeskL.prototype.constructor = SmartGeoKit2D.DeskL;
SmartGeoKit2D.DeskL.prototype.isDeskL = true;
SmartGeoKit2D.DeskL.prototype.selectRange = {
		x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
		y: [ -0.5, 0.5, 0.5, -0.5, -0.5 ]
};

SmartGeoKit2D.DeskL.prototype.drawn = function sgk2d_deskL_drawn( ctx, zoom, csdX, csdY ){
	
	/**
	 * 500 x 500 기준
	 * 책상 
	 * 	넓이 500
	 * 	높이 200
	 */
	
	this.applyPaint( ctx );
	var Math = SmartGeoKit2D.Math;
	
	ctx.strokeStyle = this.edgeStyle;
	ctx.beginPath();
	
	// 책상
	ctx.moveTo( -0.5, -0.5 );
	ctx.lineTo( -0.5, 0.5 );
	ctx.lineTo( 0.5, 0.5 );
	ctx.lineTo( 0.5, -this.yHandles.vertical.y );
	ctx.lineTo( this.xHandles.horizontal.x * csdX, -this.yHandles.vertical.y );
	ctx.lineTo( this.xHandles.horizontal.x * csdX, -0.5 );
	ctx.closePath();
	ctx.save();
	if( this.chairSize == null ){
		ctx.translate(  this.xHandles.horizontal.x * csdX + 0.3, -0.3-this.yHandles.vertical.y );
		ctx.rotate( Math.PI / 2 * 3, Math.PI / 2 * 3 );
		
		// 의자 시트
		ctx.rect( -0.18, -0.18, 0.36, 0.36 );
		
		// 등받이
		ctx.rect( -0.18, 0.2, 0.36, 0.02 );
		
		// 왼쪽 팔걸이
		ctx.rect( -0.2, -0.1, -0.06, 0.22 );
		
		// 오른쪽 팔걸이
		ctx.rect( 0.2, -0.1, 0.06, 0.22 );
	}else{
		
		ctx.translate( this.xHandles.horizontal.x * csdX, -this.yHandles.vertical.y );
		ctx.scale( 1/this.scale.x, 1/this.scale.y );
		
		// 의자
		ctx.rect( this.chairSize / 10, -this.chairSize - this.chairSize / 5, this.chairSize, this.chairSize );
		
//		// 의자 뒤
		ctx.rect( this.chairSize + this.chairSize / 7, -this.chairSize - this.chairSize / 5, this.chairSize / 10, this.chairSize );
//
		// 의자 오른쪽
		ctx.rect( this.chairSize / 3,  - this.chairSize / 6, this.chairSize / 1.5, this.chairSize / 8 );

		// 의자 왼쪽
		ctx.rect( this.chairSize / 3, - this.chairSize - this.chairSize / 5 - this.chairSize / 6, this.chairSize / 1.5, this.chairSize / 8 );
		
	}
	ctx.restore();
	ctx.stroke();
	if( this.fillStyle != null ){
		ctx.fill();
	}
	
	ctx.strokeStyle = this.strokeStyle;
	ctx.beginPath();
	ctx.rect( -0.5, -0.5, 1, 1 );
	ctx.closePath();
	ctx.stroke();
	
};

/**
	API 확장
**/
SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.DeskL" );
SmartGeoKit2D.prototype.addDeskL = function sgk2d_addDeskL( id, parentId ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var deskL = new SmartGeoKit2D.DeskL( id );
	var parentGroup = this.getObjectById( parentId ) || this.scene;
	parentGroup.add( deskL );
	return deskL;
};