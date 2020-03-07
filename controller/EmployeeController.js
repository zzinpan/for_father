module.exports = [
	
	/**
	 * 메인화면
	 */
	{
		url: "/employee/main",
		type: "get",
		method: function( req, res, next ){
			
			res.render( 'WEB-INF/employee/main.ejs' );
				
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