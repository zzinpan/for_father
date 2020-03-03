/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Shape = function sgk2d_shape( id ){
	SmartGeoKit2D.Object2D.call( this, id );
	this.lineWidth = 1; // 외곽선 두께
	this.fillStyle = "rgba(0,0,0,1)"; // 도형 색상
	this.strokeStyle = "rgba(0,0,0,0)"; // 외곽선 색상
	this.isFixedLineWidth = true; // 외곽선 두께 고정 여부
	this.isFixedSize = false; // 도형 크기 고정 여부
	this.image = null; // 도형에 표시할 이미지
};
SmartGeoKit2D.Shape.prototype = Object.create( SmartGeoKit2D.Object2D.prototype );
SmartGeoKit2D.Shape.prototype.constructor = SmartGeoKit2D.Shape;
SmartGeoKit2D.Shape.prototype.isShape = true;

// abstract method
SmartGeoKit2D.Shape.prototype.xHandles = {};
SmartGeoKit2D.Shape.prototype.yHandles = {};

SmartGeoKit2D.Shape.prototype.applyPaint = function sgk2d_shape_applyPaint( ctx, zoom ){
	ctx.fillStyle = this.fillStyle;
	ctx.strokeStyle = this.strokeStyle;
	ctx.lineWidth = Math.abs( this.lineWidth / this.scale.x );
	if( this.isFixedLineWidth === true ){
		ctx.lineWidth /= zoom;
	}
};
SmartGeoKit2D.Shape.prototype.setPaint = function sgk2d_shape_setPaint( paintInfo ){
	this.fillStyle = paintInfo.fillStyle || this.fillStyle;
	this.strokeStyle = paintInfo.strokeStyle || this.strokeStyle;
	this.lineWidth = paintInfo.lineWidth || this.lineWidth;
	this.isFixedLineWidth = paintInfo.fixedLineWidth || this.isFixedLineWidth;
};
SmartGeoKit2D.Shape.prototype.drawn = function sgk2d_shape_drawn(){
	return false;
};
SmartGeoKit2D.Shape.prototype.getImage = function sgk2d_shape_getImage( width, height ){
	
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = width;
	tempCanvas.height = height;
	var ctx = tempCanvas.getContext("2d");
	
	var objectWidth = Math.max.apply( null, this.selectRange.x ) - Math.min.apply( null, this.selectRange.x );
	var objectHeight = Math.max.apply( null, this.selectRange.y ) - Math.min.apply( null, this.selectRange.y );
	
	ctx.translate( width / 2, height / 2 );
	ctx.scale( width / 2 / objectWidth, height / 2 / objectHeight );
//	ctx.scale( width / 2, height / 2 );
	this.drawn( ctx, 1, 1, 1 );
	return tempCanvas.toDataURL();
	
};