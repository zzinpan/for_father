module.exports = (function (){
	
	
	
	return [
		
//		/**
//		 * 품목관리 화면
//		 */
//		{
//			url: "/record/management/view",
//			type: "get",
//			method: function( req, res, next ){
//				
//				fs.readFile(
//					global.dataDir + "/product.json",
//					"utf8",
//					function( err, products ){ 
//						
//						products = JSON.parse( products );
//						products.sort(function( a, b ){
//							
//							if( a.order < b.order ){
//								return -1;
//							}
//							if( a.order > b.order ){
//								return 1;
//							}
//							
//							return 0;
//							
//						});
//						
//						res.render( "WEB-INF/record/management.ejs", {
//							products: JSON.stringify( products )
//						} );
//					}
//				);
//					
//			}
//		},
		
		/**
		 * 품목관리 화면
		 */
		{
			url: "/record/management/view",
			type: "get",
			method: function( req, res, next ){
				
				var requestDate = req.query.date;
				if( requestDate == null ){
					
					var now = global.now();
					requestDate = now.yyyy + "-" + now.MM + "-" + now.dd;
					
				}
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
				var records = {
						
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
				
				// 최신부터 오래된 날짜로 순회
				for( var i=fileNames.length-1; i>-1; --i ){
					var fileName = fileNames[ i ];
					
					// 해당 날짜의 데이터가 존재하면, 바로 전달
					if( fileName == requestFileName ){
						records = fs.readFileSync( global.dataDir + "/records/" + yyyyMMddArr[0] + "/" + yyyyMMddArr[1] + "/" + requestFileName );
						break;
					}
					
					// 해당 날짜의 데이터가 존재하지않다면, 기본 데이터 구조를 갱신하여 전달
					if( fileName < requestFileName ){
						var fileNameArr = fileName.split("-");
						var beforeData = fs.readFileSync( global.dataDir + "/records/" + fileNameArr[0] + "/" + fileNameArr[1] + "/" + fileName );
						beforeData = JSON.parse( beforeData );
						
						// 전 데이터를 전일재고로 입력
						records.beforeTotalSummary = beforeData.todayTotalSummary;
						
						// 전일재고를 당일재고로 입력
						records.todayTotalSummary = records.beforeTotalSummary;
						
						
						for( var columnId in records.beforeTotalSummary ){
							
							// 당일 입고 합계 0으로 입력
							todayInputSummary[ columnId ] = 0;
							
							// 당일 출고 합계 0으로 입력
							todayInputSummary[ columnId ] = 0;
						}
						
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
							
							fs.readFile(
									global.dataDir + "/employee.json",
									"utf8",
									function( err, employees ){ 
										
										fs.readFile(
											global.dataDir + "/group.json",
											"utf8",
											function( err, groups ){ 
												
												groups = JSON.parse( groups );
												groups = groups.filter(function( group ){
													
													if( group.use == false ){
														return false;
													}
													
													if( group.remove == true ){
														return false;
													}
													
													return true;
													
												});
												
												res.render( "WEB-INF/record/management.ejs", {
													requestDate: requestDate,
													products: JSON.stringify( products ),
													records: JSON.stringify( records ),
													groups: groups,
													employees: JSON.parse( employees )
												} );
												
											}
										);
										
									}
								);
							
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