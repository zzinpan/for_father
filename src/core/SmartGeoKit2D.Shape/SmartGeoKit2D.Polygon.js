/**
	extends SmartGeoKit2D.Object2D
 **/
(function polygon(){
	
	SmartGeoKit2D.Polygon = function sgk2d_polygon( id ){
		SmartGeoKit2D.Shape.call( this, id );
		
		// SmartGeoKit2D.Vector2[]
		this.path = [];
		this.strokeStyle = "#000000";
		
		this.calcPathX = [];
		this.calcPathY = [];
		
	};
	SmartGeoKit2D.Polygon.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
	SmartGeoKit2D.Polygon.prototype.constructor = SmartGeoKit2D.Polygon;
	SmartGeoKit2D.Polygon.prototype.isPolygon = true;
	SmartGeoKit2D.Polygon.prototype.drawn = function sgk2d_polygon_drawn( ctx, zoom, csdX, csdY ){
		
		this.applyPaint( ctx, zoom );
		
		ctx.beginPath();
		
		ctx.moveTo( csdX * ( this.calcPathX[0] ), csdY * ( this.calcPathY[0] ) );
		for( var i=0; i<this.calcPathX.length; ++i ){
			ctx.lineTo( csdX * ( this.calcPathX[ i ] ), csdY * ( this.calcPathY[ i ] ) );
		}
		
		ctx.closePath();
		ctx.stroke();
		if( this.fillStyle != null ){
			ctx.fill();
		}
		
	};
	
	SmartGeoKit2D.Polygon.prototype.getWorldPath = function(){
		
		var path = [];
		for( var i=0; i<this.calcPathX.length; ++i ){
			var x = this.calcPathX[ i ];
			var y = this.calcPathY[ i ];
			var v = new SmartGeoKit2D.Vector2( x, y );
			path.push( this.localToWorld( v ) );
			
		}
		return path;
		
	};
	
	SmartGeoKit2D.Polygon.prototype.updateCenterPosition = function(){
		
		if( this.calcPathX.length > 0 ){
			var path = [];
			for( var i=0; i<this.calcPathX.length; ++i ){
				var x = this.calcPathX[ i ];
				var y = this.calcPathY[ i ];
				path.push( new SmartGeoKit2D.Vector2( x + this.position.x, y + this.position.y ) );
				
			}
			this.position.set( 0,0 );
			this.path = path;
		}
		
		this.updatePath();
		
	};
	
	SmartGeoKit2D.Polygon.prototype.updatePath = function sg2d_polygon_updateMatrix(){
		
		this.calcPathX = [];
		this.calcPathY = [];
		for( var i=0; i<this.path.length; ++i ){
			this.calcPathX.push( this.path[ i ].x );
			this.calcPathY.push( this.path[ i ].y );
		}

		var maxX = Math.max.apply( null, this.calcPathX );
		var maxY = Math.max.apply( null, this.calcPathY );
		var minX = Math.min.apply( null, this.calcPathX );
		var minY = Math.min.apply( null, this.calcPathY );
		var centerX = ( maxX + minX ) / 2;
		var centerY = ( maxY + minY ) / 2;
		
		// 기존 포지션값을 유지해야되는데 어떻게하지??
		this.position.x = centerX;
		this.position.y = centerY;
		
		for( var i=0; i<this.path.length; ++i ){
			this.calcPathX[ i ] -= this.position.x;
			this.calcPathY[ i ] -= this.position.y;
		}
		
		this.selectRange = {
				x: this.calcPathX,
				y: this.calcPathY
		};
		
	};
	
})();