module.exports = [
	
	{
		url: "/group/main",
		type: "get",
		method: function( req, res, next ){
			
			res.render( 'WEB-INF/group/main.ejs' );
				
		}
	}
	
];