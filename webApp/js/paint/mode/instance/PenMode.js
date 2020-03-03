$(function PenMode(){ with( window.Global ){
	
	Global.ModeList.PenMode = new Mode( 

			// 모드 데이터
			{
				downButton: null,
				sgk2dViewEventIdList: [],
				cursor: (function createCursor(){
					var rect = new SmartGeoKit2D.Rectangle("pencil");
					rect.scale.set( 20, 20 );
					rect.fillStyle = "rgba(0,0,0,0)";
					rect.image = new Image();
					rect.image.src = "/image/paint/pencil.png";
					return rect;
				})()
			},
			
			function start(){
				
				var mode = this;
				
				// 펜 설정
				var sgk2dViewCtx = sgk2dView.renderer.ctx;
				sgk2dViewCtx.save();
				sgk2dViewCtx.strokeStyle = Global.color;
				sgk2dViewCtx.lineCap = "round";
				sgk2dViewCtx.lineWidth = Global.thickness;
				
				var margin = $viewer.offset().top;
				
				// 모드 데이터 설정
				sgk2dView.enableMouseControl();
				
				// 커서 설정
				sgk2dDraw.run();
				mode.data.sgk2dViewEventIdList.push( 
					sgk2dView.on("mousedown", function( e, x, y ){
					
						mode.data.downButton = e.button;
						
						sgk2dViewCtx.beginPath();
						sgk2dViewCtx.moveTo( e.pageX - margin, e.pageY - margin );
						sgk2dViewCtx.lineTo( e.pageX - margin, e.pageY - margin );
						sgk2dViewCtx.stroke();
						
					}) 
				);
				
				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mousemove", function( e, x, y ){
						
						// 왼쪽 드래그
						if( mode.data.downButton === 0 ){
							sgk2dViewCtx.lineTo( e.pageX - margin, e.pageY - margin );
							sgk2dViewCtx.stroke();
						}
						
					})
				);
				
				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mouseup", function( e, x, y ){
						
						mode.data.downButton = null;
						sgk2dViewCtx.closePath();
						
					})
				);

				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mousemove", function( e, x, y ){
						mode.data.cursor.position.set( x + 10, y + 10 );
					})	
				);
				
				mode.data.sgk2dViewEventIdList.push(
						sgk2dView.on("mouseenter", function( e ){
							sgk2dDraw.addObject( mode.data.cursor );
						})	
				);
				
				mode.data.sgk2dViewEventIdList.push(
						sgk2dView.on("mouseleave", function( e ){
							sgk2dDraw.removeObject( mode.data.cursor );
						})	
				);
				
			},
			function end(){
				
				var mode = this;
				var sgk2dViewCtx = sgk2dView.renderer.ctx;
				
				sgk2dViewCtx.restore();
				for( var i=0; i<mode.data.sgk2dViewEventIdList.length; ++i ){
					var eventId = mode.data.sgk2dViewEventIdList[ i ];
					sgk2dView.off( eventId );
				}
				mode.data.sgk2dViewEventIdList = [];
				mode.data.downButton = null;
				sgk2dView.disableMouseControl();
				sgk2dDraw.removeObjectAll();
				sgk2dDraw.stop();
				
			}
		);

}});