/**
	객체 정보 조회
**/
SmartGeoKit2D.prototype.getObjectById = function sgk2d_getObjectInfo( id ){
	var targetObject2d = null;
	this.scene.traverse( function( object2d ){
		if( object2d.id === id ){
			targetObject2d = object2d;
			return false;
		}
	} );
	return targetObject2d;
};

/**
	2D객체 추가
 **/
SmartGeoKit2D.prototype.addObject = function sgk2d_addObject( object2d ){
	this.scene.add( object2d );
	return object2d;
};

/**
	그룹 추가
 **/
SmartGeoKit2D.prototype.addGroup = function sgk2d_addGroup( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var group = new SmartGeoKit2D.Group( id );
	this.scene.add( group );
	return group;
};

/**
	라인 추가
 **/
SmartGeoKit2D.prototype.addLine = function sgk2d_addLine( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var line = new SmartGeoKit2D.Line( id );
	this.scene.add( line );
	return line;
};
SmartGeoKit2D.prototype.addPolyline = function sgk2d_addPolyline( id, path ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var polyline = new SmartGeoKit2D.Polyline( id, path );
	this.scene.add( polyline );
	return polyline;
};

/**
 	다각형 추가
 **/
SmartGeoKit2D.prototype.addPolygon = function sgk2d_addPolygon( id, path ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var polygon = new SmartGeoKit2D.Polygon( id, path );
	this.scene.add( polygon );
	return polygon;
};

/**
	사각형 추가
**/
SmartGeoKit2D.prototype.addRectangle = function sgk2d_addRect( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var rectangle = new SmartGeoKit2D.Rectangle( id );
	this.scene.add( rectangle );
	return rectangle;
};

/**
	원 추가
**/
SmartGeoKit2D.prototype.addCircle = function sgk2d_addRect( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var circle = new SmartGeoKit2D.Circle( id );
	this.scene.add( circle );
	return circle;
};

/**
	삼각형 추가
**/
SmartGeoKit2D.prototype.addTriangle = function sgk2d_addTriangle( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var triangle = new SmartGeoKit2D.Triangle( id );
	this.scene.add( triangle );
	return triangle;
};

/**
	마름모 추가
**/
SmartGeoKit2D.prototype.addRhombus = function sgk2d_addRhombus( id ){
var object2d = this.getObjectById( id );
SmartGeoKit2D.Debugger.assert( object2d != null, { 
	id: id, 
	msg: "id가 중복됩니다."
} );
var rhombus = new SmartGeoKit2D.Rhombus( id );
this.scene.add( rhombus );
return rhombus;
};

/**
	문구 추가
**/
SmartGeoKit2D.prototype.addText = function sgk2d_addText( id, _text ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var text = new SmartGeoKit2D.Text( id, _text );
	this.scene.add( text );
	return text;
};

/**
	문구 추가
 **/
SmartGeoKit2D.prototype.addMarker = function sgk2d_addMarker( id ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var marker = new SmartGeoKit2D.Marker( id );
	this.scene.add( marker );
	return marker;
};

/**
	객체 복사
 **/
SmartGeoKit2D.prototype.cloneObject = function sgk2d_cloneObject( id, originObject ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	SmartGeoKit2D.Debugger.assert( originObject == null, { 
		id: id, 
		msg: "복사 대상이 없습니다."
	} );
	
	try{
		// 값 복사를 위한 순환 참조 제거
		var children = originObject.children;
		var parent = originObject.parent;
		var userData = originObject.userData;
		var image = originObject.image;
		delete originObject.children;
		delete originObject.parent;
		delete originObject.userData;
		delete originObject.image;
		
		function clone(obj) {
		  if (obj === null || typeof(obj) !== 'object'){
			  return obj;
		  }
		  var copy = new obj.constructor();
		  
		  // getter, setter 복사를 위한 로직
		  var props = Object.getOwnPropertyNames(obj);
		  for (var i=0; i<props.length; ++i) {
			var attr = props[ i ];
		    if (obj.hasOwnProperty(attr)) {
		      copy[attr] = clone(obj[attr]);
		    }
		  }
		  return copy;
		}
		
		var cloneObject = clone( originObject );
		
		// 신규 아이디 부여
		cloneObject.id = id;

		// 이미지는 레퍼런스 복사
		cloneObject.image = image;

		// 사용자 데이터는 복사하지 않음
		cloneObject.userData = {};
		if( cloneObject.isGroup === true ){
			cloneObject.children = [];
		}
		
		this.scene.add( cloneObject );
		
		originObject.children = children;
		originObject.parent = parent;
		originObject.userData = userData;
		originObject.image = image;
		
		return cloneObject;
		
	}catch(e){
		SmartGeoKit2D.Debugger.assert( true, { 
			msg: "사용자 데이터는 userData 프로퍼티를 이용해야합니다."
		} );
		return false;
	}
	
	
};

/**
	객체 삭제
 **/
SmartGeoKit2D.prototype.removeObject = function sgk2d_remove( object2d ){
	if( object2d.parent != null ){
		object2d.parent.remove( object2d );
		return true;
	}
	return false;
};

/** 
	전체 객체 삭제
 **/
SmartGeoKit2D.prototype.removeObjectAll = function sgk2d_remove_all(){
	var childrens = this.scene.children;
	while( childrens.length > 0 ){
		var chiildren = childrens.pop();
		this.scene.remove( chiildren );
	}
};

/**
	좌표에 해당하는 객체 조회
 **/
SmartGeoKit2D.prototype.getObjectsByXy = function sgk2d_getObjectsByXy( dx, dy, isGetChildren ){

	var sgk2d = this;
	
	var objects = [];
	var childrens = sgk2d.scene.children;
	
	var csdX = sgk2d.scene.CSD.x;
	var csdY = -1 * sgk2d.scene.CSD.y;
	
	for( var i=childrens.length-1; i>-1; --i ){
		
		var children = childrens[ i ];
		
		if( children.isScan !== true ){
			continue;
		}
		
		children.traverse( function( shape ){
			
			var xArr = [];
			var yArr = [];
			
			// 선택 영역 좌표를 월드 좌표계로 전환
			for( var j=0; j<shape.selectRange.x.length; ++j ){
				
				// T * R * S
				var x =  shape.selectRange.x[j];
				var y =  shape.selectRange.y[j];
				
//				x *= csdX;
//				y *= csdY;
				
				var v = new SmartGeoKit2D.Vector2( x, y );
				var parent = shape;
				while( true ){
					
					var tM = parent.position.getTranslateMatrix3();
					var rM = parent.rotation.getRotateMatrix3();
					var sM = parent.scale.getScaleMatrix3();
					
					if( parent.isGroup === true ){
						var pV = new SmartGeoKit2D.Vector2( -parent.pivot.x, -parent.pivot.y );
						var pM = pV.getTranslateMatrix3();
						v.multiplyMatrix3( pM );
					}
					v.multiplyMatrix3( sM );
					v.multiplyMatrix3( rM );
					v.multiplyMatrix3( tM );
					
					parent = parent.parent;
					if( parent.isScene === true ){
						break;
					}
					
				}
				
				xArr.push( v.x );
				yArr.push( v.y );
				
			} // end - for(j)
			
			// 좌표가 도형에 포함되는지 검사
			var isPointInPolygon = SmartGeoKit2D.Util.isPointInPolygon( dx, dy, xArr, yArr );
			if( isPointInPolygon === true ){
				if( isGetChildren === true ){
					objects.push( shape );
					return;
				}
				objects.push( children );
				return false;
			}
			
		} );

	} // end - for(i)
	
	// depth로 선정렬, zIndex로 후정렬
	objects.sort(function (a, b) {
	  if ( a.depth < b.depth ) {
	  	return 1;
	  }
	  
	  if( a.depth > b.depth ){
		  return -1;
	  }
	  
	  if( a.zIndex < b.zIndex ){
		  return 1;
	  }
	  
	  if( a.zIndex > b.zIndex ){
		  return -1;
	  }
	  
	  return 0;
		  
	});
	
	return objects;
	
};

/**
	영역에 포함되는 객체 조회
**/
SmartGeoKit2D.prototype.getObjectsByPolygon = function sgk2d_getObjectsByPolygon( xArr, yArr ){
	
	var sgk2d = this;
	
	var objects = [];
	var childrens = sgk2d.scene.children;
	
	var csdX = sgk2d.scene.CSD.x;
	var csdY = -1 * sgk2d.scene.CSD.y;
	
	for( var i=0; i<childrens.length; ++i ){
		
		var children = childrens[ i ];
		
		if( children.isScan !== true ){
			continue;
		}
		
		children.traverse( function( shape ){
			
			var coordinatesX = [];
			var coordinatesY = [];
			
			// 선택 영역 좌표를 월드 좌표계로 전환
			for( var j=0; j<shape.selectRange.x.length; ++j ){
				
				// T * R * S
				var x =  shape.selectRange.x[j];
				var y =  shape.selectRange.y[j];
				
				x *= csdX;
				y *= csdY;
				
				var v = new SmartGeoKit2D.Vector2( x, y );
				var parent = shape;
				while( true ){
					
					var tM = parent.position.getTranslateMatrix3();
					var rM = parent.rotation.getRotateMatrix3();
					var sM = parent.scale.getScaleMatrix3();
					
					v.multiplyMatrix3( sM );
					v.multiplyMatrix3( rM );
					v.multiplyMatrix3( tM );
					
					parent = parent.parent;
					if( parent.isScene === true ){
						break;
					}
					
				}
				
				coordinatesX.push( v.x );
				coordinatesY.push( v.y );
				
			} // end - for(j)
			
			// 객체의 모든 꼭지점이 사용자 입력 영역에 포함되는지 판단
			for( var j=0; j<coordinatesX.length; ++j ){
				
				var dx = coordinatesX[ j ];
				var dy = coordinatesY[ j ];
				var isPointInPolygon = SmartGeoKit2D.Util.isPointInPolygon( dx, dy, xArr, yArr );
				if( isPointInPolygon === false ){
					// 한 점이라도 포함이 안될 경우, 선택에서 제외
					return true;
				}
				
			}
			
			// zIndex순으로 정렬
			for( var l=0; l<objects.length; ++l ){
				if( children.zIndex > objects[ l ].zIndex ){
					objects.splice( l, 0, children );
					return false;
				}
			}
			objects.push( children );
			return false;
			
		} );

	} // end - for(i)
	
	return objects;
	
};

/*****
 * TODO 아래 WEB 페이지에 API 등록 해야됨
 */

//왼쪽 정렬
SmartGeoKit2D.prototype.alignLeftObjects = function sgk2d_alignLeftObjects( objectList ){

	var alignX = Infinity;
	var boundaries = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		var boundaryInfo = {
				object2d: object2d,
				minX: null
		};
		
		var xArr = [];
		for( var i=0; i<selectRangeX.length; ++i ){

			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			xArr.push( vector2.x );
			
		}
		
		// 객체의 최소값
		boundaryInfo.minX = Math.min.apply( null, xArr );
		
		// 전체 최소값 구하기
		if( alignX > boundaryInfo.minX ){
			alignX = boundaryInfo.minX;
		}
		
		boundaries.push( boundaryInfo );
		
	}
	
	// 최소 값으로 정렬
	for( var i=0; i<boundaries.length; ++i ){
		
		var object2d = boundaries[ i ].object2d;
		var minX = boundaries[ i ].minX;
		var margin = object2d.position.x - minX;
		object2d.position.x = alignX + margin;
		
	}
	
};
// 오른쪽 정렬
SmartGeoKit2D.prototype.alignRightObjects = function sgk2d_alignRightObjects( objectList ){
	
	var alignX = -Infinity;
	var boundaries = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		var boundaryInfo = {
				object2d: object2d,
				maxX: null
		};
		
		var xArr = [];
		for( var i=0; i<selectRangeX.length; ++i ){
			
			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			xArr.push( vector2.x );
			
		}
		
		// 객체의 최대값
		boundaryInfo.maxX = Math.max.apply( null, xArr );
		
		// 전체 최대값 구하기
		if( alignX < boundaryInfo.maxX ){
			alignX = boundaryInfo.maxX;
		}
		
		boundaries.push( boundaryInfo );
		
	}
	
	// 최대값으로 정렬
	for( var i=0; i<boundaries.length; ++i ){
		
		var object2d = boundaries[ i ].object2d;
		var maxX = boundaries[ i ].maxX;
		var margin = object2d.position.x - maxX;
		object2d.position.x = alignX + margin;
		
	}
	
};
// 아래쪽 정렬
SmartGeoKit2D.prototype.alignBottomObjects = function sgk2d_alignBottomObjects( objectList ){
	
	var alignY = Infinity;
	var boundaries = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		var boundaryInfo = {
				object2d: object2d,
				minY: null
		};
		
		var yArr = [];
		for( var i=0; i<selectRangeY.length; ++i ){
			
			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			yArr.push( vector2.y );
			
		}
		
		// 객체의 최소값
		boundaryInfo.minY = Math.min.apply( null, yArr );
		
		// 전체 최소값 구하기
		if( alignY > boundaryInfo.minY ){
			alignY = boundaryInfo.minY;
		}
		
		boundaries.push( boundaryInfo );
		
	}
	
	// 최소 값으로 정렬
	for( var i=0; i<boundaries.length; ++i ){
		
		var object2d = boundaries[ i ].object2d;
		var minY = boundaries[ i ].minY;
		var margin = object2d.position.y - minY;
		object2d.position.y = alignY + margin;
		
	}
	
};
// 오른쪽 정렬
SmartGeoKit2D.prototype.alignTopObjects = function sgk2d_alignTopObjects( objectList ){
	
	var alignY = -Infinity;
	var boundaries = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		var boundaryInfo = {
				object2d: object2d,
				maxY: null
		};
		
		var yArr = [];
		for( var i=0; i<selectRangeY.length; ++i ){
			
			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			yArr.push( vector2.y );
			
		}
		
		// 객체의 최대값
		boundaryInfo.maxY = Math.max.apply( null, yArr );
		
		// 전체 최대값 구하기
		if( alignY < boundaryInfo.maxY ){
			alignY = boundaryInfo.maxY;
		}
		
		boundaries.push( boundaryInfo );
		
	}
	
	// 최대값으로 정렬
	for( var i=0; i<boundaries.length; ++i ){
		
		var object2d = boundaries[ i ].object2d;
		var maxY = boundaries[ i ].maxY;
		var margin = object2d.position.y - maxY;
		object2d.position.y = alignY + margin;
	}
	
};
// 가운데 정렬
SmartGeoKit2D.prototype.alignCenterObjects = function sgk2d_alignCenterObjects( objectList ){
	
	var minX = Infinity;
	var maxX = -Infinity;
	var selectedObjects = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		for( var i=0; i<selectRangeX.length; ++i ){
			
			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			if( minX > vector2.x ){
				minX = vector2.x;
			}

			if( maxX < vector2.x ){
				maxX = vector2.x;
			}
			
		}
		
		selectedObjects.push( object2d );
		
	}
	
	// 가운데로 정렬
	var centerX = ( maxX - minX ) / 2 + minX;
	for( var i=0; i<selectedObjects.length; ++i ){
		var object2d = selectedObjects[ i ];
		object2d.position.x = centerX;
	}
	
};
// 중앙 정렬
SmartGeoKit2D.prototype.alignMiddleObjects = function sgk2d_alignMiddleObjects( objectList ){
	
	var minY = Infinity;
	var maxY = -Infinity;
	var selectedObjects = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		
		var selectRangeX = object2d.selectRange.x;
		var selectRangeY = object2d.selectRange.y;
		
		for( var i=0; i<selectRangeY.length; ++i ){
			
			var vector2 = new SmartGeoKit2D.Vector2( selectRangeX[ i ], selectRangeY[ i ] );
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			vector2.multiplyMatrix3( sM );
			vector2.multiplyMatrix3( rM );
			vector2.multiplyMatrix3( tM );
			
			if( minY > vector2.y ){
				minY = vector2.y;
			}
			
			if( maxY < vector2.y ){
				maxY = vector2.y;
			}
			
		}
		
		selectedObjects.push( object2d );
		
	}

	// 가운데로 정렬
	var centerY = ( maxY - minY ) / 2 + minY;
	for( var i=0; i<selectedObjects.length; ++i ){
		var object2d = selectedObjects[ i ];
		object2d.position.y = centerY;
	}
	
};
// 가로 간격 동일
SmartGeoKit2D.prototype.alignHorizontalObjects = function sgk2d_alignHorizontalObjects( objectList ){
	
	var minX = Infinity;
	var maxX = -Infinity;
	var selectedObjects = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		var positionX = object2d.position.x;
		
		if( minX > positionX ){
			minX = positionX;
		}
		
		if( maxX < positionX ){
			maxX = positionX;
		}
		
		selectedObjects.push( object2d );
		
	}
	
	if( selectedObjects.length < 3 ){
		return;
	}
	
	// 위치별 정렬
	selectedObjects.sort( function( a, b ){
		if( a.position.x < b.position.x ){
			return -1;
		}
		if( a.position.x > b.position.x ){
			return 1;
		}
		return 0;
	} );
	
	// 간격
	var marginX = ( maxX - minX ) / (selectedObjects.length-1);
	for( var i=0; i<selectedObjects.length; ++i ){
		var object2d = selectedObjects[ i ];
		object2d.position.x = minX + marginX * i;
	}
	
};
// 세로 간격 동일
SmartGeoKit2D.prototype.alignVerticalObjects = function sgk2d_alignVerticalObjects( objectList ){
	
	var minY = Infinity;
	var maxY = -Infinity;
	var selectedObjects = [];
	
	// 객체 별 바운더리 구하기
	for( var j=0; j<objectList.length; ++j ){
		
		var object2d = objectList[ j ];
		var positionY = object2d.position.y;
		
		if( minY > positionY ){
			minY = positionY;
		}
		
		if( maxY < positionY ){
			maxY = positionY;
		}
		
		selectedObjects.push( object2d );
		
	}
	
	if( selectedObjects.length < 3 ){
		return;
	}
	
	// 위치별 정렬
	selectedObjects.sort( function( a, b ){
		if( a.position.y < b.position.y ){
			return -1;
		}
		if( a.position.y > b.position.y ){
			return 1;
		}
		return 0;
	} );
	
	// 간격
	var marginY = ( maxY - minY ) / (selectedObjects.length-1);
	for( var i=0; i<selectedObjects.length; ++i ){
		var object2d = selectedObjects[ i ];
		object2d.position.y = minY + marginY * i;
	}
	
};