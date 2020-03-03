/**
	abstract class
 **/
SmartGeoKit2D.Camera = function sgk2d_camera( id ){
	// zoom == scale
	SmartGeoKit2D.Object2D.call( this, id );
};
SmartGeoKit2D.Camera.prototype.isCamera = true;
SmartGeoKit2D.Camera.prototype = Object.create( SmartGeoKit2D.Object2D.prototype );
SmartGeoKit2D.Camera.prototype.constructor = SmartGeoKit2D.Camera;