/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Rectangle = function sgk2d_rectangle( id ){
	SmartGeoKit2D.Shape.call( this, id );
};
SmartGeoKit2D.Rectangle.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Rectangle.prototype.constructor = SmartGeoKit2D.Rectangle;
SmartGeoKit2D.Rectangle.prototype.isRectangle = true;
SmartGeoKit2D.Rectangle.prototype.selectRange = {
		x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
		y: [ -0.5, 0.5, 0.5, -0.5, -0.5 ]
};
SmartGeoKit2D.Rectangle.prototype.drawn = function sgk2d_rectangle_drawn( ctx, zoom ){
	this.applyPaint( ctx, zoom );
	ctx.beginPath();
	if( this.isFixedSize === true ){
		var size = 0.5 / zoom; 
		this.selectRange = {
			x: [ -size, -size, size, size, -size ],
			y: [ -size, size, size, -size, -size ]
		};
		ctx.rect( -0.5 / zoom, -0.5 / zoom, 1 / zoom, 1 / zoom );
	}else{
		delete this.selectRange;
		ctx.rect( -0.5, -0.5, 1, 1 );
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
	if( this.isFixedSize === true ){
		ctx.drawImage( this.image, -0.5 / zoom, -0.5 / zoom, 1 / zoom, 1 / zoom );
	}else{
		ctx.drawImage( this.image, -0.5, -0.5, 1, 1 );
	}
	ctx.restore();
};