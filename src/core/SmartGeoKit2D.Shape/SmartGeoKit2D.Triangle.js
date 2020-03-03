/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Triangle = function sgk2d_triangle( id ){
	SmartGeoKit2D.Shape.call( this, id );
};
SmartGeoKit2D.Triangle.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Triangle.prototype.constructor = SmartGeoKit2D.Triangle;
SmartGeoKit2D.Triangle.prototype.isTriangle = true;
SmartGeoKit2D.Triangle.prototype.selectRange = (function createSelectRange(){
	
	var Math = SmartGeoKit2D.Math;
	var y = Math.tan( Math.radians( 60 ) ) * 0.5;
	
	return {
			x: [ -0.5, 0, 0.5, -0.5 ],
			y: [ y/2, -y/2, y/2, y/2 ]
	};
	
})();
SmartGeoKit2D.Triangle.prototype.drawn = function sgk2d_triangle_drawn( ctx, csdX, csdY ){
	this.applyPaint( ctx );
	var Math = SmartGeoKit2D.Math;
	var y = Math.tan( Math.radians( 60 ) ) * 0.5;
	ctx.beginPath();
	ctx.moveTo( -0.5, y/2 );
	ctx.lineTo( 0, -y/2 );
	ctx.lineTo( 0.5, y/2 );
	ctx.closePath();
	ctx.stroke();
	if( this.fillStyle != null ){
		ctx.fill();
	}
	if( this.image == null ){
		return;
	}
	ctx.save();
	ctx.clip();
	ctx.drawImage( this.image, -0.5, -0.5, 1, 1 );
	ctx.restore();
};