/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Rhombus = function sgk2d_rhombus( id ){
	SmartGeoKit2D.Shape.call( this, id );
};
SmartGeoKit2D.Rhombus.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Rhombus.prototype.constructor = SmartGeoKit2D.Rhombus;
SmartGeoKit2D.Rhombus.prototype.isRhombus = true;
SmartGeoKit2D.Rhombus.prototype.selectRange = {
		x: [ 0, -0.5, 0, 0.5, 0 ],
		y: [ -0.5, 0, 0.5, 0, -0.5 ]
};
SmartGeoKit2D.Rhombus.prototype.drawn = function sgk2d_triangle_drawn( ctx, zoom ){
	this.applyPaint( ctx );
	ctx.beginPath();
	if( this.isFixedSize === true ){
		var size = 0.5 / zoom; 
		this.selectRange = {
			x: [ 0, -size, 0, size, 0 ],
			y: [ -size, 0, size, 0, -size ]
		};
		ctx.moveTo( 0, -0.5 / zoom );
		ctx.lineTo( -0.5 / zoom, 0 );
		ctx.lineTo( 0, 0.5 / zoom );
		ctx.lineTo( 0.5 / zoom, 0 );
		ctx.lineTo( 0, -0.5 / zoom );
	}else{
		delete this.selectRange;
		ctx.moveTo( 0, -0.5 );
		ctx.lineTo( -0.5, 0 );
		ctx.lineTo( 0, 0.5 );
		ctx.lineTo( 0.5, 0 );
		ctx.lineTo( 0, -0.5 );
	}
	
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