/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Scene = function sgk2d_scene(){
	SmartGeoKit2D.Group.apply( this, arguments );
	
	/*
		CSD( Coordinate System Direction ): 좌표 증가 방향
		 [2] -1,1  | [1] 1,1
		 --------------------
		 [3] -1,-1 | [4] 1,-1
	 */
	this.CSD = new SmartGeoKit2D.Vector2( 1,1 );
};
SmartGeoKit2D.Scene.prototype = Object.create( SmartGeoKit2D.Group.prototype );
SmartGeoKit2D.Scene.prototype.isScene = true;
SmartGeoKit2D.Scene.prototype.drawn = function sgk2d_scene_drawn( ctx ){
	// pass
};
SmartGeoKit2D.Scene.prototype.setCSD = function sg2d_scene_setCSD( x, y ){
	if( x > 0 ){
		this.CSD.x = 1;
	}else if( x < 0 ){
		this.CSD.x = -1;
	}
	if( y > 0 ){
		this.CSD.y = 1;
	}else if( y < 0 ){
		this.CSD.y = -1;
	}
};