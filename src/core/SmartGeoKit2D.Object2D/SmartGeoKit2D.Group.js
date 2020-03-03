/**
	SmartGeoKit2D.Group
 **/
SmartGeoKit2D.Group = function sgk2d_group( id ){

	SmartGeoKit2D.Object2D.call( this, id );
	this.parent = null;
	this.children = [];
	this.handleScale = new SmartGeoKit2D.Vector2( 1, 1 );
	
	// 중심점
	this.pivot = new SmartGeoKit2D.Vector2();
	
};
SmartGeoKit2D.Group.prototype = Object.create( SmartGeoKit2D.Object2D.prototype );
SmartGeoKit2D.Group.prototype.isGroup = true;
SmartGeoKit2D.Group.prototype.constructor = SmartGeoKit2D.Group;
SmartGeoKit2D.Group.prototype.selectRange = {
		x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
		y: [ -0.5, 0.5, 0.5, -0.5, -0.5 ]
};
/**
 	하위 객체 추가
 **/
SmartGeoKit2D.Group.prototype.add = function sgk2d_group_add( group ){
	
	// 기존에 추가된 객체라면, 이전 참조 제거
	if( group.parent != null ){
		group.parent.remove( group );
	}
	
	group.parent = this;
	var depth = 0;
	var parent = group;
	while( true ){
		if( parent.parent == null ){
			break;
		}
		depth++;
		parent = parent.parent;
	}
	group.depth = depth;
	
	for( var i=0; i<this.children.length; ++i ){
		var children = this.children[ i ];
		if( group.zIndex < children.zIndex ){
			this.children.splice( i, 0, group );
			return true;
		}
	}
	this.children.push( group );
	return true;
	
};

SmartGeoKit2D.Group.prototype.updateHandle = function(){

	// 바운더리 조회
	var arrs = SmartGeoKit2D.Util.getObjectWorldSelectRange( this );
	var maxX = Math.max.apply( null, arrs.xArr );
	var minX = Math.min.apply( null, arrs.xArr );
	var maxY = Math.max.apply( null, arrs.yArr );
	var minY = Math.min.apply( null, arrs.yArr );
	
	var width = maxX - minX;
	var height = maxY - minY;
	
	var absX = Math.max( Math.abs( this.position.x - maxX ), Math.abs( this.position.x - minX ) );
	var absY = Math.max( Math.abs( this.position.y - maxY ), Math.abs( this.position.y - minY ) );
	
	this.handleScale.x = absX / width * 2;
	this.handleScale.y = absY / height * 2;
	
};

/**
	하위 객체 삭제
 **/
SmartGeoKit2D.Group.prototype.remove = function sgk2d_group_remove( group ){
	for( var i=0; i<this.children.length; ++i ){
		var children = this.children[ i ];
		if( children === group ){
			this.children.splice( i, 1 );
			group.parent = null;
			return true;
		} 
	}
	return false;
};
/**
	자신을 포함한 모든 하위 객체 순환 조회
	
	Save
	Scene
	
	Save Save
	Text Circle
		 
		 Save	   Save
		 Rectangle Triangle
	
 **/
SmartGeoKit2D.Group.prototype.traverse = function sgk2d_group_traverse( callback, endCallback ){
	// 탐색 수동 종료: return false;
	if( callback( this ) === false ){
		return false;
	};
	for( var i=0; i<this.children.length; ++i ){
		if( this.children[i].isGroup === true ){
			this.children[i].traverse( callback, endCallback );
		}else{
			if( callback( this.children[i] ) === false ){
				return false;
			};
			if( typeof endCallback !== "function" ){
				continue;
			}
			
			if( endCallback( this ) === false ){
				return false;
			};
		}
	}
	
	if( typeof endCallback !== "function" ){
		return;
	}
	
	if( endCallback( this ) === false ){
		return false;
	};
};
/**
	변형 적용
 **/
SmartGeoKit2D.Group.prototype.applyMatrix = function sgk2d_group_applyMatrix( ctx ){
	ctx.translate( this.position.x, this.position.y );
	ctx.rotate( this.rotation.x, this.rotation.x );
	ctx.scale( this.scale.x, this.scale.y );
};

