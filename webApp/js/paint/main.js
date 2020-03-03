$(function main(){ with( window.Global ){
	
	// 도구 변경
	$tools.on("click", function( e ){

		var $this = $(this);
		var $active = $tools.filter(".active");
		$viewer.css("cursor", "not-allowed");
		
		// 이전 모드 종료
		var beforeMode = $active.attr("data-mode");
		if( beforeMode != null ){
			ModeList[ beforeMode ].end();
			$active.removeClass("active");
		}
		
		// 같은 버튼을 누르면 취소
		if( $this.get(0) === $active.get(0) ){
			return;
		}
		
		var mode = $this.attr("data-mode");
		var cursor = $this.attr("data-cursor");
		$viewer.css("cursor", cursor);
		
		$this.addClass("active");
		ModeList[ mode ].start();
		
	});
	
	// bottom 버튼 관련
	(function bottomButtonLogic(){
		
		$botBtns.on("mousedown", function( e ){
			e.stopPropagation();
		});
		
		$botImgBtn.on("click", function( e ){
			
			var $input = (function createInput(){
				var $input = $("<input>");
				$input.attr({
					type: "file",
					accept: "image/*"
				});
				
				$input.on("change", function(){
					
					var reader = new FileReader();
					reader.onloadend = function () {
						var objects = sgk2dDraw.getObjectsByHandle();
						objects[ 0 ].image = new Image();
						objects[ 0 ].image.src = reader.result;
					}
					
					var file = $input.get(0).files[ 0 ];
					reader.readAsDataURL( file );
					
				});
				return $input;
			})();
			
			$input.trigger("click");
			
		});
		
		
	})();
	
	// 툴팁 관련 로직
	(function tooltipLogic(){

		// 툴팁 세팅
		$('[title]').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top+10",
				using: function( position, feedback ) {
					$( this ).css( position ).css( "pointer-events", "none" );
					$( "<div>" )
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
				}
			}
		});
		
		// 펜 툴팁 하나 표시
		var $penMode = $tools.filter("[data-mode='PenMode']");
		$penMode.tooltip("open");
		
	})();
	
	// 두께 관련 로직
	(function thicknessLogic(){
		
		// 슬라이드 변경 콜백
		function callback( event, ui ) {
			$sliderHandle.text( ui.value );
			
			var px = ui.value + "px";
			$thicknessPreviewInPop.css({
				width: px,
				height: px,
				"margin-left": 25 - ui.value / 2 + "px",
				"margin-top": 25 - ui.value / 2 + "px"
			});
		}
		
		// 두께 슬라이드 세팅
		$thicknessSlider.slider({
			min: 1,
			max: 50,
			value: 1,
			create: function() {
				$sliderHandle.text( $thicknessSlider.slider( "value" ) );
			},
			slide: callback,
			change: callback
	    });
		
		// 슬라이드 팝업이 버튼 내에 있으므로 버튼이 눌리는 것을 방지
		$thicknessPop.on("click", function( e ){
			e.stopPropagation();
		});
		
	})();
	
	// 색상 관련 로직
	(function colorLogic(){
		
		// 컬러표 등록
		$colorToolBtn.spectrum({
			showPalette: true,
			palette: ["black"],
			hide: function( color ) {
				$colorToolPreview.css("background-color", color.toHexString());
				ModeList.ColorMode.end();
			},
			move: function( color ){
				$colorToolPreview.css("background-color", color.toHexString());
			}
		});
		
	})();
	
	
}});