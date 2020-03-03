/**
	@API
		SmartGeoKit2D sgk2d = new SmartGeoKit2D( String query )
	@DESC
		엔진 생성자
	@PARAM
		query: DOM 선택자
	@RETURN
	 	sgk2d: 엔진
 **/
function SmartGeoKit2D( selector ){
	
	// 디버거
	var Debugger = SmartGeoKit2D.Debugger;
	var sgk2d = this;
	
	// 엔진 기본 설정값
	this.ENV = {
			camera: {
				// 확대 배율
				zoomMagnification: 1.1,
				// 최초 카메라 위치
				startPosition: { x: 0, y: 0 }
			}
	};
	
	// 렌더러 생성
	sgk2d.renderer = new SmartGeoKit2D.Renderer( "SGK2D.Renderer:" + selector, selector );
	
	// 공간 생성
	sgk2d.scene = new SmartGeoKit2D.Scene( "SGK2D.Scene:" + selector );

	// 카메라 생성
	sgk2d.camera = (function createCamera(){
		var camera = new SmartGeoKit2D.Camera( "SGK2D.Camera:" + selector );
		camera.position.x = sgk2d.ENV.camera.startPosition.x;
		camera.position.y = sgk2d.ENV.camera.startPosition.y;
		return camera;
	})();

	// RequestAnimationFrame 반환 아이디 모음
	sgk2d.RAF = {
			// 렌더링
			rendering: null
	};
	
	/* 
		이벤트 목록 - 이벤트 콜백 관리
		사용하기 쉽도록 특정 프로퍼티에 대해 enumerable을 제외
		
		sgk2d.event = {
			beforeRender: {
				0: 사용자 콜백
				1: 사용자 콜백
			},
			afterRender: {
				2: 사용자 콜백
				3: 사용자 콜백
			}
		}
		
		의 형태 이며, 특정 시점에 executeCallback을 호출하여 사용자 콜백을 실행
	 */
	sgk2d.event = Object.create( Object.prototype, {
		
		// 콜백 등록 시컨스
		sequence : {
			value: 0,
			writable: true
		},

		// 렌더 전 콜백 ()
		beforeRender: {
			value: {},
			enumerable: true,
			writable: true
		},
		
		// 렌더 후 콜백 ()
		afterRender: {
			value: {},
			enumerable: true,
			writable: true
		},
		
		resize: {
			value: {},
			enumerable: true,
			writable: true
		},
		
		/*
			@USE
			 	sgk2d.event.executeCallback( String _type, ? _args... )
			@DESC
				콜백 실행기
			@PARAM
				_type: sgk2d.event에 프로퍼티
				_args...: 각 콜백마다 전달 파라미터가 다르므로, 2번째 인자부터는 각 콜백 특성에 따라 자유롭게 전달
			@SAMPLE
				클릭된 시점에 해당 함수 실행
				sgk2d.event.executeCallback( click, e, x, y );
		 */
		executeCallback: {
			value: function executeCallback ( _type, _args ){
				
				var type = Array.prototype.shift.call( arguments );
				var callbacks = this[ type ];
				for( var eventSeq in callbacks ){
					callbacks[ eventSeq ].apply( null, arguments );
				}
				
			}
		}
	} ); // END - sgk2d.event
	
}


/**
 * 플러그인 목록 String[]
 */
SmartGeoKit2D.prototype.plugins = [];