$(function PenMode(){ with( window.Global ){
	
	Global.ModeList.ThicknessMode = new Mode( 

			// 모드 데이터
			{
				bodyClickEventHandler: function( e ){
					
					var $target = $(e.target);

					if( $target.get(0) === $thicknessToolBtn.get(0) ){
						return;
					}
					
					if( $target.closest("#thickness_tool_btn").length > 0 ){
						return;
					}
					
					ModeList.ThicknessMode.end();
					
				}
			},
			
			function start(){
				
				var mode = this;
				$body.on( "click", mode.data.bodyClickEventHandler );
				$thicknessPop.stop().fadeIn( 500 );
				
			},
			function end(){
				
				var mode = this;
				$body.off( "click", mode.data.bodyClickEventHandler );
				$thicknessToolBtn.removeClass("active");
				$thicknessPop.stop().fadeOut( 500 );
				Global.thickness = $thicknessSlider.slider( "value" );
			}
		);

}});