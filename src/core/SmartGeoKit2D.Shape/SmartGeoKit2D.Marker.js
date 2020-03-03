/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Marker = function sgk2d_marker( id ){
	SmartGeoKit2D.Shape.call( this, id );
	this.circleStyle = "#ffffff";
	this.selectRange = SmartGeoKit2D.Marker.prototype.selectRangePlus;
};
SmartGeoKit2D.Marker.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Marker.prototype.constructor = SmartGeoKit2D.Marker;
SmartGeoKit2D.Marker.prototype.isMarker = true;
SmartGeoKit2D.Marker.prototype.selectRangePlus = (function createSelectRange(){

	var Math = SmartGeoKit2D.Math;
	
	var degrees = 15; // 15
	var target = 240;
	var cnt = target / degrees;
	var radians = Math.radians( degrees );
	
	var xArr = [];
	var yArr = [];
	
	var vector2 = new SmartGeoKit2D.Vector2( 0.4, 0 );
	
	var rrotation = new SmartGeoKit2D.Vector2( -radians, -radians );
	var rrM = rrotation.getRotateMatrix3();

	var rotation = new SmartGeoKit2D.Vector2( radians, radians );
	var rM = rotation.getRotateMatrix3();
	
	for( var i=0; i<30/degrees; ++i ){
		vector2.multiplyMatrix3( rM );
	}
	
	// 30도 지점 추가
	xArr.push( vector2.x );
	yArr.push( vector2.y );
	
	// 30도부터 반시계방향으로 150도까지
	for( var i=0; i<cnt; ++i ){
		vector2.multiplyMatrix3( rrM );
		xArr.push( vector2.x );
		yArr.push( vector2.y );
	}
	
	xArr.push( 0 );
	yArr.push( 0.6 );
	xArr.push( xArr[0] );
	yArr.push( yArr[0] );
	
//	 30도부터 반시계방향으로 150도까지
	for( var i=0; i<yArr.length; ++i ){
		yArr[ i ] -= 0.6;
	}
	
	return {
			x: xArr,
			y: yArr
	};
	
})();
SmartGeoKit2D.Marker.prototype.selectRangeMinus = (function(){
	
	var yArr = SmartGeoKit2D.Marker.prototype.selectRangePlus.y.slice();
	for( var i=0; i<yArr.length; ++i ){
		yArr[i] *= -1;
	}
	
	return {
		x: SmartGeoKit2D.Marker.prototype.selectRangePlus.x,
		y: yArr
	};
	
})();
SmartGeoKit2D.Marker.prototype.handleScale = new SmartGeoKit2D.Vector2( 1, 2 );
SmartGeoKit2D.Marker.prototype.drawn = function sgk2d_marker_drawn( ctx, zoom, csdX, csdY ){
	this.applyPaint( ctx, zoom );
	
	// 로직 개선 필요 selectRange를 그대로 못그리는 원인 찿기
	if( csdY < 0 ){
		this.selectRange = SmartGeoKit2D.Marker.prototype.selectRangeMinus;
	}else{
		this.selectRange = SmartGeoKit2D.Marker.prototype.selectRangePlus;
	}
	
	if( this.isFixedSize === true ){
		
		this.selectRange = {
				x: this.selectRange.x.slice(),
				y: this.selectRange.y.slice()
		};
		
		for( var i=0; i<this.selectRange.x.length; ++i ){
			this.selectRange.x[i] /= zoom;
			this.selectRange.y[i] /= zoom;
		}
		
		ctx.save();
		ctx.beginPath();
		ctx.arc( 0, -0.6 / zoom, 0.4 / zoom, 150 * Math.PI / 180, 30 * Math.PI / 180 );
		ctx.lineTo( 0, 0 );
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		
		ctx.fillStyle = this.circleStyle;
		ctx.beginPath();
		ctx.arc( 0, -0.6 / zoom, 0.25 / zoom, 0, Math.PI * 2 );
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		
	}else{
		
		ctx.save();
		ctx.beginPath();
		ctx.arc( 0, -0.6, 0.4, 150 * Math.PI / 180, 30 * Math.PI / 180 );
		ctx.lineTo( 0, 0 );
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		
		ctx.fillStyle = this.circleStyle;
		ctx.beginPath();
		ctx.arc( 0, -0.6, 0.25, 0, Math.PI * 2 );
		ctx.closePath();
		ctx.fill();
		ctx.restore();

	}
	
};