/**
	SmartGeoKit2D.Util
 **/
SmartGeoKit2D.Util = ( function(){
	
	function getInterSectionT( x1, y1, x2, y2, x3, y3, x4, y4 ){
		return ( ( x1 - x3 ) * ( y3 - y4 ) - ( y1 - y3 ) * ( x3 - x4 ) ) / 
		( ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 ) );
	}

	function getInterSectionU( x1, y1, x2, y2, x3, y3, x4, y4 ){
		return - (( ( x1 - x2 ) * ( y1 - y3 ) - ( y1 - y2 ) * ( x1 - x3 ) ) / 
				( ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 ) ));
	}
	
	// 겹침 포함
	function isIntersectionLinesWithInclude( x1, y1, x2, y2, x3, y3, x4, y4 ){
		var t = getInterSectionT( x1, y1, x2, y2, x3, y3, x4, y4 );
		var u = getInterSectionU( x1, y1, x2, y2, x3, y3, x4, y4 );
		if( 0 <= t && t <= 1 && 0 <= u && u <= 1 ){
			return true;
		}
		return false;
	}
	
	// 겹침 미포함
	function isIntersectionLines( x1, y1, x2, y2, x3, y3, x4, y4 ){
		var t = getInterSectionT( x1, y1, x2, y2, x3, y3, x4, y4 );
		var u = getInterSectionU( x1, y1, x2, y2, x3, y3, x4, y4 );
		if( 0 < t && t < 1 && 0 < u && u < 1 ){
			return true;
		}
		return false;
	}
	
	return {
		
		getObjectWorldSelectRange: function( object2d ){
			
			if( object2d.isGroup != true ){
				return {
					xArr: object2d.selectRange.x,
					yArr: object2d.selectRange.y
				};
			}
			
			var selectRangeAllX = [];
			var selectRangeAllY = [];
			
			object2d.traverse( function( object ){
				
				if( object === object2d ){
					return;
				}
				
				for( var i=0; i<object.selectRange.x.length; ++i ){
					
					var x = object.selectRange.x[ i ];
					var y = object.selectRange.y[ i ];
					var vector2 = new SmartGeoKit2D.Vector2( x, y );
					
					var parent = object;
					while( true ){
						
						var tM = parent.position.getTranslateMatrix3();
						var rM = parent.rotation.getRotateMatrix3();
						var sM = parent.scale.getScaleMatrix3();
						
						vector2.multiplyMatrix3( sM );
						vector2.multiplyMatrix3( rM );
						vector2.multiplyMatrix3( tM );
						
						parent = parent.parent;
						if( parent.isScene === true ){
							break;
						}
						
					}
					
					// TODO 카메라 회전할 경우, 선택안됨 구현필요
					
					selectRangeAllX.push( vector2.x );
					selectRangeAllY.push( vector2.y );
					
				}
				
			} );
			
			return { xArr: selectRangeAllX, yArr: selectRangeAllY };
			
		},
		getObjectSelectRange: function( object2d ){
			
			if( object2d.isGroup != true ){
				return {
					xArr: object2d.selectRange.x,
					yArr: object2d.selectRange.y
				};
			}
			
			var selectRangeAllX = [];
			var selectRangeAllY = [];
			
			object2d.traverse( function( object ){
				
				if( object === object2d ){
					return;
				}
				
				for( var i=0; i<object.selectRange.x.length; ++i ){
					
					var x = object.selectRange.x[ i ];
					var y = object.selectRange.y[ i ];
					var vector2 = new SmartGeoKit2D.Vector2( x, y );
					
					var parent = object;
					while( true ){
						
						var tM = parent.position.getTranslateMatrix3();
						var rM = parent.rotation.getRotateMatrix3();
						var sM = parent.scale.getScaleMatrix3();
						
						vector2.multiplyMatrix3( sM );
						vector2.multiplyMatrix3( rM );
						vector2.multiplyMatrix3( tM );
						
						parent = parent.parent;
						if( parent === object2d ){
							break;
						}
						
					}
					
					// TODO 카메라 회전할 경우, 선택안됨 구현필요
					
					selectRangeAllX.push( vector2.x );
					selectRangeAllY.push( vector2.y );
					
				}
				
			} );
			
			return { xArr: selectRangeAllX, yArr: selectRangeAllY };
			
		},
		getObjectWorldSelectRangeWithOutRotation: function( object2d ){
			
			var selectRangeAllX = [];
			var selectRangeAllY = [];
			
			object2d.traverse( function( object ){
				
				for( var i=0; i<object.selectRange.x.length; ++i ){
					
					var x = object.selectRange.x[ i ];
					var y = object.selectRange.y[ i ];
					var vector2 = new SmartGeoKit2D.Vector2( x, y );
					
					var parent = object;
					while( true ){
						
						var tM = parent.position.getTranslateMatrix3();
						var rM = parent.rotation.getRotateMatrix3();
						var sM = parent.scale.getScaleMatrix3();

						vector2.multiplyMatrix3( sM );
						if( parent != object2d ){
							vector2.multiplyMatrix3( rM );
						}
						vector2.multiplyMatrix3( tM );
						
						parent = parent.parent;
						if( parent.isScene === true  ){
							break;
						}
						
					}
					
					// TODO 카메라 회전할 경우, 선택안됨 구현필요
					
					selectRangeAllX.push( vector2.x );
					selectRangeAllY.push( vector2.y );
					
				}
				
			} );
			
			return { xArr: selectRangeAllX, yArr: selectRangeAllY };
			
		},
		getObjectSnapPoint: function( object2d ){
			
			var arrs = this.getObjectSelectRange( object2d );
			
			var minX = Math.min.apply( null, arrs.xArr );
			var maxX = Math.max.apply( null, arrs.xArr );
			var minY = Math.min.apply( null, arrs.yArr );
			var maxY = Math.max.apply( null, arrs.yArr );
			
			maxY = Math.max( Math.abs( minY ), Math.abs( maxY ) );
			minY = -maxY;
			centerY = 0;

			maxX = Math.max( Math.abs( minX ), Math.abs( maxX ) );
			minX = -maxX;
			centerX = 0;
			
			
			
			var sM = object2d.scale.getScaleMatrix3();
			var rM = object2d.rotation.getRotateMatrix3();
			var tM = object2d.position.getTranslateMatrix3();
			
			var lt = new SmartGeoKit2D.Vector2( minX, maxY );
			lt.multiplyMatrix3( sM );
			lt.multiplyMatrix3( rM );
			lt.multiplyMatrix3( tM );
			
			var t = new SmartGeoKit2D.Vector2( centerX, maxY );
			t.multiplyMatrix3( sM );
			t.multiplyMatrix3( rM );
			t.multiplyMatrix3( tM );
			
			var rt = new SmartGeoKit2D.Vector2( maxX, maxY );
			rt.multiplyMatrix3( sM );
			rt.multiplyMatrix3( rM );
			rt.multiplyMatrix3( tM );

			var l = new SmartGeoKit2D.Vector2( minX, centerY );
			l.multiplyMatrix3( sM );
			l.multiplyMatrix3( rM );
			l.multiplyMatrix3( tM );
			
			var c = new SmartGeoKit2D.Vector2( centerX, centerY );
			c.multiplyMatrix3( sM );
			c.multiplyMatrix3( rM );
			c.multiplyMatrix3( tM );
			
			var r = new SmartGeoKit2D.Vector2( maxX, centerY );
			r.multiplyMatrix3( sM );
			r.multiplyMatrix3( rM );
			r.multiplyMatrix3( tM );
			
			var lb = new SmartGeoKit2D.Vector2( minX, minY );
			lb.multiplyMatrix3( sM );
			lb.multiplyMatrix3( rM );
			lb.multiplyMatrix3( tM );
			
			var b = new SmartGeoKit2D.Vector2( centerX, minY );
			b.multiplyMatrix3( sM );
			b.multiplyMatrix3( rM );
			b.multiplyMatrix3( tM );
			
			var rb = new SmartGeoKit2D.Vector2( maxX, minY );
			rb.multiplyMatrix3( sM );
			rb.multiplyMatrix3( rM );
			rb.multiplyMatrix3( tM );
			
			return { c: c, l: l, r: r, t: t, b: b, lt: lt, rt: rt, lb: lb, rb: rb };
			
		},
		
		isPointInPolygon: function isPointInPolygon( dx, dy, xArr, yArr, isContainOverlap ) {

			if( isContainOverlap == null ){
				isContainOverlap = true;
			}
			
			if (xArr[0] != xArr[xArr.length-1] || yArr[0] != yArr[yArr.length-1]) {
				xArr.push(xArr[0]);
				yArr.push(yArr[0]); 		
			}

			/**
			 * 점이 선분 위에 있는가?
			 */
			var isPointOverlap = false;
			for (i=0; i<xArr.length-1; i++) {
				var x1 = xArr[ i ];
				var y1 = yArr[ i ];
				
				var x2 = xArr[ i+1 ];
				var y2 = yArr[ i+1 ];
				
				if( Math.atan2( x2-x1, y2-y1 ) === Math.atan2( x2-dx, y2-dy ) ){
					isPointOverlap = true;
					break;
				}
			}
			
			/**
			 * 점이 선분 위에 있을 때를 허용한다면?
			 */
			if( isContainOverlap === true && isPointOverlap === true ){
				return true;
			}
			
			var i=0;
			var j = xArr.length-1;
			var oddNodes = 0;
			
			for (i=0; i<xArr.length; i++) {
			   if ( (yArr[i]< dy && yArr[j]>=dy || yArr[j]< dy && yArr[i]>=dy) && (xArr[i]<=dx || xArr[j]<=dx)) {
				   oddNodes^=(xArr[i]+(dy-yArr[i])/(yArr[j]-yArr[i])*(xArr[j]-xArr[i])<dx); 
			   }
			   j=i;
			}

			
			
			/**
			 * 점이 선분 위에 있을 때를 불허하는데,
			 * 포인트가 폴리곤안에 있다고 판별되면?
			 */
			var isPointInPolygon = Boolean( oddNodes );
			if( isPointInPolygon === true && isPointOverlap === true ){
				return false;
			}
			
			return isPointInPolygon;
			  
		},
		isPolygonInPolygon: function isPolygonInPolygon( x1Arr, y1Arr, x2Arr, y2Arr, isContainOverlap ) {
			
			if (x1Arr[0] != x1Arr[x1Arr.length-1] || y1Arr[0] != y1Arr[y1Arr.length-1]) {
				x1Arr.push(x1Arr[0]);
				y1Arr.push(y1Arr[0]); 		
			}
			if (x2Arr[0] != x2Arr[x2Arr.length-1] || y2Arr[0] != y2Arr[y2Arr.length-1]) {
				x2Arr.push(x2Arr[0]);
				y2Arr.push(y2Arr[0]); 		
			}
			
			/**
			 * 1. 서로 접선이 있는지 확인
			 */
			for( var i=0; i<x1Arr.length-1; ++i ){
				
				var x1 = x1Arr[ i ];
				var y1 = y1Arr[ i ];
				var x2 = x1Arr[ i+1 ];
				var y2 = y1Arr[ i+1 ];
				
				for( var j=0; j<x2Arr.length-1; ++j ){
					
					var x3 = x2Arr[ j ];
					var y3 = y2Arr[ j ];
					var x4 = x2Arr[ j+1 ];
					var y4 = y2Arr[ j+1 ];
					
					var isInterSection = isIntersectionLines( x1, y1, x2, y2, x3, y3, x4, y4 );
					if( isInterSection === true ){
						return true;
					}
					
				}
				
			}
			
			/**
			 * 2. 점이 하나라도 포함되어있는지 판별
			 */
			for( var i=0; i<x1Arr.length; ++i ){
				var isContain = this.isPointInPolygon( x1Arr[ i ], y1Arr[ i ], x2Arr, y2Arr, isContainOverlap );
				if( isContain === true ){
					return true;
				}
			}
			for( var i=0; i<x2Arr.length; ++i ){
				var isContain = this.isPointInPolygon( x2Arr[ i ], y2Arr[ i ], x1Arr, y1Arr, isContainOverlap );
				if( isContain === true ){
					return true;
				}
			}
			
			return false;
			
		},
		
		getTextSize: (function getTextSize(){
			
			// 텍스트를 재기위한 캔버스
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			
			// @PARAM SmartGeoKit2D.Text text
			return function getTextSize( textObject2d ){
				ctx.font = "10px " + textObject2d.fontFamily;
				return ctx.measureText( textObject2d.text );
			};
			
		})()
	
	}; // return
	
} )();

