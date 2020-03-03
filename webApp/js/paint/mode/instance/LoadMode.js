$(function LoadMode(){ with( window.Global ){
	
	
	Global.ModeList.LoadMode = new Mode( 

			// 모드 데이터
			{
				// nothing
			},
			
			function start(){
				
				var mode = this;
				
				
				// 모달 표시
				Modal.confirm( 
						"작업한 내용이 사라집니다. <br> 이미지를 불러오겠습니까?",
						function yes(){
							
							var $input = (function createInput(){
								var $input = $("<input>");
								$input.attr({
									type: "file",
									accept: "image/*"
								});
								
								$input.on("change", function(){
									
									var w = sgk2dView.renderer.canvas.width;
									var h = sgk2dView.renderer.canvas.height;
									sgk2dView.renderer.ctx.clearRect( 0, 0, w, h );
									
									var reader = new FileReader();
									reader.onloadend = function () {
										var image = new Image();
										image.src = reader.result;
										image.onload = function(){
											sgk2dView.renderer.ctx.drawImage( image, 0, 0, w, h );
										};
									};
									
									var file = $input.get(0).files[ 0 ];
									reader.readAsDataURL( file );
									
								});
								return $input;
							})();
							
							$input.trigger("click");
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