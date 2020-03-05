module.exports = [
	
	{
		url: "/employee/main",
		type: "get",
		method: function( req, res, next ){
			
			res.render( 'WEB-INF/employee/main.ejs' );
				
		}
	}
	
];