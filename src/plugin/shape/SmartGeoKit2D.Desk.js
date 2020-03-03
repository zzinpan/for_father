/**
	extends SmartGeoKit2D.Object2D
	총무포탈 전용 책상 ( 객체 중심 = 책상의 중심 )
 **/
SmartGeoKit2D.Desk = function sgk2d_desk( id ){
	SmartGeoKit2D.Shape.call( this, id );
	
	var pivot = SmartGeoKit2D.Desk.pivot.CENTER;
	
	Object.defineProperty( this, "pivot", {
		get: function getPivot(){
			return pivot;
		},
		set: function setZIndex( _pivot ) {
			pivot = _pivot;
			this.selectRange = SmartGeoKit2D.Desk.selectRanges[ pivot ];
			this.drawn = SmartGeoKit2D.Desk.draws[ pivot ];
		}
	} );
	
	this.selectRange = SmartGeoKit2D.Desk.selectRanges[ pivot ];
	this.drawn = SmartGeoKit2D.Desk.draws[ pivot ];
	this.edgeStyle = "rgba(0,0,0,0)";
	
	// 의자 가로 x세로 길이
	this.chairSize = null;
	
};

// 객체 중심점 및 선택 범위 변경
SmartGeoKit2D.Desk.pivot = {
	CENTER: 0, // 전체 선택, 객체 중심
	DESK: 1 // 책상만 선택, 책상 중심
};

SmartGeoKit2D.Desk.selectRanges = [

	// Center SelectRange
	{
		x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
		y: [ -0.5, 0.5, 0.5, -0.5, -0.5 ]
	},
	
	// Desk SelectRange
	{
		x: [ -0.5, -0.5, 0.5, 0.5, -0.5 ],
		y: [ -0.5, 0.5, 0.5, -0.5, -0.5 ]
	}
	
];

SmartGeoKit2D.Desk.draws = [
	
	// Center
	function sgk2d_desk_center_drawn( ctx, csdX, csdY ){
		this.applyPaint( ctx );
		var Math = SmartGeoKit2D.Math;
		
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.edgeStyle;
		ctx.rect( -0.5, -0.5, 1, 0.5 );
		if( this.chairSize == null ){
			// 의자
			ctx.rect( -0.18, 0.1, 0.36, 0.36 );
			
			// 의자뒤
			ctx.rect( -0.18, 0.48, 0.36, 0.02 );
			
			// 의자 왼쪽
			ctx.rect( -0.2, 0.18, -0.06, 0.22 );
	
			// 의자 오른쪽
			ctx.rect( 0.2, 0.18, 0.06, 0.22 );
		}else{
			
			ctx.scale( 1/this.scale.x, 1/this.scale.y );
			
			// 의자
			ctx.rect( -this.chairSize / 2, this.chairSize / 10, this.chairSize, this.chairSize );
			
			// 의자뒤
			ctx.rect( -this.chairSize / 2, this.chairSize + this.chairSize / 5, this.chairSize, this.chairSize / 10 );
			
			// 의자 왼쪽
			ctx.rect( - this.chairSize / 2 - this.chairSize / 4, this.chairSize / 3, this.chairSize / 6, this.chairSize / 1.5 );
			
			// 의자 오른쪽
			ctx.rect( this.chairSize / 2 + this.chairSize / 8, this.chairSize / 3, this.chairSize / 6, this.chairSize / 1.5 );
			ctx.lineWidth = this.lineWidth;
		}
		
		ctx.closePath();
		ctx.stroke();
		if( this.fillStyle != null ){
			ctx.fill();
		}
		ctx.restore();
		
		// 책상
		ctx.beginPath();
		ctx.strokeStyle = this.strokeStyle;
		ctx.rect( -0.5, -0.5, 1, 1 );
		ctx.closePath();
		ctx.stroke();
		
	},
	// Desk
	function sgk2d_desk_desk_drawn( ctx, csdX, csdY ){
		this.applyPaint( ctx );
		var Math = SmartGeoKit2D.Math;
		
		// 책상
		ctx.save();
		ctx.strokeStyle = this.edgeStyle;
		ctx.beginPath();
		if( this.chairSize == null ){

			
			ctx.scale( 1, 2 );
			
			// 의자
			ctx.rect( -0.18, 0.6 * 0.5, 0.36, 0.36 );
			
			// 의자뒤
			ctx.rect( -0.18, 0.6 * 0.5 + 0.38, 0.36, 0.02 );
			
			// 의자 왼쪽
			ctx.rect( -0.2, 0.68 * 0.5, -0.06, 0.22 );
			
			// 의자 오른쪽
			ctx.rect( 0.2, 0.68 * 0.5, 0.06, 0.22 );
			
		}else{

			ctx.scale( 1/this.scale.x, 1/this.scale.y );
			
			// 의자
			ctx.rect( -this.chairSize / 2, this.scale.y / 2 + this.chairSize / 10, this.chairSize, this.chairSize );
			
			// 의자뒤
			ctx.rect( -this.chairSize / 2, this.scale.y/2 + this.chairSize + this.chairSize / 5, this.chairSize, this.chairSize / 10 );
			
			// 의자 왼쪽
			ctx.rect( - this.chairSize / 2 - this.chairSize / 4, this.scale.y/2 + this.chairSize / 3, this.chairSize / 6, this.chairSize / 1.5 );
			
			// 의자 오른쪽
			ctx.rect( this.chairSize / 2 + this.chairSize / 8, this.scale.y/2 + this.chairSize / 3, this.chairSize / 6, this.chairSize / 1.5 );
			ctx.lineWidth = this.lineWidth;
		}
		ctx.closePath();
		
		ctx.stroke();
		if( this.fillStyle != null ){
			ctx.fill();
		}

		ctx.restore();
		ctx.beginPath();
		ctx.rect( -0.5, -0.5, 1, 1 );
		ctx.closePath();
		ctx.strokeStyle = this.edgeStyle;
		ctx.stroke();
		if( this.fillStyle != null ){
			ctx.fill();
		}
		ctx.strokeStyle = this.strokeStyle;
		ctx.stroke();
		
		
	}
	
];

SmartGeoKit2D.Desk.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Desk.prototype.constructor = SmartGeoKit2D.Desk;
SmartGeoKit2D.Desk.prototype.isDesk = true;

/**
	API 확장
**/
SmartGeoKit2D.prototype.plugins.push( "SmartGeoKit2D.Desk" );
SmartGeoKit2D.prototype.addDesk = function sgk2d_addDesk( id, parentId ){
	var object2d = this.getObjectById( id );
	SmartGeoKit2D.Debugger.assert( object2d != null, { 
		id: id, 
		msg: "id가 중복됩니다."
	} );
	var desk = new SmartGeoKit2D.Desk( id );
	var parentGroup = this.getObjectById( parentId ) || this.scene;
	parentGroup.add( desk );
	return desk;
};