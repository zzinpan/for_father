/**
	SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Object2D = function sgk2d_object2d( id ){

	this.id = id;
	this.scale = new SmartGeoKit2D.Vector2( 1, 1 );
	this.position = new SmartGeoKit2D.Vector2( 0, 0 );
	this.rotation = new SmartGeoKit2D.Vector2( 0, 0 );
	this.rotation.setDegree = this.setDegree.bind( this );
	this.isScan = true;
	
	// 객체가 children 요소로 어디에 있는지를 표시 ( 그룹 내 객체들은 그룹의 zIndex의 영향을 받아야하기 떄문 )
	this.depth = 1;
	this.opacity = 1;
	
	// zIndex 설정 시, 자동 정렬 작업을 위한 get, set 코딩
	
	var zIndex = 0;
	Object.defineProperty( this, "zIndex", {
		get: function getZIndex(){
			return zIndex;
		},
		set: function setZIndex( _zIndex ) {
			zIndex = _zIndex;
			if( this.parent == null ){
				return;
			}
			this.parent.add( this );
		}
	} );
	
	this.isFixedSize = false;
	this.userData = {};
	
};
SmartGeoKit2D.Object2D.prototype.isObject2D = true;
//모양 선택 범위
SmartGeoKit2D.Object2D.prototype.selectRange = {
		x: [ 0,0 ],
		y: [ 0,0 ]
};
SmartGeoKit2D.Object2D.prototype.handleScale = new SmartGeoKit2D.Vector2( 1, 1 );
SmartGeoKit2D.Object2D.prototype.updateHandle = function(){};
SmartGeoKit2D.Object2D.prototype.traverse = function sgk2d_group_traverse( callback, endCallback ){
	// 탐색 수동 종료: return false;
	if( callback( this ) === false ){
		return false;
	};
	
	if( typeof endCallback !== "function" ){
		return;
	}
	
	if( endCallback( this ) === false ){
		return false;
	};
};

/**
	degree 입력
 **/
SmartGeoKit2D.Object2D.prototype.setDegree = function( deg ){
	var rad = deg * Math.PI / 180;
	this.rotation.set( rad, rad );
};

/**
	변형 적용
 **/
SmartGeoKit2D.Object2D.prototype.applyMatrix = function sgk2d_object2d_applyMatrix( ctx ){
	ctx.translate( this.position.x, this.position.y );
	ctx.rotate( this.rotation.x, this.rotation.x );
	ctx.scale( this.scale.x, this.scale.y );
};
/**
	객체 내 좌표가 월드 좌표로 몇인지 전달
**/
SmartGeoKit2D.Object2D.prototype.localToWorld = function sgk2d_object2d_localToWorld( vector2 ){
	
	var sM = this.scale.getScaleMatrix3();
	var rM = this.rotation.getRotateMatrix3();
	var tM = this.position.getTranslateMatrix3();
	
	// v * s * r * t
	vector2.multiplyMatrix3( sM );
	vector2.multiplyMatrix3( rM );
	vector2.multiplyMatrix3( tM );
	
	return vector2;
	
};
/**
	월드 좌표가 객체 내 좌표로 몇인지 전달
 **/
SmartGeoKit2D.Object2D.prototype.worldToLocal = function sgk2d_object2d_localToWorld( vector2 ){
	
	var siM = this.scale.getScaleMatrix3().getInverseMatrix3();
	var riM = this.rotation.getRotateMatrix3().getInverseMatrix3();
	var tiM = this.position.getTranslateMatrix3().getInverseMatrix3();
	
	// v * s * r * t / t / r / s
	vector2.multiplyMatrix3( tiM );
	vector2.multiplyMatrix3( riM );
	vector2.multiplyMatrix3( siM );
	
	return vector2;
	
};