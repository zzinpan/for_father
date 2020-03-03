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
		new User( "sehyunict", "547c51853b0c90076de136edadf261fe6ad1fc5ea0889b35c7a9f47738b475c7", "세현아이씨티", "master" ),
		new User( "tester", "547c51853b0c90076de136edadf261fe6ad1fc5ea0889b35c7a9f47738b475c7", "테스터", "common" )
	]);
	
})();