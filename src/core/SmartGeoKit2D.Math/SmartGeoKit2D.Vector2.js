/**
	SmartGeoKit2D.Vector2
 **/
SmartGeoKit2D.Vector2 = function sgk2d_vector2( initX, initY ){

	var x = 0;
	var y = 0;
	var self = this;
	Object.defineProperties( self, {
		x: {
			get: function(){
				return x;
			},
			set: function( _x ){
				if( self.minX > _x ){
					x = self.minX;
				}
				else if( self.maxX < _x ){
					x = self.maxX;
				}
				else{
					x = _x;
				}
			}
		},
		y: {
			get: function(){
				return y;
			},
			set: function( _y ){
				if( self.minY > _y ){
					y = self.minY;
				}
				else if( self.maxY < _y ){
					y = self.maxY;
				}
				else{
					y = _y;
				}
			}
		}
	} );
	
	self.set( initX, initY );
	
};
SmartGeoKit2D.Vector2.prototype.isVector2 = true;
SmartGeoKit2D.Vector2.prototype.minX = -Infinity;
SmartGeoKit2D.Vector2.prototype.minY = -Infinity;
SmartGeoKit2D.Vector2.prototype.maxX = Infinity;
SmartGeoKit2D.Vector2.prototype.maxY = Infinity;

SmartGeoKit2D.Vector2.prototype.clone = function sgk2d_vector2_clone(){
	return new SmartGeoKit2D.Vector2( this.x, this.y );
};
SmartGeoKit2D.Vector2.prototype.set = function sgk2d_vector2_set( x, y ){
	this.setX( x );
	this.setY( y );
};

SmartGeoKit2D.Vector2.prototype.setX = function sgk2d_vector2_setX( x ){
	if( typeof x === "number" ){
		this.x = x;
	}
};

SmartGeoKit2D.Vector2.prototype.setY = function sgk2d_vector2_setY( y ){
	if( typeof y === "number" ){
		this.y = y;
	}
};
SmartGeoKit2D.Vector2.prototype.multiplyMatrix3 = function sgk2d_vector2_multiplyMatrix3( matrix3 ){
	
	var m0 = matrix3.elements[ 0 ];
	var m1 = matrix3.elements[ 1 ];
	var m2 = matrix3.elements[ 2 ];
	var m3 = matrix3.elements[ 3 ];
	var m4 = matrix3.elements[ 4 ];
	var m5 = matrix3.elements[ 5 ];
	var m6 = matrix3.elements[ 6 ];
	var m7 = matrix3.elements[ 7 ];
	var m8 = matrix3.elements[ 8 ];
	
	var x = this.x * m0 + this.y * m1 + 1 * m2;
	var y = this.x * m3 + this.y * m4 + 1 * m5;
	
	this.x = x;
	this.y = y;
	
};
/**
	v -> m(S)
**/
SmartGeoKit2D.Vector2.prototype.getScaleMatrix3 = function sgk2d_vector2_getScaleMatrix3(){
	
	var matrix = new SmartGeoKit2D.Matrix3();

	var scaleX = this.x;
	var scaleY = this.y;
	
	return matrix.setAll(
		scaleX,	0,		0,
		0,		scaleY,	0,
		0,		0,		1
	);
	
};
/**
	v -> m(R)
**/
SmartGeoKit2D.Vector2.prototype.getRotateMatrix3 = function sgk2d_vector2_getRotateMatrix3(){
	
	var matrix = new SmartGeoKit2D.Matrix3();
	
	var sinX = Math.sin( this.x );
	var cosX = Math.cos( this.x );
	var sinY = Math.sin( this.y );
	var cosY = Math.cos( this.y );
	
	return matrix.setAll(
			cosX, -sinX, 0,
			sinY, cosY,  0,
			0,	  0,	 1
	);
	
};
/**
	v -> m(T)
 **/
SmartGeoKit2D.Vector2.prototype.getTranslateMatrix3 = function sgk2d_vector2_getTranslateMatrix3(){
	
	var matrix = new SmartGeoKit2D.Matrix3();
	
	var translateX = this.x;
	var translateY = this.y;
	
	return matrix.setAll(
		1,	0,	translateX,
		0,	1,	translateY,
		0,	0,	1
	);
	
};

