module.exports = [
	
	/**
	 * 소속관리 화면
	 */
	{
		url: "/group/management/view",
		type: "get",
		method: function( req, res, next ){
			
			fs.readFile(
				global.dataDir + "/group.json",
				"utf8",
				function( err, groups ){ 
					
					fs.readFile(
						global.dataDir + "/employee.json",
						"utf8",
						function( err, employees ){ 
							
							groups = JSON.parse( groups );
							employees = JSON.parse( employees );
							
							for(var i=0; i<groups.length; ++i){
								var group = groups[ i ];
								group.employees = [];
								for(var j=0; j<employees.length; ++j){
									var employee = employees[ j ];
									if( group.id == employee.groupId ){
										group.employees.push( employee );
									}
								}
							}
							
//							console.log( JSON.stringify( groups ) );
							
							res.render( "WEB-INF/group/management.ejs", {
								groups: JSON.stringify( groups )
							} );
						}
					);
					
				}
			);
				
		}
	},
	
	/**
	 * 소속 저장
	 */
	{
		url: "/group/management/save",
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