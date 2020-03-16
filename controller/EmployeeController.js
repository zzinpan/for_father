module.exports = [
	
	/**
	 * 메인화면
	 */
	{
		url: "/employee/management/view",
		type: "get",
		method: function( req, res, next ){
			
			fs.readFile(
				global.dataDir + "/employee.json",
				"utf8",
				function( err, emplyoees ){ 
					
					fs.readFile(
						global.dataDir + "/group.json",
						"utf8",
						function( err, groups ){ 
							res.render( "WEB-INF/employee/management.ejs", {
								groups: groups,
								employees: emplyoees
							} );
						}
					);
					
				}
			);
				
		}
	},
	/**
	 * 저장
	 */
	{
		url: "/employee/management/save",
		type: "post",
		method: function( req, res, next ){
			
			var employees = req.body;
			fs.writeFile( 
				global.dataDir + "/employee.json", 
				JSON.stringify( employees ),
				"utf8",
				function(err){ 
					if (err == null) { 
						res.send( { result: "SUCCESS", data: null } );
					} else { 
						res.send( { result: "FAIL", data: err } );
					} 
			});
			
		}
	}
	
];