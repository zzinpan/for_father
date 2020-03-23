module.exports = [
	
	/**
	 * 소속관리 화면
	 */
	{
		url: "/product/management/view",
		type: "get",
		method: function( req, res, next ){
			
			fs.readFile(
				global.dataDir + "/productGroup.json",
				"utf8",
				function( err, productGroups ){ 
					
					fs.readFile(
						global.dataDir + "/product.json",
						"utf8",
						function( err, products ){ 
							
							res.render( "WEB-INF/product/management.ejs", {
								productGroups: productGroups,
								products: products
							} );
						}
					);
					
				}
			);
				
		}
	},
	
//	/**
//	 * 소속 저장
//	 */
//	{
//		url: "/group/management/save",
//		type: "post",
//		method: function( req, res, next ){
//
//			var groups = req.body;
//			fs.writeFile( 
//				global.dataDir + "/group.json", 
//				JSON.stringify( groups ),
//				"utf8",
//				function(err){ 
//					if (err == null) { 
//						res.send( { result: "SUCCESS", data: null } );
//					} else { 
//						res.send( { result: "FAIL", data: err } );
//					} 
//			});
//			
//		}
//	},
	
];