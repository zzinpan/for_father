$(function PenMode(){ with( window.Global ){
	
	Global.ModeList.NewPageMode = new Mode( 

			// 모드 데이터
			{
				// nothing
			},
			
			function start(){
				
				var mode = this;
				
				// 모달 표시
				Modal.confirm( 
						"작업한 내용이 사라집니다. <br> 새 캔버스를 생성하시겠습니까?",
						function yes(){
							var w = sgk2dView.renderer.canvas.width;
							var h = sgk2dView.renderer.canvas.height;
							sgk2dView.renderer.ctx.clearRect( 0, 0, w, h );
							mode.end();
						},
						function no(){
							mode.end();
						}
				)
				
			},
			function end(){
				$tools.filter(".active").removeClass("active");
			}
		);

}});