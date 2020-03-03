# 컨트롤러 사용 설명

1. **controller 폴더 아래, 파일 이름 내  "Controller" 문자열이 포함된 파일만 로드**
	- 서버 가동 후 소스 수정 시, 서버 재가동 필요
	<br>
2. **controller 파일 작성 양식**
	- *String url: 사용자 요청 URL
	- *String type: http API
	- String[] authority: 
		- 요구되는 권한
		- authority를 선언하는 것만으로 로그인 체크
		- 권한이 없으면, 
			- 자동으로 로그인 페이지로 이동 
				- 로그인 시, 이전 요청 페이지 표시
		- authority의 모든 값이 사용자 권한에 있어야만 해당 페이지 표시
		- authority의 모든 값이 사용자 권한에 없다면, 접근 제한 페이지 표시
	- *Function method: 사용자가 페이지 요청 시 수행될 컨트롤러 함수
		- 인자값
			- [0]: HttpRequest HTTP 요청에 관련된 API
			- [1]: HttpResponse HTTP 응답에 관련된 API
			- [2]: Function 자바스크립트 비동기를 제어할 함수
	<br>
3. **작성 예시**
	```javascript
	module.exports = [
		
		{
			url: "/demo/layoutManagement",
			type: "post",
			authority: [ "VIEW_SAMSUNG_DWG" ], 
			method: function( req, res, next ){
				res.render( 'WEB-INF/demo/layoutManagement.ejs' );
			}
		},
		{
			url: "/demo/paint",
			type: "get",
			authority: [],
			method: function( req, res ){
				res.render( 'WEB-INF/demo/paint.ejs' );
			}
		},
		{
			url: "/demo/practice",
			type: "get",
			method: function( req, res ){
				res.render( 'WEB-INF/demo/practice.ejs' );
			}
		}
		
	];
	```
	<br>