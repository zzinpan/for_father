$(function PenMode(){ with( window.Global ){
	
	Global.ModeList.ColorMode = new Mode( 

			// 모드 데이터
			{
				// not thing
			},
			
			function start(){
			},
			function end(){
				$colorToolBtn.removeClass("active");
				Global.color = $colorToolBtn.spectrum("get").toHexString();
			}
		);

}});