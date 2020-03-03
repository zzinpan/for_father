$(function global(){
	
	/**
	 * 전역변수 모음
	 */
	
	var sgk2dDraw = (function(){
		var sgk2d = new SmartGeoKit2D("#viewer");
		$( sgk2d.renderer.canvas ).css({
			"position": "absolute",
			"z-index": "2",
			"top": "0px",
			"left": "0px"
		});
		return sgk2d;
	})();
	
	window.Global = {
		
		$window: $(window), // window $객체
		$body: $("html,body"), // body $객체
		$viewer: $("#viewer"), // 엔진 컨테이너 $객체
		$tools: $(".smc_tool_table"), // 툴
		$colorToolBtn: $("#color_tool_btn"), // 색상 툴 버튼
		$colorToolPreview: $("#color_tool_preview"), // 색상 미리보기
		$thicknessToolBtn: $("#thickness_tool_btn"), // 두께 툴 버튼
		$thicknessPop: $("#thickness_pop"), // 두께 팝업
		$thicknessSlider: $("#thickness_slider"), // 슬라이더
		$sliderHandle: $("#slider_handle"), // 슬라이더 핸들
		$thicknessPreviewInPop: $("#thickness_preview_in_pop"), // 팝업 내 두께 미리보기
		
		//bottom buttons
		$botBtns: $(".smc_bot_btn"), // 하단 버튼 모음
		$botImgBtn: $("#smc_bot_img_btn"), // 이미지 버튼
		
		sgk2dDraw: sgk2dDraw, // sgk2d 그리기 엔진
		sgk2dView: new SmartGeoKit2D("#viewer"), // sgk2d 보기 엔진
		ModeList: {}, // 모드 목록 Mode
		
		// ctx 관련 변수
		color: "#000000", // 색상
		thickness: 1
			
	};
	
	Prepage.show( "/image/paint/prepage.png", "Paint", 1000, function(){
	} );
	
});