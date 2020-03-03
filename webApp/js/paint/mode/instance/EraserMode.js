$(function EraserMode(){ with( window.Global ){
	
	Global.ModeList.EraserMode = new Mode( 

			// 모드 데이터
			{
				downButton: null,
				sgk2dViewEventIdList: [],
				cursor: (function createCursor(){
					var cir = new SmartGeoKit2D.Circle("eraser");
					cir.scale.set( 20, 20 );
					cir.fillStyle = "#ffffff";
					cir.strokeStyle = "#000000";
					return cir;
				})()
			},
			
			function start(){
				
				var mode = this;
				
				// 지우개 설정
				var sgk2dViewCtx = sgk2dView.renderer.ctx;
				sgk2dViewCtx.save();
				
				var margin = $viewer.offset().top;
				
				// 모드 데이터 설정
				sgk2dView.enableMouseControl();
				
				// 커서용
				sgk2dDraw.run();
				mode.data.cursor.scale.set( Global.thickness, Global.thickness );
				
				mode.data.sgk2dViewEventIdList.push( 
					sgk2dView.on("mousedown", function( e, x, y ){
					
						mode.data.downButton = e.button;

						sgk2dViewCtx.beginPath();
							sgk2dViewCtx.arc( e.pageX - margin, e.pageY - margin, Global.thickness / 2, 0, Math.PI * 2 );
						sgk2dViewCtx.closePath();
						sgk2dViewCtx.save();
							sgk2dViewCtx.clip();
							sgk2dViewCtx.clearRect( e.pageX - margin -Global.thickness, e.pageY - margin -Global.thickness, e.pageX - margin +Global.thickness, e.pageY - margin +Global.thickness );
						sgk2dViewCtx.restore();
						
					}) 
				);
				
				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mousemove", function( e, x, y ){
						
						// 왼쪽 드래그
						if( mode.data.downButton === 0 ){
							sgk2dViewCtx.beginPath();
								sgk2dViewCtx.arc( e.pageX - margin, e.pageY - margin, Global.thickness / 2, 0, Math.PI * 2 );
							sgk2dViewCtx.closePath();
							sgk2dViewCtx.save();
								sgk2dViewCtx.clip();
								sgk2dViewCtx.clearRect( e.pageX - margin -Global.thickness, e.pageY - margin -Global.thickness, e.pageX - margin +Global.thickness, e.pageY - margin +Global.thickness );
							sgk2dViewCtx.restore();
						}
						
					})
				);
				
				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mouseup", function( e, x, y ){
						mode.data.downButton = null;
					})
				);
				
				mode.data.sgk2dViewEventIdList.push(
					sgk2dView.on("mousemove", function( e, x, y ){
						mode.data.cursor.position.set( x, y );
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