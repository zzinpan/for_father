/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Chair = function sgk2d_chair( id ){
	SmartGeoKit2D.Shape.call( this, id );
};
SmartGeoKit2D.Chair.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Chair.prototype.constructor = SmartGeoKit2D.Chair;
SmartGeoKit2D.Chair.prototype.isChair = true;
SmartGeoKit2D.Chair.prototype.selectRange = {
		x: [ -1.5 /6, -1.5 /6, 1.5 /6, 1.5 /6, -1.5 /6 ],
		y: [ -1.25 /6, 1.25 /6, 1.25 /6, -1.25 /6, -1.25 /6 ]
};
SmartGeoKit2D.Chair.prototype.drawn = function sgk2d_chair_drawn( ctx, csdX, csdY ){
	this.applyPaint( ctx );
	var Math = SmartGeoKit2D.Math;
	
	ctx.save();
	ctx.scale( 1/6, 1/6 );
	
	// 몸
	ctx.beginPath();
	
	// 좌상
	ctx.moveTo( -1, 0 );
	ctx.lineTo( -1, -0.65 );
	ctx.arc( -0.9, -0.65, 0.1, Math.PI, Math.PI * 3 / 2 );
	
	// 우상
	ctx.lineTo( 0.9, -0.75 );
	ctx.arc( 0.9, -0.65, 0.1, Math.PI * 3 / 2, Math.PI * 2 );
	
	// 우하
	ctx.lineTo( 1, 1.15 );
	ctx.arc( 0.9, 1.15, 0.1, 0, Math.PI / 2 );
	
	// 좌하
	ctx.lineTo( -0.9, 1.25 );
	ctx.arc( -0.9, 1.15, 0.1, Math.PI / 2, Math.PI );
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	// 좌우
	ctx.fillRect( -1.5, -0.75, 0.4, 1.6 );
	ctx.beginPath();
	ctx.arc( -1.3, 1.05, 0.2, 0, Math.PI * 2 );
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.fillRect( 1.1, -0.75, 0.4, 1.6 );
	ctx.beginPath(); 
	ctx.arc( 1.3, 1.05, 0.2, 0, Math.PI * 2 );
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.fillRect( -1, -1.25, 2, 0.4 );
	ctx.restore();
	
};

/**
	API 확장
 **/
SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.Chair" );
SmartGeoKit2D.prototype.addChair = function sgk2d_addChair( id, parentId ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var chair = new SmartGeoKit2D.Chair( id );
	var parentGroup = this.getObjectById( parentId ) || this.scene;
	parentGroup.add( chair );
	return chair;
};