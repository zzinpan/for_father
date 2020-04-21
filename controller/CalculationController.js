module.exports = (function (){
	
	
	
	return [
		
		/**
		 * 품목관리 화면
		 */
		{
			url: "/calculation/management/view",
			type: "get",
			method: function( req, res, next ){
				
				fs.readFile(
					global.dataDir + "/product.json",
					"utf8",
					function( err, products ){ 
						
						products = JSON.parse( products );
						products.sort(function( a, b ){
							
							if( a.order < b.order ){
								return -1;
							}
							if( a.order > b.order ){
								return 1;
							}
							
							return 0;
							
						});
						
						res.render( "WEB-INF/calculation/management.ejs", {
							products: JSON.stringify( products )
						} );
					}
				);
					
			}
		},
		
		/**
		 * 품목관리 화면
		 */
		{
			url: "/calculation/management/get",
			type: "get",
			method: function( req, res, next ){
				
				var yyyyMMddArr = req.body.date.split("-");
				var folder = global.dataDir + "/records/" + yyyy;
				
				// 여기서 파일이 없다고 생성해줄 필요는 없고, 기본 데이터 구조만 넘겨주고, targetDay로부터 가장 최신의 전일재고를 조회해서 가져간다. "2020-05-14" < "2020-05-15"
				
				// 폴더 존재 안함
				if ( fs.existsSync( targetFileName ) == false ) {
					
				}
				
				// 파일이 존재하지않는다면..
				if ( fs.existsSync( targetFileName ) == false ) {

					// 파일 목록 조회
					var fileNames = fs.readdirSync( global.dataDir + "/records" );
						
					// 파일 정렬 오름차순
					fileNames.sort();
					
					// 가장 최근에 조회했던 데이터 조회
					var lastFileName = fileNames[ fileNames.length - 1 ];
					
					// 마지막 파일이 없다면, 처음 접속이므로, 최초 파일 생성
					if( lastFileName == null ){
						
						
						
					}
					var yyyyMMddLastDay = lastFileName.split( "." )[0];
					
				}
				
				
				
				fs.readFile(
						global.dataDir + "/product.json",
						"utf8",
						function( err, products ){ 
							
							products = JSON.parse( products );
							products.sort(function( a, b ){
								
								if( a.order < b.order ){
									return -1;
								}
								if( a.order > b.order ){
									return 1;
								}
								
								return 0;
								
							});
							
							res.render( "WEB-INF/calculation/management.ejs", {
								products: JSON.stringify( products )
							} );
						}
				);
				
			}
		},
		
		/**
		 * 품목 저장
		 */
		{
			url: "/calculation/management/save",
			type: "post",
			method: function( req, res, next ){

				var groups = req.body;
				fs.writeFile( 
					global.dataDir + "/product.json", 
					JSON.stringify( groups ),
					"utf8",
					function(err){ 
						if (err == null) { 
							res.send( { result: "SUCCESS", data: null } );
						} else { 
							res.send( { result: "FAIL", data: err } );
						} 
				});
				
			}
		},
		
	];
	
})()