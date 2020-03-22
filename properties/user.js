module.exports = (function(){
	
	function User( id, password, name, authority ){
		this.id = id;
		this.password = password;
		this.name = name;
		this.authority = authority;
	}

	return (function( userList ){
		var obj = {};
		for( var i=0; i<userList.length; ++i ){
			var user = userList[ i ];
			obj[ user.id ] = { 
					password: user.password,
					name: user.name,
					authority: user.authority
			};
		}
		return obj;
	})([
		/**
		 * 사용자 목록
		 */
	]);
	
})();