module.exports = [
	
	/**
	 * 메인 화면
	 */
	{
		url: "/group/main",
		type: "get",
		method: function( req, res, next ){
			
			res.charset = 'utf-8';
			fs.readFile(
				global.dataDir + "/group.json",
				"utf8",
				function( err, data ){ 
					res.render( "WEB-INF/group/main.ejs", {
						groups: data
					} );
				}
			);
				
		}
	},
	
	/**
	 * 소속 저장
	 */
	{
		url: "/group/save",
		type: "post",
		method: function( req, res, next ){

			var groups = req.body;
			fs.writeFile( 
				global.dataDir + "/group.json", 
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