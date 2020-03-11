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
							res.render( "WEB-INF/group/management.ejs", {
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
		url: "/employee/save",
		type: "post",
		method: function( req, res, next ){
			
			res.render( 'WEB-INF/employee/main.ejs' );
			
		}
	}
	
];