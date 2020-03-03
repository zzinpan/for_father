/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Line = function sgk2d_line( id ){
	SmartGeoKit2D.Shape.call( this, id );
//	this.isFixedSize = true;
	this.strokeStyle = "#000000";
};
SmartGeoKit2D.Line.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Line.prototype.constructor = SmartGeoKit2D.Line;
SmartGeoKit2D.Line.prototype.isLine = true;
SmartGeoKit2D.Line.prototype.drawn = function sgk2d_line_drawn( ctx, zoom ){
	this.applyPaint( ctx, zoom );
	ctx.beginPath();
	if( this.isFixedSize === true ){
		ctx.moveTo( -0.5 / zoom, 0 );
		ctx.lineTo( 0.5 / zoom, 0 );
	}else{
		ctx.moveTo( -0.5, 0 );
		ctx.lineTo( 0.5, 0 );
	}
	ctx.closePath();
	ctx.stroke();
	
	var halfY = 0.05 / zoom;
	if( halfY > 0.01 ){
		halfY = 0.01;
	}
	this.selectRange = {
			x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
			y: [ -halfY, halfY, halfY, -halfY, -halfY ]
	};
	
};