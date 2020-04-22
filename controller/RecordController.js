module.exports = (function (){
	
	
	
	return [
		
		/**
		 * 품목관리 화면
		 */
		{
			url: "/record/management/view",
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
						
						res.render( "WEB-INF/record/management.ejs", {
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
			url: "/record/management/get",
			type: "get",
			method: function( req, res, next ){
				
				var requestDate = req.body.date;
				var yyyyMMddArr = requestDate.split("-");
				var requestFileName = requestDate + ".json";
				
				var fileNames = [];
				var years = fs.readdirSync( global.dataDir + "/records" );
				years.forEach(function( year ){
					
					var monthes = fs.readdirSync( global.dataDir + "/records/" + year );
					monthes.forEach(function( month ){
						
						var subFileNames = fs.readdirSync( global.dataDir + "/records/" + year + "/" + month );
						fileNames = fileNames.concat( subFileNames );
						
					});
					
				});				
				
				// 오름차순 정렬
				fileNames.sort();
				
				// 기본 데이터 구조
				var responseData = {
						
						// 전일재고
						beforeTotalSummary: {},
						
						// 당일입고
						todayInputs: [],
						
						// 당일입고 합계
						todayInputSummary: {},
						
						// 당일출고
						todayOutputs: [],
						
						// 당일출고 합계
						todayOutputSummary: {},
						
						// 당일재고
						todayTotalSummary: {}
						
						
				};
				
				// 최신부터 오래된 날자로 순회
				for( var i=fileNames.length-1; i>-1; --i ){
					var fileName = fileNames[ i ];
					if( fileName == requestFileName ){
						responseData = fs.readFileSync( global.dataDir + "/records/" + yyyyMMddArr[0] + "/" + yyyyMMddArr[1] + "/" + requestFileName );
						break;
					}
					if( fileName < requestFileName ){
						var fileNameArr = fileName.split("-");
						var beforeData = fs.readFileSync( global.dataDir + "/records/" + fileNameArr[0] + "/" + fileNameArr[1] + "/" + fileName );
						beforeData = JSON.parse( beforeData );
						
						// 데이터만들어줘야댐..
						
						break;
					}
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
							
							res.render( "WEB-INF/record/management.ejs", {
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
			url: "/record/management/save",
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