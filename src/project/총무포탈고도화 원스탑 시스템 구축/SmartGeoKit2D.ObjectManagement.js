(function(){
	
	/**
	 * 다각형 면적 구할 시 단위 계산방법
	 */
	function areaUnitCalc( vectorA, vectorB ){
		return vectorA.x * vectorB.y - vectorB.x * vectorA.y; 
	}
	
	function getSnapPoint( object2d ){
		return SmartGeoKit2D.Util.getObjectSnapPoint( object2d );
		
	}
	
	function getFn( fn ){
		if( typeof fn === "function" ){
			return fn;
		}
		return function basic(){};
	}
	
	function getObj( obj ){
		if( typeof obj === "object" ){
			return obj;
		}
		return {};
	}
	
	/**
	 * 모드 Class
	 */
	function Mode( data, fnStart, fnEnd ){
		
		this.isRun = false;
		this.fnStart = getFn( fnStart );
		this.fnEnd = getFn( fnEnd );
		this.data = getObj( data );
		
	}

	Mode.prototype.start = function(){
		this.fnStart();
		this.isRun = true;
	};

	Mode.prototype.end = function(){
		this.fnEnd();
		this.isRun = false;
	};
		
		

/**
	LayoutManagement API 생성자 함수
 **/
SmartGeoKit2D.ObjectManagement = function sgk2d_objectManagement( querySelector ) {

	/**
	 * 필요 플러그인 검증
	 */
	(function assert(){
		var require = [ 
				"SmartGeoKit2D.Selector",
				"SmartGeoKit2D.MouseControl"
			];
		for( var i=0; i<require.length; ++i ){
			var requirePlugin = require[ i ];
			var isLoaded = false;
			for( var j=0; j<SmartGeoKit2D.prototype.plugins.length; ++j ){
				var dependencyPlugin = SmartGeoKit2D.prototype.plugins[ j ];
				if( dependencyPlugin === requirePlugin ){
					isLoaded = true;
					break;
				}
			}
			if( isLoaded === false ){
				throw '"SmartGeoKit2D.ObjectManagement" depends on "'+requirePlugin+'" plugin.';
			}
		}
			
	})();
	
	/**
	 * 전역 객체
	 */
//	window.global = {};
	var global = {};
	
	/**
	 * 전체 배경화면 사용 여부
	 */
	global.useBackgroundEffect = true;
	
	/**
	 * 클래스 목록 ( 사용자 정의 아이콘 )
	 */
	global.classList = {
			/**
			 * className: Image
			 */
	};
	
	/**
	 * 전체 화면 카메라
	 */
	global.fullScreenCamera = new SmartGeoKit2D.Camera();
	
	/**
	 * 2D 엔진
	 * 	viewEngine: 사용자가 실제로 보는 엔진 ( 이미지로 표현 )
	 * 	ghostEngine: 속도향상을 위한 눈속임 엔진 ( 객체를 관리, viewEngine에 이미지 전달 )
	 */
	global.sgk2dDraw = (function ( querySelector ){
		var sgk2dDraw = new SmartGeoKit2D( querySelector );
		sgk2dDraw.renderer.canvas.style.display = "none";
		sgk2dDraw.enableMouseControl();
		sgk2dDraw.disableMousearea();
		sgk2dDraw.disableMouserotate();
		sgk2dDraw.setCSD( 1 );
		sgk2dDraw.setBackgroundColor( "#cccccc" );

		// 한번만 렌더링
		sgk2dDraw.oneRender = function( callback ){
			
			/**
			 * 전체화면 스크린샷
			 */
			var minX = Infinity;
			var minY = Infinity;
			var maxX = -Infinity;
			var maxY = -Infinity;

			function multiply( vector2, object2d ){
				var sM = object2d.scale.getScaleMatrix3();
				var rM = object2d.rotation.getRotateMatrix3();
				var tM = object2d.position.getTranslateMatrix3();
				vector2.multiplyMatrix3( sM );
				vector2.multiplyMatrix3( rM );
				vector2.multiplyMatrix3( tM );
			}
			
			// 현재 객체로부터 상위 matrix를 순서대로 전부 포함 SRT
			sgk2dDraw.scene.traverse(function( object ){
				
				// 도형 여부 판단
				if( object.isShape === true ){
					
					var xArr = object.selectRange.x;
					var yArr = object.selectRange.y;
					var vArr = [];
					for( var i=0; i<xArr.length; ++i ){
						vArr.push( new SmartGeoKit2D.Vector2( xArr[i], yArr[i] ) );
					}
					
					var parent = object;
					while( true ){
						
						if( parent == null ){
							break;
						}
						
						for( var i=0; i<vArr.length; ++i ){
							multiply( vArr[ i ], parent );
						}

						parent = parent.parent;
						
					}
					
					for( var i=0; i<vArr.length; ++i ){
						var vector2 = vArr[ i ];
						if( minX > vector2.x ){
							minX = vector2.x;
						}
						if( minY > vector2.y ){
							minY = vector2.y;
						}
						if( maxX < vector2.x ){
							maxX = vector2.x;
						}
						if( maxY < vector2.y ){
							maxY = vector2.y;
						}
					}
					
				}
				
			});
			
			var w = sgk2dDraw.renderer.canvas.width;
			var h = sgk2dDraw.renderer.canvas.height;

			var positionX = ( maxX + minX ) / 2;
			var positionY = ( maxY + minY ) / 2;
			
			var scaleX = w / ( maxX - minX );
			var scaleY = h / ( maxY - minY );
			
			var minZoom = Math.min( scaleX, scaleY );
			var zoom = minZoom - minZoom/10;
			
			global.fullScreenCamera.position.x = positionX;
			global.fullScreenCamera.position.y = positionY;
			global.fullScreenCamera.scale.set( zoom, zoom );
			
			var fixedSizeObjArr = [];
			for( var i=0; i<sgk2dDraw.scene.children.length; ++i ){
				var obj = sgk2dDraw.scene.children[ i ];
				if( obj.isFixedSize === true ){
					obj.originalScaleX = obj.scale.x;
					obj.originalScaleY = obj.scale.y;
					obj.scale.x /= sgk2dDraw.camera.scale.x;
					obj.scale.y /= sgk2dDraw.camera.scale.x;
					obj.isFixedSize = false;
					fixedSizeObjArr.push( obj );
				}
			}
			sgk2dDraw.renderer.render( global.fullScreenCamera, sgk2dDraw.scene );
			for( var i=0; i<fixedSizeObjArr.length; ++i ){
				var obj = fixedSizeObjArr[ i ];
				obj.scale.x = obj.originalScaleX;
				obj.scale.y = obj.originalScaleY;
				obj.isFixedSize = true;
				delete obj.originalScaleX;
				delete obj.originalScaleY;
			}
			
			global.sgk2dView.bg.scale.set( w/zoom, h/zoom );
			global.sgk2dView.bg.position.set( positionX, positionY );
			
			if( global.useBackgroundEffect == true ){
				global.sgk2dView.bg.image.src = sgk2dDraw.renderer.canvas.toDataURL();
			}
			sgk2dDraw.renderer.render( sgk2dDraw.camera, sgk2dDraw.scene );
			
			if( typeof callback === "function" ){
				callback();
			}
			
		};
		return sgk2dDraw;
	})( querySelector ); // ghost
	
	global.sgk2dView = (function createsgk2dDraw( querySelector ){
		var sgk2dView = new SmartGeoKit2D( querySelector );

		sgk2dView.run();
		sgk2dView.enableMouseControl();
		sgk2dView.disableMouserotate();
		
		// 배경 객체 추가
		var bg = sgk2dView.addRectangle( "bg" );
		bg.isBackground = true;
		bg.fillStyle = "rgba(0,0,0,0)";
		bg.image = new Image();
		bg.isScan = false;
		
		// 현재 화면
		var view = sgk2dView.addRectangle( "view" );
		view.image = global.sgk2dDraw.renderer.canvas;
		view.fillStyle = "rgba(0,0,0,0)";
		view.isScan = false;
		view.isView = true;
		
		var Mouse = {
				downButton: null
		};
		sgk2dView.timeoutId = null;
		sgk2dView.isUpdating = function(){
			return sgk2dView.timeoutId != null;
		};
		
		var updateCallbackList = [];
		
		sgk2dView.update = function update( callback, time ){
			clearTimeout( sgk2dView.timeoutId );

			if( time == null ){
				time = 500;
			}
			
			if( typeof callback === "function" ){
				updateCallbackList.push( callback );
			}
			
			sgk2dView.timeoutId = setTimeout( function(){
				var cameraXy = sgk2dView.getCameraXy();
				var zoom = sgk2dView.getCameraZoom();
				view.position.set( cameraXy.x, cameraXy.y );
				view.scale.set( sgk2dView.renderer.canvas.width / zoom, sgk2dView.renderer.canvas.height / zoom );
				global.sgk2dDraw.oneRender();
				sgk2dView.timeoutId = null;
				
				while( true ){
					var updateCallback = updateCallbackList.shift();
					if( updateCallback == null ){
						break;
					}
					updateCallback();
				}
				
				
			}, time );
		}; 
		
		sgk2dView.on("mousedown", function( e ){
			Mouse.downButton = e.button;
			if( Mouse.downButton === 2 ){
				sgk2dView.update();
			}
		});
		sgk2dView.on("mousemove", function( e, x, y ){
			// 이동
			if( Mouse.downButton === 2 ){
				sgk2dView.update();
			}
		});
		sgk2dView.on("mouseup", function( e, x, y ){
			// 이동
			Mouse.downButton = null;
			if( Mouse.downButton === 2 ){
				sgk2dView.update();
			}
		});
		sgk2dView.on("mousewheel", function(){
			sgk2dView.update();
		});
		
		sgk2dView.bg = bg;
		return sgk2dView;
	})( querySelector ); // view
	
	global.api = {
			setSelectOption: function( options ){
				global.sgk2dView.setSelectOption( options );
			},
			getInstancesBySelect: function(){
				return global.sgk2dView.getObjectsByHandle();
			},
			selectInstanceById: function( id ){
			
				if( global.mode.isRun( "transformMode" ) === false ){
					return;
				}
				
				var selectObject = global.sgk2dView.getObjectById( id );
				if( selectObject == null ){
					selectObject = global.sgk2dDraw.getObjectById( id );
					global.sgk2dView.addObject( selectObject );
					global.sgk2dView.update( null, 0 );
				}

				global.sgk2dView.selectObject(  selectObject );
				
			},
			
			unSelectInstanceById: function( id ){
				
				var selectObject = global.sgk2dView.getObjectById( id );
				if( selectObject == null ){
					selectObject = global.sgk2dDraw.getObjectById( id );
					if( selectObject == null ){
						return;
					}
					global.sgk2dView.addObject( selectObject );
					global.sgk2dView.update( null, 0 );
				}
				
				global.sgk2dView.unSelectObject(  selectObject );
				
			},
			unSelectInstancesAll: function(){
				global.sgk2dView.unSelectObjectAll();
			}
			
	};
	
	/**
	 * 모드 목록
	 */
	global.mode = {
			viewMode: new Mode( 

					// 모드 데이터
					{
						viewEventIdList: [], // viewer의 이벤트 아이디 목록
						onMousedown: function( e, x, y ){},
						onMousemove: function( e, x, y ){},
						onMouseup: function( e, x, y ){},
						onMousewheel: function( e, type ){},
						object: null,
					},
					
					function start(){

						global.sgk2dView.disableMousearea();
						
						var mode = this;
						mode.data.viewEventIdList.push(
								global.sgk2dView.on("mousedown", function( e, x, y ){
									mode.data.onMousedown( e, x, y );
								})
						);
						mode.data.viewEventIdList.push(
								global.sgk2dView.on("mousemove", function( e, x, y ){
									mode.data.onMousemove( e, x, y );
								})
						);
						mode.data.viewEventIdList.push(
								global.sgk2dView.on("mouseup", function( e, x, y ){
									mode.data.onMouseup( e, x, y );
								})
						);
						mode.data.viewEventIdList.push(
								global.sgk2dView.on("mousewheel", function( e, type ){
									mode.data.onMousewheel( e, type );
								})
						);
						
					},
					function end(){
						
						// 기본 모드 종료 조건 : 객체가 선택
						// 반드시 다음 모드는 선택 모드
						
						var mode = this;
						for( var i=0; i<mode.data.viewEventIdList.length; ++i ){
							var id = mode.data.viewEventIdList[ i ];
							global.sgk2dView.off( id );
						}
						
					}
				),
				collocateMode: new Mode( 

						// 모드 데이터
						{
							viewEventIdList: [], // viewer의 이벤트 아이디 목록
							objects: [], // 마우스를 따라다닐 객체
							objectsOffset: [],
							onMousedown: function( e, x, y ){},
							onMousemove: function( e, x, y ){},
							onMouseup: function( e, x, y ){},
							onMousewheel: function( e, type ){}
						},
						
						function start(){
							
							var mode = this;
							var minX = Infinity;
							var minY = Infinity;
							var maxX = -Infinity;
							var maxY = -Infinity;
							
							for( var i=0; i<mode.data.objects.length; ++i ){
								var object = mode.data.objects[ i ];
								global.sgk2dView.addObject( object );
								
								if( object.position.x < minX ){
									minX = object.position.x;
								}
								if( object.position.y < minY ){
									minY = object.position.y;
								}
								if( object.position.x > maxX ){
									maxX = object.position.x;
								}
								if( object.position.y > maxY ){
									maxY = object.position.y;
								}
								
							}
							
							var centerX = ( maxX + minX ) / 2;
							var centerY = ( maxY + minY ) / 2;
							for( var i=0; i<mode.data.objects.length; ++i ){
								
								var object = mode.data.objects[ i ];
								var offsetX = object.position.x - centerX;
								var offsetY = object.position.y - centerY;
								var offsetV = new SmartGeoKit2D.Vector2( offsetX, offsetY );
								mode.data.objectsOffset.push( offsetV );
								
							}
							
							var xy = global.sgk2dView.getMouseXy();
							for( var i=0; i<mode.data.objects.length; ++i ){
								var object = mode.data.objects[ i ];
								var offsetV = mode.data.objectsOffset[ i ];
								object.position.x = xy.x + offsetV.x;
								object.position.y = xy.y + offsetV.y;
							}
							
							global.sgk2dView.disableMousearea();
							
							
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mousedown", function( e, x, y ){
										mode.data.onMousedown( e, x, y );
									})
							);
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mousemove", function( e, x, y ){
										for( var i=0; i<mode.data.objects.length; ++i ){
											var object = mode.data.objects[ i ];
											var offsetV = mode.data.objectsOffset[ i ];
											object.position.x = x + offsetV.x;
											object.position.y = y + offsetV.y;
										}
										mode.data.onMousemove( e, x, y );
									})
							);
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mouseup", function( e, x, y ){
										mode.data.onMouseup( e, x, y );
									})
							);
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mousewheel", function( e, type ){
										mode.data.onMousewheel( e, type );
									})
							);
							
						},
						function end(){
							
							// 기본 모드 종료 조건 : 객체가 선택
							// 반드시 다음 모드는 선택 모드
							
							var mode = this;
							for( var i=0; i<mode.data.viewEventIdList.length; ++i ){
								var id = mode.data.viewEventIdList[ i ];
								global.sgk2dView.off( id );
							}
							
							mode.data.objects = [];
							mode.data.objectsOffset = [];
							mode.data.viewEventIdList = [];
							
						}
					),
					transformMode: new Mode( 

							// 모드 데이터
							{
								viewEventIdList: [], // viewer의 이벤트 아이디 목록
								handle: null,
								originScale: null, // SmartGeoKit2D.Vector2
								beforeXy: new SmartGeoKit2D.Vector2(),
								isChange: false, // 변경 여부
								Mouse: {
									button: null,
								},
								originalData: {
									// SmartGeoKit2D.Object2D
								},
								
								enableSnap: true,
								snapLineX: [],
								snapLineY: [],
								snapLineList: [],
								
								// 이전 움직임에서 스냅 처리했었는가?
								beforeSnap: { x: 0, y: 0 },
								snapMoved: new SmartGeoKit2D.Vector2(),
							
								onMousedown: function( e, x, y ){},
								onMousemove: function( e, x, y ){},
								onMouseup: function( e, x, y ){},
								onSelect: function( objects ){}
								
							},
							
							function start(){
								
								var mode = this;
								global.sgk2dView.enableMousearea();

								
								var objects = global.sgk2dView.getObjectsByHandle();
								function makeSnapLine( object2d, selectedObjects ){
									
									if( mode.data.snapLineX.length > 0 ){
										return;
									}
									if( mode.data.snapLineY.length > 0 ){
										return;
									}
									
									var boundary = global.sgk2dView.getCameraBoundary();
									var xArr = [ boundary.LEFT_BOTTOM.x, boundary.RIGHT_BOTTOM.x, boundary.RIGHT_TOP.x, boundary.LEFT_TOP.x, boundary.LEFT_BOTTOM.x ];
									var yArr = [ boundary.LEFT_BOTTOM.y, boundary.RIGHT_BOTTOM.y, boundary.RIGHT_TOP.y, boundary.LEFT_TOP.y, boundary.LEFT_BOTTOM.y ];
									var drawObjects = global.sgk2dDraw.getObjectsByPolygon( xArr, yArr );
									var viewObjects = global.sgk2dView.getObjectsByPolygon( xArr, yArr );
									var objects = viewObjects.concat( drawObjects );
									
									makeSnapArr:
									for( var i=0; i<objects.length; ++i ){
										var object = objects[ i ];
										if(object.isHandle === true){
											continue makeSnapArr;
										}
										if(object === object2d){
											continue makeSnapArr;
										}
										if( object.isSnapLine === true ){
											continue makeSnapArr;
										}
										for( var j=0; j<selectedObjects.length; ++j ){
											if( selectedObjects[ j ] === object ){
												continue makeSnapArr;
											}
										}
										
										var objectSnap = getSnapPoint( object );
										for( var objectSnapKey in objectSnap ){
											var objectPoint = objectSnap[ objectSnapKey ];
											mode.data.snapLineX.push( objectPoint.x );
											mode.data.snapLineY.push( objectPoint.y );
										}
									}
									
								}
								
								/**
								 * 엔진 이벤트 등록
								 */
								mode.data.viewEventIdList.push(
										global.sgk2dView.on("mousearea", function( e, minX, minY, maxX, maxY ){
											
											var xArr = [ minX, maxX, maxX, minX, minX ];
											var yArr = [ minY, minY, maxY, maxY, minY ];
											
											var selectedObjectCnt = 0;
											var objects = global.sgk2dView.getObjectsByPolygon( xArr, yArr );
											for( var i=0; i<objects.length; ++i ){
												selectedObjectCnt++;
												
												// draw객체를 view에서 표현
												global.sgk2dView.selectObject( objects[i] );
											}
											
											var objects = global.sgk2dDraw.getObjectsByPolygon( xArr, yArr );
											for( var i=0; i<objects.length; ++i ){
												selectedObjectCnt++;
												
												// draw객체를 view에서 표현
												global.sgk2dView.addObject( objects[i] );
												
												////////////신명철
												global.sgk2dView.selectObject( objects[i] );
											}
											
											if( selectedObjectCnt > 0 ){
												global.sgk2dView.update();
												mode.data.onSelect( global.sgk2dView.getObjectsByHandle() );
											}else{
												mode.data.onSelect([]);
											}
											
										})
									);
								
								mode.data.viewEventIdList.push( 
										global.sgk2dView.on("mousedown", function( e, x, y ){
											
											mode.data.onMousedown( e, x, y );
											mode.data.Mouse.button = e.button;
											
											if( mode.data.Mouse.button != 0 ){
												return;
											}
											
											// 핸들선택여부
											var isHandleClicked = (function(){
												var objects = global.sgk2dView.getObjectsByXy( x, y, true );
												for( var i=0; i<objects.length; ++i ){
													if( objects[ i ].isHandle === true ){
														return true;
													}
												}
												return false;
											})();
											
											var objects = global.sgk2dView.getObjectsByXy( x, y );
											var beforeSelectedObjects = global.sgk2dView.getObjectsByHandle();
											
											if( e.button === 0 && beforeSelectedObjects.length === 0 ){
												global.sgk2dView.unSelectObjectAll();
											}
											
											// 이전에 선택되었던 객체인가?
											var beforeSelected = (function(){
												
												for( var i=0; i<beforeSelectedObjects.length; ++i ){
													var beforeObject = beforeSelectedObjects[ i ];
													for( var j=0; j<objects.length; ++j ){
														var nowObject = objects[ j ];
														if( nowObject === beforeObject ){
															return true;
														}
														if( nowObject.selectTarget === beforeObject ){
															return true;
														}
													}
												}
												
												return false;
												
											})();
											
											// 이전에 선택된 객체가 아니었다면 선택 제거
											if( beforeSelected === false ){
												global.sgk2dView.unSelectObjectAll();
												global.sgk2dView.enableMousearea();
											}else{
												global.sgk2dView.disableMousearea();
											}
											
											(function addSelectObject(){
												
												if( isHandleClicked === true ){
													return;
												}
												
												var drawObjects = global.sgk2dDraw.getObjectsByXy( x, y );
												for( var i=0; i<drawObjects.length; ++i ){
													
													// draw객체를 view에서 표현
													global.sgk2dView.addObject( drawObjects[i] );
													global.sgk2dView.selectObject( drawObjects[i] );
												}
												if( drawObjects.length > 0 ){
													global.sgk2dView.update( null, 0 );
												}
												
												if( objects.length > 0 ){
													
													target = null;
													for( var i=0; i<objects.length; ++i ){
														target = objects[ i ];
														break;
													}
													
													if( target == null ){
														return;
													}
													
													global.sgk2dView.selectObject( target );
												}
											})();
											
											// 클릭된 객체가 없다면 모드 종료
											var detailObjects = global.sgk2dView.getObjectsByXy( x, y, true );
											var isObjectSelected = (function(){
												for( var i=0; i<detailObjects.length; ++i ){
													return true;
												}
												return false;
											})();
											
											if( isObjectSelected === false ){
												mode.data.onSelect([]);
												return;
											}
											
											global.sgk2dView.disableMousearea();
											
											var handle = null;
											var hasPoly = false;
											for( var i=0; i<detailObjects.length; ++i ){
												if( detailObjects[ i ].isPolygon === true ){
													hasPoly = true;
												}
												if( detailObjects[ i ].isPolyline === true ){
													hasPoly = true;
												}
												if( detailObjects[ i ].isHandle === true ){
													handle = detailObjects[ i ];
													break;
												}
											}
											
											if( handle == null ){
												
												if( hasPoly === true ){
													mode.data.onSelect(global.sgk2dView.getObjectsByXy( x, y ));
													return;
												}
												
												return;
											}
											
											// 처음 선택되는 객체는 무조건 이동으로 판정
											if( beforeSelected === false && handle.handleType != "PANEL" ){
												handle = handle.parent.panel;
											}

											var selectedObjects = global.sgk2dView.getObjectsByHandle();
											for( var i=0; i<selectedObjects.length; ++i ){
												var selectedObject = selectedObjects[i];
												mode.data.originalData[ selectedObject.id ] = {
														object2d: selectedObject,
														position: selectedObject.position.clone(),	
														rotation: selectedObject.rotation.clone(),	
														scale: selectedObject.scale.clone(),
													};
											}
											
											mode.data.onSelect( selectedObjects );
											
											mode.data.handle = handle;
											mode.data.originScale = handle.scale.clone();
											mode.data.beforeXy.x = x;
											mode.data.beforeXy.y = y;
											
										})
								);
								mode.data.viewEventIdList.push( 
										global.sgk2dView.on("mousemove", function( e, x, y ){
											
											mode.data.onMousemove( e, x, y );
											
											if( mode.data.handle == null ){
												return;
											}
											
											mode.data.isChange = true;
												
											var handleType = mode.data.handle.handleType;
											var object2d = mode.data.handle.selectTarget;
											var pos = mode.data.handle.selectTarget.position;
											
											switch( mode.data.handle.handleType ){
											
												case "POINT": {
													
													var vi = new SmartGeoKit2D.Vector2( x, y );
													var siM = object2d.scale.getScaleMatrix3().getInverseMatrix3();
													var riM = object2d.rotation.getRotateMatrix3().getInverseMatrix3();
													var tiM = object2d.position.getTranslateMatrix3().getInverseMatrix3();
													vi.multiplyMatrix3( tiM );
													vi.multiplyMatrix3( riM );
													vi.multiplyMatrix3( siM );
													
													
													var v = new SmartGeoKit2D.Vector2( x, y );
													var sM = object2d.scale.getScaleMatrix3();
													var rM = object2d.rotation.getRotateMatrix3();
													var tM = object2d.position.getTranslateMatrix3();
													v.multiplyMatrix3( sM );
													v.multiplyMatrix3( rM );
													v.multiplyMatrix3( tM );
													
													object2d.calcPathX[ mode.data.handle.handlePathIdx ] = vi.x;
													object2d.calcPathY[ mode.data.handle.handlePathIdx ] = vi.y;
													global.sgk2dView.unSelectObject( object2d );
													object2d.updateCenterPosition();
													global.sgk2dView.selectObject( object2d );
													
													break;
												}
											
												case "ROTE": {
													var beforeRadians = Math.atan2( 
															mode.data.beforeXy.y - object2d.position.y, 
															mode.data.beforeXy.x - object2d.position.x 
														);
													
													var nowRadians = Math.atan2(
															y - object2d.position.y,
															x - object2d.position.x
														);
													
													var minus = nowRadians - beforeRadians;
													global.sgk2dView.rotateObjectsByHandle( minus );
													mode.data.beforeXy.x = x;
													mode.data.beforeXy.y = y;
													break;
												}
												
												case "PANEL": {
													var selectedObjects = global.sgk2dView.getObjectsByHandle();
													
													var isXSnap = false;
													var isYSnap = false;
													var movedX = x - mode.data.beforeXy.x;
													var movedY = y - mode.data.beforeXy.y;
													
													makeSnapLine( object2d, selectedObjects );
													
													for( var i=0; i<mode.data.snapLineList.length; ++i ){
														global.sgk2dView.removeObject( mode.data.snapLineList[ i ] );
													}

													if( mode.data.enableSnap === true ){
														
														var boundary = global.sgk2dView.getCameraBoundary();
														var minX = Infinity;
														var minY = Infinity;
														var maxX = -Infinity;
														var maxY = -Infinity;
														for( var pointName in boundary ){
															var point = boundary[ pointName ];
															if( point.x < minX ){
																minX = point.x;
															}
															if( point.y < minY ){
																minY = point.y;
															}
															if( point.x > maxX ){
																maxX = point.x;
															}
															if( point.y > maxY ){
																maxY = point.y;
															}
														}
														var width = maxX - minX;
														var height = maxY - minY;
														
														// 객체 포인트
														var snapPoint = getSnapPoint( object2d );
														var snapScale = Math.max( width, height );
														var snapXarr = mode.data.snapLineX;
														var snapYarr = mode.data.snapLineY;
														
														xSnapCheck:
															for( var key in snapPoint ){
																for( var i=0; i<snapXarr.length; ++i ){
																	var snapLineX = snapXarr[ i ];
																	var objectSnapPoint = snapPoint[ key ];
																	if( objectSnapPoint.x - 5 / global.sgk2dView.camera.scale.x < snapLineX ){
																		if( snapLineX < objectSnapPoint.x + 5 / global.sgk2dView.camera.scale.x ){
																			if( Math.abs( x - mode.data.beforeXy.x ) < 10 / global.sgk2dView.camera.scale.x ){
																				var snapLine = global.sgk2dView.addLine("sgk2dView.snapLineX:" + snapLineX );
																				snapLine.isSnapLine = true;
																				snapLine.scale.set( snapScale, snapScale );
																				snapLine.rotation.set( Math.PI / 2, Math.PI / 2 );
																				snapLine.position.set( snapLineX, (maxY-minY)/2 + minY )
																				snapLine.strokeStyle = "#ff0000";
																				mode.data.snapLineList.push( snapLine );
																				movedX = snapLineX - objectSnapPoint.x;
																				isXSnap = true;
																				break xSnapCheck;
																			}
																		}
																	}
																}
															}
														ySnapCheck:
															for( var key in snapPoint ){
																for( var i=0; i<snapYarr.length; ++i ){
																	var snapLineY = snapYarr[ i ];
																	var objectSnapPoint = snapPoint[ key ];
																	if( snapLineY - 5 / global.sgk2dView.camera.scale.y < objectSnapPoint.y ){
																		if( objectSnapPoint.y < snapLineY + 5 / global.sgk2dView.camera.scale.y ){
																			if( Math.abs( y - mode.data.beforeXy.y ) < 10 / global.sgk2dView.camera.scale.y ){
																				var snapLine = global.sgk2dView.addLine("sgk2dView.snapLineY:" + snapLineY );
																				snapLine.isSnapLine = true;
																				snapLine.scale.set( snapScale, snapScale );
																				snapLine.position.set( (maxX-minX)/2 + minX, snapLineY )
																				snapLine.strokeStyle = "#ff0000";
																				mode.data.snapLineList.push( snapLine );
																				movedY = snapLineY - objectSnapPoint.y;
																				isYSnap = true;
																				break ySnapCheck;
																			}
																		}
																	}
																}
															}
													}
													
													
													global.sgk2dView.moveObjectsByHandle( movedX, movedY );
													
													if( isXSnap === false && isYSnap === false ){
														mode.data.beforeXy.x = x;
														mode.data.beforeXy.y = y;
													}else if( isXSnap === false && isYSnap === true ){
														mode.data.beforeXy.x = x;
														mode.data.beforeXy.y += movedY;
													}else if( isXSnap === true && isYSnap === false ){
														mode.data.beforeXy.y = y;
														mode.data.beforeXy.x += movedX;
													}else{
														mode.data.beforeXy.y += movedY;
														mode.data.beforeXy.x += movedX;
													}
													break;
												}
												
												case "L": {
													
													var objectSnap = getSnapPoint( object2d );
													
													var l = objectSnap.l;
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = mode.data.handle.parent.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = mode.data.handle.parent.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													l.multiplyMatrix3( itM );
													l.multiplyMatrix3( irM );

													
													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - l.x;
													global.sgk2dView.scaleObjectsByHandleL( -movedX );
													break;
												}
												
												case "R": {
													
													var objectSnap = getSnapPoint( object2d );
													var r = objectSnap.r;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													r.multiplyMatrix3( itM );
													r.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - r.x;
													global.sgk2dView.scaleObjectsByHandleR( movedX );
													break;
												}
												
												case "T": {

													var objectSnap = getSnapPoint( object2d );
													var t = objectSnap.t;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													t.multiplyMatrix3( itM );
													t.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedY = pointer.y - t.y;
													global.sgk2dView.scaleObjectsByHandleT( movedY );
													break;
												}
												
												case "B": {

													var objectSnap = getSnapPoint( object2d );
													var b = objectSnap.b;
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													b.multiplyMatrix3( itM );
													b.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedY = pointer.y - b.y;
													global.sgk2dView.scaleObjectsByHandleB( -movedY );
													break;
												}
								
												case "LT": {

													var objectSnap = getSnapPoint( object2d );
													var lt = objectSnap.lt;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													lt.multiplyMatrix3( itM );
													lt.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - lt.x;
													var movedY = pointer.y - lt.y;
													
													global.sgk2dView.scaleObjectsByHandleT( movedY );
													global.sgk2dView.scaleObjectsByHandleL( -movedX );
													break;
												}
								
												case "RT": {

													var objectSnap = getSnapPoint( object2d );
													var rt = objectSnap.rt;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													rt.multiplyMatrix3( itM );
													rt.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - rt.x;
													var movedY = pointer.y - rt.y;
													
													global.sgk2dView.scaleObjectsByHandleT( movedY );
													global.sgk2dView.scaleObjectsByHandleR( movedX );
													break;
												}
								
												case "LB": {

													var objectSnap = getSnapPoint( object2d );
													var lb = objectSnap.lb;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													lb.multiplyMatrix3( itM );
													lb.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - lb.x;
													var movedY = pointer.y - lb.y;
													
													global.sgk2dView.scaleObjectsByHandleB( -movedY );
													global.sgk2dView.scaleObjectsByHandleL( -movedX );
													break;
												}
								
												case "RB": {

													var objectSnap = getSnapPoint( object2d );
													var rb = objectSnap.rb;
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// lt의 스케일값만 확인
													rb.multiplyMatrix3( itM );
													rb.multiplyMatrix3( irM );

													// pointer의 스케일값만 확인
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													
													var movedX = pointer.x - rb.x;
													var movedY = pointer.y - rb.y;
													
													global.sgk2dView.scaleObjectsByHandleB( -movedY );
													global.sgk2dView.scaleObjectsByHandleR( movedX );
													break;
												}
												
												case "x": {
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
												
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();

//													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();

													// 역행렬 조회
													var sM = object2d.scale.getScaleMatrix3();
													var isM = sM.getInverseMatrix3();
													
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													pointer.multiplyMatrix3( isM );
													
													mode.data.handle.position.x = pointer.x;
													mode.data.handle.selectTargetPoint.x = pointer.x;
													
													break;
													
												}
												
												case "y": {
													
													var pointer = new SmartGeoKit2D.Vector2( x, y );
													
													// 역행렬 조회
													var tM = object2d.position.getTranslateMatrix3();
													var itM = tM.getInverseMatrix3();
													
													// 역행렬 조회
													var rM = object2d.rotation.getRotateMatrix3();
													var irM = rM.getInverseMatrix3();
													
													// 역행렬 조회
													var sM = object2d.scale.getScaleMatrix3();
													var isM = sM.getInverseMatrix3();
													
													pointer.multiplyMatrix3( itM );
													pointer.multiplyMatrix3( irM );
													pointer.multiplyMatrix3( isM );
													
													mode.data.handle.position.y = pointer.y;
													mode.data.handle.selectTargetPoint.y = global.sgk2dView.scene.CSD.y * pointer.y;
													
													break;
													
												}
											
											} // end - switch( handleType )

									
										})
								);
								
								mode.data.viewEventIdList.push(
										global.sgk2dView.on("mouseup", function( e, x, y ){

											mode.data.onMouseup( e, x, y );
											
											mode.data.snapLineX = [];
											mode.data.snapLineY = [];
											
											mode.data.Mouse.button = null;
											
											for( var i=0; i<mode.data.snapLineList.length; ++i ){
												global.sgk2dView.removeObject( mode.data.snapLineList[i] );
											}
											
											mode.data.originalData = {};
											mode.data.handle = null;
											mode.data.snapLineList = [];
											
										})
								);

								mode.data.viewEventIdList.push(
										global.sgk2dView.on("mousewheel", function( e, type, zoom ){

											var objs = global.sgk2dView.getObjectsByHandle();
											for( var i=0; i<objs.length; ++i ){
												var obj = objs[ i ];
												if( obj.isFixedSize === true ){
													global.sgk2dView.unSelectObject( obj );
													global.sgk2dView.selectObject( obj );
												}
											}
											
										})
								);
								
								
							},
							function end(){
								
								/**
								 * 모드종료 조건 - 선택이 아무것도 없을 때
								 * 반드시 다음 모드는 BasicMode
								 */
								
								
								var mode = this;
								
								global.sgk2dView.enableMousearea();
								
								// 엔진 이벤트 제거
								for( var i=0; i<mode.data.viewEventIdList.length; ++i ){
									var id = mode.data.viewEventIdList[ i ];
									global.sgk2dView.off( id );
								}
								
								var object2dList = [];
								global.sgk2dView.unSelectObjectAll();
								for( var i=global.sgk2dView.scene.children.length-1; -1<i; --i ){
									var object2d = global.sgk2dView.scene.children[ i ];
									if( object2d.id === "bg" ){
										continue;
									}
									if( object2d.id === "dwg" ){
										continue;
									}
									if( object2d.id === "view" ){
										continue;
									}
									if( object2d.isHandle === true ){
										continue;
									}
									global.sgk2dDraw.addObject( object2d );
								}
								
								global.sgk2dView.stop();
								global.sgk2dView.update(function(){
									global.sgk2dView.run();
								});
								
							}
						), // transformMode
						drawDragMode: new Mode(// 모드 데이터
						{
							viewEventIdList: [], // viewer의 이벤트 아이디 목록
							object: null, // 마우스를 따라다닐 객체
							isDrag: false,
							onMousedown: function( e, x, y ){},
							onMousemove: function( e, x, y ){},
							onMouseup: function( e, x, y ){},
							startXy: new SmartGeoKit2D.Vector2(),
						},
						
						function start(){
							
							var mode = this;

							if( mode.data.object != null ){
								mode.data.object.scale.set( 0, 0 );
								global.sgk2dView.addObject( mode.data.object );
							}
							
							global.sgk2dView.disableMousearea();
							
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mousedown", function( e, x, y ){
										
										mode.data.isDrag = true;
										mode.data.startXy.x = x;
										mode.data.startXy.y = y;
										mode.data.onMousedown( e, x, y );
									})
							);
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mousemove", function( e, x, y ){
										
										if( mode.data.isDrag === false ){
											return;
										}
										
										if( mode.data.object != null ){
											var posX = ( mode.data.startXy.x + x ) / 2;
											var posY = ( mode.data.startXy.y + y ) / 2;
											mode.data.object.position.set( posX, posY );
											
											var scaleX = x - mode.data.startXy.x;
											var scaleY = y - mode.data.startXy.y;
											mode.data.object.scale.set( scaleX, scaleY );
										}
										mode.data.onMousemove( e, x, y );
									})
							);
							mode.data.viewEventIdList.push(
									global.sgk2dView.on("mouseup", function( e, x, y ){
										
										if( mode.data.isDrag === false ){
											return;
										}
										
										mode.data.isDrag = false;
										mode.data.onMouseup( e, mode.data.startXy.x, mode.data.startXy.y, x, y );
										mode.data.object.scale.set( 0, 0 );
									})
							);
						},
						function end(){
							
							// 기본 모드 종료 조건 : 객체가 선택
							// 반드시 다음 모드는 선택 모드
							
							var mode = this;
							for( var i=0; i<mode.data.viewEventIdList.length; ++i ){
								var id = mode.data.viewEventIdList[ i ];
								global.sgk2dView.off( id );
							}
							
							global.sgk2dView.removeObject( mode.data.object );
							mode.data.isDrag = false;
							mode.data.viewEventIdList = [];
							
						}
					)// drawDragMode
	};
	Object.defineProperties( global.mode, {
		"stop": {
			enumerable: false,
			value: function(){
				for( var modeName in global.mode ){
					var mode = global.mode[ modeName ];
					if( mode.isRun === true ){
						mode.end();
						break;
					}
				}
			}
		},
		"isRun": {
			enumerable: false,
			value: function(){
				for( var i=0; i<arguments.length; ++i ){
					var mode = global.mode[ arguments[i] ];
					if( mode.isRun === true ){
						return true;
					}
				}
				return false;
			}
		}
	} );
	
	return Object.create( SmartGeoKit2D.ObjectManagement.prototype, {
		
		/**
			클래스 생성
		**/
		createClass: {
			value: function( className, image ){
				if( SmartGeoKit2D[ "add" + className ] != null ){
					throw "The name " + className + " can not be used.";
				}
				if( image instanceof Image === false ){
					throw "arguments[ 2 ] instanceof Image === false";
				}
				
				global.classList[ className ] = image;
				return true;
			}
		},
		
		/**
			객체 추가
		 **/
		addInstance: {
			value: function( id, className ){
				
				var object2d = null;
				if( id instanceof SmartGeoKit2D.Object2D ){
				
					object2d = id;
					global.sgk2dDraw.addObject( object2d );
					
				}else if( global.classList[ className ] != null ){
					object2d = global.sgk2dDraw.addRectangle( id );
					object2d.fillStyle = "rgba(0,0,0,0)";
					object2d.image = global.classList[ className ];
				}else{
					try{
						var args = Array.prototype.slice.apply( arguments );
						args.splice( 1, 1 );
							object2d = global.sgk2dDraw[ "add" + className ].apply( global.sgk2dDraw, args );
					}catch(e){
						throw "The className( "+className+" ) is not created.";
					}
				}
				
				return object2d;
				
			}
		},
		
		/**
			id에 의한 객체 조회
		 **/
		getInstanceById: {
			value: function( id ){
				
				var object2d = global.sgk2dDraw.getObjectById( id );
				if( object2d == null ){
					object2d = global.sgk2dView.getObjectById( id );
				}
				return object2d;
			}
		},
		
		/**
		  	Xy에 의한 객체 조회
		 **/
		getInstancesByXy: {
			value: function( x, y ){
				var drawObj = global.sgk2dDraw.getObjectsByXy( x, y );
				var viewObj = global.sgk2dView.getObjectsByXy( x, y );
				return drawObj.concat( viewObj );
			}
		},
		
		/**
			
		 **/
		cloneInstanceById: {
			value: function( cloneId, originId ){
				
				var originObject = global.sgk2dView.getObjectById( originId );
				var cloneObject = null;
				if( originObject == null ){
					originObject = global.sgk2dDraw.getObjectById( originId );
					cloneObject = global.sgk2dDraw.cloneObject( cloneId, originObject );
				}else{
					cloneObject = global.sgk2dView.cloneObject( cloneId, originObject );
				}
				
				return cloneObject;
				
			}
		},
		
		/**
			객체 삭제
		 **/
		removeInstance: {
			value: function( object2d ){
				global.api.unSelectInstanceById( object2d.id );
				global.sgk2dView.removeObject( object2d );
				global.sgk2dDraw.removeObject( object2d );
				global.sgk2dView.update();
				return true;
				
			}
		},

		/**
			전체 객체 삭제
		 **/
		removeInstanceAll: {
			value: function(){
				this.moveAllObjectsToMemory();
				global.sgk2dDraw.removeObjectAll();
				global.sgk2dView.update();
				return true;
				
			}
		},
		
		/**
		 	화면 갱신
		 **/
		updateView: {
			value: function( callback, ms ){
				global.sgk2dView.update( callback, ms );
			}
		},
		
		/**
			엔진 뷰어 사이즈 재조정
		 **/
		resize: {
			value: function(){
				global.sgk2dView.resize();
				global.sgk2dDraw.resize();
				global.sgk2dView.update( null, 0 );
			}
		},
		
		/**
			카메라 위치 이동
		 **/
		moveCamera: {
			value: function( x, y ){
				global.sgk2dView.moveCamera( x, y );
				global.sgk2dDraw.moveCamera( x, y );
				global.sgk2dView.update();
			}
		},
		
		/**
			카메라 줌 변경
		 **/
		setZoomCamera: {
			value: function( zoom ){
				global.sgk2dView.setZoomCamera( zoom );
				global.sgk2dDraw.setZoomCamera( zoom );
				global.sgk2dView.update();
			}
		},

		/**
			카메라 이동 가능 범위
		 **/
		setMoveCameraRange: {
			value: function( minX, minY, maxX, maxY ){
				global.sgk2dView.camera.position.minX = minX;
				global.sgk2dView.camera.position.minY = minY;
				global.sgk2dView.camera.position.maxX = maxX;
				global.sgk2dView.camera.position.maxY = maxY;
				global.sgk2dDraw.camera.position.minX = minX;
				global.sgk2dDraw.camera.position.minY = minY;
				global.sgk2dDraw.camera.position.maxX = maxX;
				global.sgk2dDraw.camera.position.maxY = maxY;
			}
		},

		/**
			카메라 줌 가능 범위
		 **/
		setZoomCameraRange: {
			value: function( min, max ){
				global.sgk2dView.camera.scale.minX = min;
				global.sgk2dView.camera.scale.minY = min;
				global.sgk2dDraw.camera.scale.minX = min;
				global.sgk2dDraw.camera.scale.minY = min;
				global.sgk2dView.camera.scale.maxX = max;
				global.sgk2dView.camera.scale.maxY = max;
				global.sgk2dDraw.camera.scale.maxX = max;
				global.sgk2dDraw.camera.scale.maxY = max;
			}
		},
		
		/**
		 	특정 점의 비율로 카메라 설정
		 **/
		setCameraByPoints: {
			value: function( sx, sy, ex, ey, userScale ){
				
				if( userScale == null ){
					userScale = 1;
				}

				var maxY = Math.max( sy, ey );
				var minY = Math.min( sy, ey );
				var rectHeight = maxY - minY;
				var canvasHeight = global.sgk2dView.renderer.canvas.height;
				
				var maxX = Math.max( sx, ex );
				var minX = Math.min( sx, ex );
				var rectWidth = maxX - minX;
				var canvasWidth = global.sgk2dView.renderer.canvas.width;

				var cx = ( sx + ex ) / 2;
				var cy = ( sy + ey ) / 2;
				
				global.sgk2dView.moveCamera( cx, cy );
				global.sgk2dDraw.moveCamera( cx, cy );

				var cameraScale = Math.min( canvasWidth / rectWidth, canvasHeight / rectHeight ) * userScale;
				global.sgk2dView.setZoomCamera( cameraScale );
				global.sgk2dDraw.setZoomCamera( cameraScale );
				global.sgk2dView.update(null, 0);
				
			}
		},
		
		/**
			뷰 모드
		 **/
		viewMode: {
			value: function( options ){
				global.mode.stop();
				
				/** 
				 	options = {
				 		onMousedown: Function, 
				 		onMousemove: Function, 
				 		onMouseup: Function, 
				 		onMousewheel: Function
				 	}
				 **/
				if( options == null ){
					options = {};
				}
				
				if( typeof options.onMousedown === "function" ){
					global.mode.viewMode.data.onMousedown = options.onMousedown;
				}
				if( typeof options.onMousemove === "function" ){
					global.mode.viewMode.data.onMousemove = options.onMousemove;
				}
				if( typeof options.onMouseup === "function" ){
					global.mode.viewMode.data.onMouseup = options.onMouseup;
				}
				if( typeof options.onMousewheel === "function" ){
					global.mode.viewMode.data.onMousewheel = options.onMousewheel;
				}
				global.mode.viewMode.start();
			}
		},
		
		/**
			배치 모드
		 **/
		collocateMode: {
			value: function( collocateObjects, options ){
				
				global.mode.stop();
				
				/** 
				 	options = {
				 		onMousedown: Function, 
				 		onMousemove: Function, 
				 		onMouseup: Function, 
				 		onMousewheel: Function
				 	}
				 **/
				if( options == null ){
					options = {};
				}
				
				if( typeof options.onMousedown === "function" ){
					global.mode.collocateMode.data.onMousedown = options.onMousedown;
				}
				if( typeof options.onMousemove === "function" ){
					global.mode.collocateMode.data.onMousemove = options.onMousemove;
				}
				if( typeof options.onMouseup === "function" ){
					global.mode.collocateMode.data.onMouseup = options.onMouseup;
				}
				if( typeof options.onMousewheel === "function" ){
					global.mode.collocateMode.data.onMousewheel = options.onMousewheel;
				}
				
				global.mode.collocateMode.data.objects = collocateObjects;
				global.mode.collocateMode.start();
				
			}
		},
		
		/**
			변형 모드
		 **/
		transformMode: {
			value: function( options ){
				
				global.mode.stop();
				
				/** 
				 	options = {
				 		onMousedown: Function, 
				 		onMousemove: Function, 
				 		onMouseup: Function, 
				 		onSelect: Function
				 	}
				 **/
				if( options == null ){
					options = {};
				}
				
				if( typeof options.onSelect === "function" ){
					global.mode.transformMode.data.onSelect = options.onSelect;
				}
				if( typeof options.onMousedown === "function" ){
					global.mode.transformMode.data.onMousedown = options.onMousedown;
				}
				if( typeof options.onMousemove === "function" ){
					global.mode.transformMode.data.onMousemove = options.onMousemove;
				}
				if( typeof options.onMouseup === "function" ){
					global.mode.transformMode.data.onMouseup = options.onMouseup;
				}
				
				global.sgk2dView.setSelectOption( options );
				global.mode.transformMode.start();
			
				return {
					selectInstanceById: global.api.selectInstanceById,
					unSelectInstanceById: global.api.unSelectInstanceById,
					unSelectInstancesAll: global.api.unSelectInstancesAll,
					setSelectOption: global.api.setSelectOption,
					getInstancesBySelect: global.api.getInstancesBySelect,
					enableSnap: function(){
						global.mode.transformMode.data.enableSnap = true;
					},
					disableSnap: function(){
						global.mode.transformMode.data.enableSnap = false;
					}
				};
				
			}
		},
		
		/**
			드래그 모드
		 **/
		drawDragMode: {
			value: function( options ){
				
				global.mode.stop();
				
				/** 
				 	options = {
				 		onMousedown: Function, 
				 		onMousemove: Function, 
				 		onMouseup: Function,
				 		object2d: SmartGeoKit2D.Shape
				 	}
				 **/
				if( options == null ){
					options = {};
				}
				
				if( options.object2d instanceof SmartGeoKit2D.Object2D ){
					global.mode.drawDragMode.data.object = options.object2d;
				}
				if( typeof options.onMousedown === "function" ){
					global.mode.drawDragMode.data.onMousedown = options.onMousedown;
				}
				if( typeof options.onMousemove === "function" ){
					global.mode.drawDragMode.data.onMousemove = options.onMousemove;
				}
				if( typeof options.onMouseup === "function" ){
					global.mode.drawDragMode.data.onMouseup = options.onMouseup;
				}
				global.mode.drawDragMode.start();
				
			}
		},
		
		/**
			객체 왼쪽 정렬
		 **/
		alignLeftObjects: {
			value: function( objects ){
				global.sgk2dView.alignLeftObjects( objects );
			}
		},
		
		/**
			객체 오른쪽 정렬
		 **/
		alignRightObjects: {
			value: function( objects ){
				global.sgk2dView.alignRightObjects( objects );
			}
		},
		
		/**
			객체 가운데 정렬
		 **/
		alignCenterObjects: {
			value: function( objects ){
				global.sgk2dView.alignCenterObjects( objects );
			}
		},
		
		/**
			객체 위쪽 정렬
		 **/
		alignTopObjects: {
			value: function( objects ){
				global.sgk2dView.alignTopObjects( objects );
			}
		},
		
		/**
			객체 아래쪽 정렬
		 **/
		alignBottomObjects: {
			value: function( objects ){
				global.sgk2dView.alignBottomObjects( objects );
			}
		},
		
		/**
			객체 중앙 정렬
		 **/
		alignMiddleObjects: {
			value: function( objects ){
				global.sgk2dView.alignMiddleObjects( objects );
			}
		},
		
		/**
			객체 수직 간격 동일 정렬
		 **/
		alignVerticalObjects: {
			value: function( objects ){
				global.sgk2dView.alignVerticalObjects( objects );
			}
		},
		
		/**
		 	객체 수평 간격 동일 정렬
		 **/
		alignHorizontalObjects: {
			value: function( objects ){
				global.sgk2dView.alignHorizontalObjects( objects );
			}
		},
		
		/**
			좌표증가방향 사분면 기준으로 변경
		 **/
		setCSD: {
			value: function( quadrant ){
				global.sgk2dView.setCSD( quadrant );
				global.sgk2dDraw.setCSD( quadrant );
			}
		},
		
		/**
			기본 마우스 버튼 셋팅
		 **/
		setNormalMouseButton: {
			value: function(){
				global.sgk2dView.setNormalButton();
				global.sgk2dDraw.setNormalButton();
			}
		},
		
		/**
			반대 마우스 버튼 셋팅
		 **/
		setReverseMouseButton: {
			value: function(){
				global.sgk2dView.setReverseButton();
				global.sgk2dDraw.setReverseButton();
			}
		},
		
		/**
			전체 객체 조회
		 **/
		getInstancesAll: {
			value: function(){
				
				var returnValue = [];
				
				function isReturnTarget( object2d ){
					
					// 핸들
					if( object2d.isHandle === true ){
						return false;
					}
					
					// 전체배경
					if( object2d.isBackground === true ){
						return false;
					}
					
					// 스냅선
					if( object2d.isSnapLine === true ){
						return false;
					}
					
					// 현재화면
					if( object2d.isView === true ){
						return false;
					}
					return true;
				}
				
				for( var i=0; i<global.sgk2dView.scene.children.length; ++i ){
					var object2d = global.sgk2dView.scene.children[ i ];
					if( isReturnTarget( object2d ) === false ){
						continue;
					}
					returnValue.push( object2d );
				}
				for( var i=0; i<global.sgk2dDraw.scene.children.length; ++i ){
					var object2d = global.sgk2dDraw.scene.children[ i ];
					if( isReturnTarget( object2d ) === false ){
						continue;
					}
					returnValue.push( object2d );
				}
				
				return returnValue;
				
			}
		},
		
		/**
		  	카메라배율 조회
		 **/
		getCameraZoom: {
			value: function(){
				return global.sgk2dDraw.camera.scale.x;
			}
		},
		
		/**
		  	카메라위치 조회
		 **/
		getCameraPosition: {
			value: function(){
				return { 
					x: global.sgk2dDraw.camera.position.x,
					y: global.sgk2dDraw.camera.position.y
				};
			}
		},
		
		/**
			카메라위치 조회
		 **/
		getCameraXy: {
			value: function(){
				return this.getCameraPosition();
			}
		},
		
		/**
			영역 면적 계산
		 **/
		getAreaCalculation: {
			value: function ( vectors ){

				if( vectors.length < 3 ){
					return 0;
				}
				
				var total = 0;
				for( var i=0; i<vectors.length-1; ++i ){
					var vectorA = vectors[i];
					var vectorB = vectors[i+1];
					total += areaUnitCalc( vectorA, vectorB );
				}
				var vectorA = vectors[ vectors.length-1 ];
				var vectorB = vectors[ 0 ];
				total += areaUnitCalc( vectorA, vectorB );
				
				return Math.abs( total ) / 2;
				
			}
		},
		
		/**
		 * 특정 객체를 메모리로 이동
		 * 화면에 있다는 가정
		 */
		moveObjectToMemory: {
			value: function( object2d ){
				global.sgk2dView.unSelectObject(  object2d );
				global.sgk2dDraw.addObject( object2d );
				global.sgk2dView.update(null, 0);
			}
		},
		
		/**
		 * 특정 객체를 화면으로 이동
		 */
		moveObjectToScene: {
			value: function( object2d ){
				global.sgk2dView.addObject( object2d );
				global.sgk2dView.update(null, 0);
			}
		},
		
		/**
		 * 필터 객체외 모든 객체를 메모리로 이동
		 */
		moveAllObjectsToMemory: {
			value: function( filterObject2dList ){
				
				if( filterObject2dList instanceof Array === false ){
					filterObject2dList = [];
				}
				var allObjects = this.getInstancesAll();
				var filterObject = allObjects.filter(function( object2d ){ 
					for( var i=0; i<filterObject2dList.length; ++i ){
						var target = filterObject2dList[ i ];
						if( target === object2d ){
							return false;
						}
					}
					return true;
				});
				for( var i=0; i<filterObject.length; ++i ){
					var object2d = filterObject[ i ];
					global.sgk2dView.unSelectObject(  object2d );
					global.sgk2dDraw.addObject( object2d );
				}
				global.sgk2dView.update(null, 0);
			}
		},
		
		/**
		 * 데이터 URL 전달
		 */
		toDataURL: {
			value: function( imgWidth, imgHeight, sx, sy, ex, ey, callback ){
	
				var originalCanvasWidth = global.sgk2dDraw.renderer.canvas.width;
				var originalCanvasHeight =  global.sgk2dDraw.renderer.canvas.height;
				var originalDrawCameraPosition = global.sgk2dDraw.camera.position.clone();
				var originalViewCameraPosition = global.sgk2dView.camera.position.clone();
				var originalDrawCameraScale = global.sgk2dDraw.camera.scale.x;
				var originalViewCameraScale = global.sgk2dView.camera.scale.x;
				
				this.moveAllObjectsToMemory();
				
				global.sgk2dDraw.renderer.canvas.width = imgWidth;
				global.sgk2dDraw.renderer.canvas.height = imgHeight;
				global.sgk2dView.renderer.canvas.width = imgWidth;
				global.sgk2dView.renderer.canvas.height = imgHeight;
				this.setCameraByPoints( sx, sy, ex, ey );
				
				sgk2d.updateView(function(){
					
					var dataURL = global.sgk2dDraw.renderer.canvas.toDataURL();
					
					// 복구
					global.sgk2dDraw.renderer.canvas.width = originalCanvasWidth;
					global.sgk2dDraw.renderer.canvas.height = originalCanvasHeight;
					global.sgk2dView.renderer.canvas.width = originalCanvasWidth;
					global.sgk2dView.renderer.canvas.height = originalCanvasHeight;
					global.sgk2dDraw.setZoomCamera( originalDrawCameraScale );
					global.sgk2dView.setZoomCamera( originalViewCameraScale );
					global.sgk2dDraw.camera.position.x = originalDrawCameraPosition.x;
					global.sgk2dDraw.camera.position.y = originalDrawCameraPosition.y;
					global.sgk2dView.camera.position.x = originalViewCameraPosition.x;
					global.sgk2dView.camera.position.y = originalViewCameraPosition.y;

					callback( dataURL );

				}, 0);
				
			}
		},
		/**
		 * 브라우저 이미지 다운로드 기능
		 */
		downloadImage: {
			value: function( imgName, imgWidth, imgHeight, sx, sy, ex, ey ){
				
				var originalCanvasWidth = global.sgk2dDraw.renderer.canvas.width;
				var originalCanvasHeight =  global.sgk2dDraw.renderer.canvas.height;
				var originalDrawCameraScale = global.sgk2dDraw.camera.scale.x;
				var originalViewCameraScale = global.sgk2dView.camera.scale.x;
				var originalDrawCameraPosition = global.sgk2dDraw.camera.position.clone();
				var originalViewCameraPosition = global.sgk2dView.camera.position.clone();
				
				this.moveAllObjectsToMemory();
				
				global.sgk2dDraw.renderer.canvas.width = imgWidth;
				global.sgk2dDraw.renderer.canvas.height = imgHeight;
				global.sgk2dView.renderer.canvas.width = imgWidth;
				global.sgk2dView.renderer.canvas.height = imgHeight;
				this.setCameraByPoints( sx, sy, ex, ey );
				
				sgk2d.updateView(function(){
					
					/**
					 * https://www.npmjs.com/package/download-canvas
					 */
					canvasToImage( global.sgk2dDraw.renderer.canvas, {
						name: imgName,
						type: 'png',
						quality: 1
					});
					
					// 복구
					global.sgk2dDraw.renderer.canvas.width = originalCanvasWidth;
					global.sgk2dDraw.renderer.canvas.height = originalCanvasHeight;
					global.sgk2dView.renderer.canvas.width = originalCanvasWidth;
					global.sgk2dView.renderer.canvas.height = originalCanvasHeight;
					global.sgk2dDraw.setZoomCamera( originalDrawCameraScale );
					global.sgk2dView.setZoomCamera( originalViewCameraScale );
					global.sgk2dDraw.camera.position.x = originalDrawCameraPosition.x;
					global.sgk2dDraw.camera.position.y = originalDrawCameraPosition.y;
					global.sgk2dView.camera.position.x = originalViewCameraPosition.x;
					global.sgk2dView.camera.position.y = originalViewCameraPosition.y;
					
				}, 0);
				
				
			}
		}
		
	} ); // Object.create
	
};

})();