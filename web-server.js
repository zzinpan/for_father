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
			age: null,
			phone: null,
			mail: null,
			birthday: null,
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACu1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/v77+/35+vr+/v7////////////9/f7q7u/X3+LX3+H////+/v7f5efg5un+/v7////////6+/vR2t3T2t77+/3////////9/f7R2d7+/v7////////////d4+X////////9/f7+/v7////s7/Du8vP////////////h5ujh5+r////d4+bc4+b////////////////////////////////////////////w8/T////////b4eX////////Z3+L////////////a4eTc4+b////v8/Tw8/T////////j6Or////////+/v7////V3uDR2t7////n6+7////////Q2d3P2Nz////////q7vDm6u3////+/v7R2t7S2t7////////z9vfz9vb////e5Obi6Ov////09vf////////////////////n7e7u8vP////////T3N/Y4eP////k6ezu8PP////////6+/zZ3+Pg5uf////////9/f3e5Obg5ej9/f3+/v7P2Nz////////R2d3////y9PTS2t7////////5+vvV3eDi5+n+/v/////////p7vD19/fP2NvP2NzP2NzQ2dzM29vP2NzP2dvP2NzO2NvY2NjP2d3P2NzP2NzO2d3Q19zP2dzP2NzQ2N3S0uHO2N3Q19vP19zP2d3O29vO2NvO2NzP2dzP193P2NzP2NzP2NzP2Nz////P2NwAAACIQXX/AAAA5nRSTlMAFlKEpsnk7vTdy6l9GTSN1/7RizgNctrUDxCG734CZertZAEix8EmXPHyVYwGpacFs/PWzcf0sgcD1cHf347fzczgiFbN8/HOWCfb9NzwIMLRw2bZ12DAv+cOf8vKgtLSDG/VOTGJ0hgT+0+/garWo8zdxuHr1tP6v8Dg98f42NrF5fZ8w3fm+P5J/cHEzej18unPwME10MnOwWkLeArlwsBi9erauMbAvBvK3M0cVNbP0Nfl/YCZ+Pa/8K+byObJ458EdnpP7/JXI75k6mMNf/HwfmbU2ncRNIfVNRVOg6bI3+764Md/w3UAAAABYktHRACIBR1IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH5AMPBwQfsulHxgAAAxlJREFUWMOll/VfFFEUxR+ILKHAGAiyoLi2KEiohAoGdiAKiIEtIipiK3Yididid3d3gYgdICX45t9w2EV25777dsbd8+O953xn5vPmzbtDCEc2trXsattrHKjG0cm5jm1d8l9ycXWjcgn16jdQm27o3oii8nD3VBFv7KWlXGm9lRA+TZpSs/JtpjOXb96CKqplK36+dRvlPKVt2/Fu309NvEquPli+fQe1eUr9A9h8QEfWFxgUHBISHNSJ7XTuAvOh/tATFh4hVqtreBDs2sHF6AYM3SNFmaJ6AENPeb4XaPeOFoH69AWWfqb5/oHy5oCBIqPoQXLP4CHGvG4ooMeIiGKAaZhxMWNBa7iIagSwxdXsHw3oxOOABGAbmVgNGAXXaDQOGAN9Yw15T3gDNAkHjIM+3/F6gDtVCUhijBP0gImWA9yq8pOo5QA6WQL4WQOYIgGmWgPwICRZsAYgTCO2bDUlAgdEpLDe6cSbLaaKHKWy3hlkJluM4QFmsd40MpstpvMA6ax3DnG0DjCXaK0DzCMp1gEciANbnM8DLGC9CwlymC7iARZjj7CELWZE4fmly1jvcuLEFukKtdendCVJQ6rCKiS/WoMB/MkarJyAANZiRroO20yUrt/A5DPDUMBGYpOF1TcxgM1oXkgmZAvW2LoN5LfvQAE7pS+SF9rZBQC7UZf+ZNiDdrL2yvL7BBzgUvVZ3o+25K/jATzvoR8zDloOiNUfLIlaSwHaQ4bD8bClAO/q0zn7CNLMkQGOYnn77H8DwjG2efyEDHASW4U444hzCvYyToP34AxLOGsyr54DO+38BeZVvghHRd9LpmPaZdMLXLmKfg+uXTfNC2DkNu7qGzk3RY4iTXbkLTjr3jbUNfF3RDOqQTCjLglwlsp3790XFWR4kAfIuB76kD56rBSXlPnkKX32HPth0L3IVJGXFP2S99/06rWa/Ju3hKvcPOV8Xi4xI927fPPx/Pdmf/skFXz4yI9/+lxAlFXw5Sse//b9h4q4/kF+FhbBdFHhL6Wbl6u4pLSs/HdFZWXFn/Ky0pJinu8v2dfvERZN52gAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDMtMTVUMDc6MDQ6MzErMDA6MDAOVVx7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAzLTE1VDA3OjA0OjMxKzAwOjAwfwjkxwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=",
			memo: "기본 데이터\n삭제 불가능",
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

