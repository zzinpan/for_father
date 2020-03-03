$(function SaveMode(){ with( window.Global ){
	
	Global.ModeList.SaveMode = new Mode( 

			// 모드 데이터
			{
				// nothing
			},
			
			function start(){
				
				var mode = this;
				var defaultFileName = (function(){
					
					var now = new Date();
					var year = now.getFullYear();
					
					var month = now.getMonth().toString();
					if( month.length < 2 ){
						month = "0"+month;
					}
					
					var date = now.getDate().toString();
					if( date.length < 2 ){
						date = "0"+date;
					}
					
					var hour = now.getHours().toString();
					if( hour.length < 2 ){
						hour = "0"+hour;
					}

					var min = now.getMinutes().toString();
					if( min.length < 2 ){
						min = "0"+min;
					}

					var sec = now.getSeconds().toString();
					if( sec.length < 2 ){
						sec = "0"+sec;
					}

					return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
					
				})();
				
				
				sgk2dView.downloadImage( defaultFileName );
				this.end();
				
			},
			function end(){
				$tools.filter(".active").removeClass("active");
			}
		);

}});