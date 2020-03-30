module.exports = [
	
	/**
	 * 품목관리 화면
	 */
	{
		url: "/product/management/view",
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
					
					res.render( "WEB-INF/product/management.ejs", {
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
		url: "/product/management/save",
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