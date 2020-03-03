/**
	extends SmartGeoKit2D.Object2D
 **/
(function polyline(){
	
	SmartGeoKit2D.Polyline = function sgk2d_polyline( id ){
		SmartGeoKit2D.Shape.call( this, id );
		this.path = [];
		this.position.minX = 0;
		this.position.maxX = 0;
		this.rotation.minX = 0;
		this.rotation.maxX = 0;
		this.scale.minX = 1;
		this.scale.maxX = 1;
		this.position.minY = 0;
		this.position.maxY = 0;
		this.rotation.minY = 0;
		this.rotation.maxY = 0;
		this.scale.minY = 1;
		this.scale.maxY = 1;
		this.selectRange = {
				x: [],
				y: []
		};
		this.strokeStyle = "#000000";
	};
	SmartGeoKit2D.Polyline.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
	SmartGeoKit2D.Polyline.prototype.constructor = SmartGeoKit2D.Polyline;
	SmartGeoKit2D.Polyline.prototype.isPolyline = true;
	SmartGeoKit2D.Polyline.prototype.drawn = function sgk2d_polyline_drawn( ctx, zoom, csdX, csdY ){
		
		/**
		 * 렌더링할 때, selectRange를 바꾸는 로직에서 
		 * path 값을 설정할 때, selectRange를 바꾸는 로직으로 변경이 필요
		 */
		
		this.applyPaint( ctx, zoom );
		
		ctx.beginPath();
		
		var vector0 = this.path[ 0 ];
		if( vector0 == null ){
			return;
		}
		
		this.selectRange.x = [];
		this.selectRange.y = [];
		
		ctx.moveTo( csdX * ( vector0.x ), csdY * ( vector0.y ) );
		for( var i=0; i<this.path.length-1; ++i ){
			var beforePath = this.path[ i ];
			var afterPath = this.path[ i+1 ];
			
			var beforeInnerVector2 = new SmartGeoKit2D.Vector2( -2 / zoom * this.lineWidth, 0 );
			var beforeVector2 = new SmartGeoKit2D.Vector2( csdX * ( beforePath.x ), csdY * ( beforePath.y ) );
			var afterVector2 = new SmartGeoKit2D.Vector2( csdX * ( afterPath.x ), csdY * ( afterPath.y ) );
			
			ctx.lineTo( beforeVector2.x, beforeVector2.y );
			
			//vsrt
			beforeInnerVector2 = setApply( 
					beforeInnerVector2,
					beforeVector2,
					afterVector2
				);
			this.selectRange.x.push( beforeInnerVector2.x );
			this.selectRange.y.push( beforeInnerVector2.y );
			
			var afterInnerVector2 = new SmartGeoKit2D.Vector2( 2 / zoom * this.lineWidth, 0 );
			
			//vsrt
			afterInnerVector2 = setApply( 
					afterInnerVector2,
					afterVector2,
					beforeVector2
				);
			this.selectRange.x.push( afterInnerVector2.x );
			this.selectRange.y.push( afterInnerVector2.y );
			
		}
		ctx.lineTo( csdX * ( this.path[ i ].x ), csdY * ( this.path[ i ].y ) );
		
		for( var i=this.path.length-1; i>0; --i ){
			var beforePath = this.path[ i ];
			var afterPath = this.path[ i-1 ];
			
			var beforeInnerVector2 = new SmartGeoKit2D.Vector2( -2 / zoom * this.lineWidth, 0 );
			var beforeVector2 = new SmartGeoKit2D.Vector2( csdX * ( beforePath.x ), csdY * ( beforePath.y ) );
			var afterVector2 = new SmartGeoKit2D.Vector2( csdX * ( afterPath.x ), csdY * ( afterPath.y ) );
			
			//vsrt
			beforeInnerVector2 = setApply( 
					beforeInnerVector2,
					beforeVector2,
					afterVector2
				);
			this.selectRange.x.push( beforeInnerVector2.x );
			this.selectRange.y.push( beforeInnerVector2.y );
			
			var afterInnerVector2 = new SmartGeoKit2D.Vector2( 2 / zoom * this.lineWidth, 0 );
			
			//vsrt
			afterInnerVector2 = setApply( 
					afterInnerVector2,
					afterVector2,
					beforeVector2
				);
			this.selectRange.x.push( afterInnerVector2.x );
			this.selectRange.y.push( afterInnerVector2.y );
			
		}
		
		this.selectRange.x.push( this.selectRange.x[0] );
		this.selectRange.y.push( this.selectRange.y[0] );
		
		
//			if( this.isFixedSize === true ){
//				ctx.moveTo( -0.5 / zoom, 0 );
//				ctx.lineTo( 0.5 / zoom, 0 );
//			}else{
//				ctx.moveTo( -0.5, 0 );
//				ctx.lineTo( 0.5, 0 );
//			}
//		ctx.closePath();
		ctx.stroke();
		
	};

	function setApply( innerVector2, beforeVector2, afterVector2 ) {
		
		var radian = Math.atan2( afterVector2.y - beforeVector2.y, afterVector2.x - beforeVector2.x ) + Math.PI / 2;
		var rM = new SmartGeoKit2D.Vector2( radian, radian ).getRotateMatrix3();
		var tM = beforeVector2.getTranslateMatrix3();
		
		innerVector2.multiplyMatrix3( rM );
		innerVector2.multiplyMatrix3( tM );
		
		return innerVector2;
		
	}
	
})();