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
							
							res.render( "WEB-INF/employee/management.ejs", {
								groups: JSON.stringify( groups ),
								employees: employees
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
	},
	/**
	 * 생일자 목록 조회
	 */
	{
		url: "/employee/getBirthdayEmployees",
		type: "get",
		method: function( req, res, next ){
			
			fs.readFile(
				global.dataDir + "/employee.json",
				"utf8",
				function( err, employees ){ 
					
					var minDay = new Date();
					minDay.setHours( 0 );
					minDay.setMinutes( 0 );
					minDay.setSeconds( 0 );
					minDay.setMilliseconds( 0 );
					
					var maxDay = new Date( minDay.getTime() );
					maxDay.setDate( minDay.getDate() + 6 ); 
					
					
					var fullYear = maxDay.getFullYear();
					employees = JSON.parse( employees );
					var birthdayEmployees = employees.filter( function( employee ){
						
						if( employee.birthday == null ){
							return false;
						}
						
						var birthday = new Date( employee.birthday + " 00:00:00" );
						birthday.setFullYear( fullYear );
						
						if( maxDay < birthday ){
							return false;
						} 
						if( birthday < minDay ){
							return false;
						} 
						
						return true;
						
					} );
					
					birthdayEmployees.sort( function( a, b ){
						
						if( a.birthday > b.birthday ){
							return 1;
						}
						if( a.birthday < b.birthday ){
							return -1;
						}
						return 0;
						
					} );

					res.send( birthdayEmployees );
					
				}
			);
				
		}
	}
	
];