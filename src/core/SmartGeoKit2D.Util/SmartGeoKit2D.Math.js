/**
	SmartGeoKit2D.Math
 **/
SmartGeoKit2D.Math = Object.create( window.Math, {
	radians: {
		value: function sgk2d_math_radians( degrees ){
			return Math.PI / 180 * degrees;
		}
	},
	degrees: {
		value: function sgk2d_math_degrees( radians ){
			return radians / Math.PI * 180;
		}
	}
} );