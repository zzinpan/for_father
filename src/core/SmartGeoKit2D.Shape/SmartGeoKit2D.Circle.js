/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Circle = function sgk2d_circle( id ){
	SmartGeoKit2D.Shape.call( this, id );
};
SmartGeoKit2D.Circle.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Circle.prototype.constructor = SmartGeoKit2D.Circle;
SmartGeoKit2D.Circle.prototype.isCircle = true;
SmartGeoKit2D.Circle.prototype.selectRange = (function createSelectRange(){

	var Math = SmartGeoKit2D.Math;
	
	var devide = 32;
	var degrees = 360 / devide;
	var radians = Math.radians( degrees );
	
	var xArr = [0.5];
	var yArr = [0];
	
	for( var i=1; i<devide+1; ++i ){
		var vector2 = new SmartGeoKit2D.Vector2( 0.5, 0 );
		var rotation = new SmartGeoKit2D.Vector2( radians * i, radians * i );
		var rM = rotation.getRotateMatrix3();
		vector2.multiplyMatrix3( rM );
		xArr.push( vector2.x );
		yArr.push( vector2.y );
	}
	
	return {
			x: xArr,
			y: yArr
	};
	
})();
SmartGeoKit2D.Circle.prototype.drawn = function sgk2d_triangle_drawn( ctx, csdX, csdY ){
	this.applyPaint( ctx );
	ctx.beginPath();
	ctx.arc( 0, 0, 0.5, 0, Math.PI * 2 );
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