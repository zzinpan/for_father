/**
	Import
 **/
(function globalSettings(){

	// 노드 내장 모듈
	global.http = require('http');
		
	// 노드 웹 프레임워크
	global.express = require('express');
	global.app = global.express();
	
	// multipart fileUpload
	global.fileUpload = require('express-fileupload');

	// 응답 요청 간 파라미터 쉽게 받는 모듈
	global.bodyParser = require('body-parser');

	// 파일 시스템 사용
	global.fs = require('fs');
	
	// 암호화
	global.sha256 = require('sha256');
	
	// 쿠키 파서
	global.cookieParser = require('cookie-parser');

	// 세션
	global.session = require('express-session');
	
	// 프로젝트 경로
	global.path = require('path');
	global.APP_ROOT_PATH = global.path.resolve( __dirname );
	
	/**
	 * 프로젝트 변수
	 */
	
	// 데이터 경로
	global.dataDir = "./data";
	
	// 유니크 아이디
	global.getUniqueId = function(){
		return ( Date.now() + Math.random() ).toString().replace(".", "");
	};
	
	// 시간
	global.now = function(){
		var now = new Date();
		var yyyy = now.getFullYear().toString();
		var MM = ( now.getMonth() + 1 ).toString().padStart( 2, 0 );
		var dd = now.getDate().toString().padStart( 2, 0 );
		var hh = now.getHours().toString().padStart( 2, 0 );
		var mm = now.getMinutes().toString().padStart( 2, 0 );
		var ss = now.getSeconds().toString().padStart( 2, 0 );
		return {
			object: now,
			yyyy: yyyy,
			MM: MM,
			dd: dd,
			hh: hh,
			mm: mm,
			ss: ss
		}
	};
	
})();

// 프로퍼티 셋팅
(function propertiesSettings(){
	
	var propertiesPath = "./properties/";
	fs.readdir(propertiesPath, function (err, files){
		
		// 전역 변수 셋팅
		global.Properties = {};
		
	    for( var i=0; i<files.length; ++i ){
	    	var fileName = files[ i ];
	    	var key = fileName.split(".")[0];
	    	global.Properties[ key ] = require( propertiesPath + fileName );
	    }
	    
	});
	
})();

/**
	express 셋팅
 **/
(function webServerEnvSetting(){

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));
	
	// parse application/json
	app.use(bodyParser.json());
	
	// multpart Files
	app.use(fileUpload());
	
	// 3000 port 사용
	app.set('port', process.env.PORT || 3000);
		
	// views 폴더 설정
	app.set('views', __dirname + '/webApp');

	// ejs template 사용
	app.set('view engine', 'ejs');
	
	// static file 프로젝트 root 경로를 기본값으로 사용
	app.use('/data', express.static("./data"));
	app.use('/dist', express.static("./dist"));
	app.use('/src', express.static("./src"));
	app.use('/', express.static("./webApp"));
	
	/**
	 * 세션 관련 설정
	 */
	app.use(cookieParser());
	app.use(session({
	  key: "SGK2D_SESSION_ID", // 세션키
	  secret: "SmartGeoKit2D", // 비밀키
//	  cookie: {
//	    maxAge: Infinity // 쿠키 유효기간 1시간
//	  }
	}));
	
})();


/**
 * 라우트 설정
 */
(function routeSetting(){
	
	// welcome File
	app.get('/', function( req, res ){
		res.render( 'index', { userName: req.session.userName } );
	});
	
	// 컨트롤러 폴더 목록
	var controllerPath = './controller/';
	
	fs.readdir(controllerPath, function (err, files){
	    for( var i=0; i<files.length; ++i ){
	    	
	    	var fileName = files[ i ];
	    	if( fileName.indexOf( "Controller" ) < 0 ){
				continue;
			};
	    	
	    	var controlList = require( controllerPath + fileName );
	    	for( var j=0; j<controlList.length; ++j ){
	    		
	    		var control = controlList[ j ];
	    		var type = control.type.toLowerCase();
	    		var url = control.url;
	    		var method = control.method;
	    		var metaAuthority = control.authority;
	    		if( metaAuthority instanceof Array === true ){
	    			method = (function( _metaAuthority, _control ){
	    				return function authorityCheck( req, res, next ){

	    					console.log("[ SIGN IN REQUIRED ]", " { " + req.sessionID + " }");
	    					
		    				// 현재 로그인이 안된 경우 -> 로그인 페이지
			    			if( req.session.userId == null ){
			    				console.log("[ NOT LOGGED IN ] redirect /loginPage", " { " + req.sessionID + " }");
			    				console.log( "[ SAVE USER REQUEST URL ]", req.route.path, " { " + req.sessionID + " }" );
			    				req.session.userWantURL = req.route.path;
			    				res.redirect('/loginPage');
			    				
			    			// 현재 로그인이된 경우 -> 권한체크
			    			}else{
			    				
			    				// 등급 별 권한 목록
			    				var authorityList = global.Properties[ "authority" ];
			    				
			    				// 사용자 등급에 따른 권한 목록
			    				var userAuthorityList = authorityList[ req.session.userAuthority ];  
			    				
			    				console.log("[ LOGGED IN ]", " { " + req.sessionID + " }");
			    				
			    				// 권한이 없는 경우 -> 권한이 없습니다 페이지
			    				for( var k=0; k<_metaAuthority.length; ++k ){
			    					if( userAuthorityList.indexOf( _metaAuthority[ k ] ) === -1 ){
			    						
			    						console.log("[ FORBIDDEN ]", " { " + req.sessionID + " }");
			    						
				    					res.render( "WEB-INF/authority/notAllowed.ejs", {
				    						message: "\""+_metaAuthority[ k ]+"\" 권한이 없습니다."
				    					} );
				    					return;
				    				}
			    				}
			    				
			    				console.log("[ ALLOW ACCESS ]", " { " + req.sessionID + " }");
			    				_control.method( req, res, next );
			    			}
			    			
	    				}
	    				
	    			})( metaAuthority, control );
	    		}
	    		
	    		app[ type ]( url, method );
	    		
	    	}
	    }
	    
	});
	
})();

/**
 * 데이터 파일 생성
 */
(function creataDataFile(){
	
	if (fs.existsSync(global.dataDir)){
		console.log("has data.");
		return;
	}
	console.log("no data.");
	
	// 폴더 생성
	fs.mkdirSync(global.dataDir);
	console.log("create " + global.dataDir + " - complete");
	
	// 소속 파일 생성
	var now = global.now();
	var nowStr = now.yyyy + now.MM + now.dd + now.hh + now.mm + now.ss;
	var group = [
		{ 
			id: "GRP::ETC",
			name: "기타",
			use: true,
			enableDelete: false,
			createDate: nowStr,
			updateDate: nowStr
			
		}
	];
	fs.writeFile( 
		global.dataDir + "/group.json", 
		JSON.stringify( group ),
		"utf8",
		function(err){ 
			if (err == null) { 
				console.log("create group.json - complete");
			} else { 
				console.log("create group.json - fail");
				console.log( err );
			} 
	});
	
	// 직원 파일 생성
	var employee = [ 
		{
			groupId: "GRP::ETC",
			id: "EMP::FACTORY",
			name: "공장",
			phone: null,
			mail: null,
			birthday: null,
			image: null,
			memo: "삭제 불가능",
			createDate: nowStr,
			updateDate: nowStr,
			use: true,
			enableDelete: false
		}
	];
	fs.writeFile( 
			global.dataDir + "/employee.json", 
			JSON.stringify( employee ),
			"utf8",
			function(err){ 
				if (err == null) { 
					console.log("create employee.json - complete");
				} else { 
					console.log("create employee.json - fail");
					console.log( err );
				} 
		});
	
})();

// 서버 실행
http.createServer(app).listen(app.get('port'), function(){
  console.log('[ EXPRESS SERVER LISTENING ON PORT ' + app.get('port') + " ]");
});

