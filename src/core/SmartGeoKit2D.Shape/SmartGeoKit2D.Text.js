/**
	extends SmartGeoKit2D.Object2D
 **/
SmartGeoKit2D.Text = function sgk2d_text( id, _text ){
	SmartGeoKit2D.Shape.call( this, id );

	this.textAlign = "center";
	this.textBaseline = "middle";
	this.needsUpdate = true;
	this.borderWidth = 0;
	
	var text = _text;
	var fontFamily = "Arial";

	Object.defineProperties( this, {
		"text": {
			get: function get(){
				return text;
			},
			set: function set( value ) {
				text = value;
				this.updateSelectRange();
			}
		},
		"fontFamily": {
			get: function get(){
				return fontFamily;
			},
			set: function set( value ) {
				fontFamily = value;
				this.updateSelectRange();
			}
		}
	} );
	
	this.updateSelectRange();

};
SmartGeoKit2D.Text.prototype = Object.create( SmartGeoKit2D.Shape.prototype );
SmartGeoKit2D.Text.prototype.constructor = SmartGeoKit2D.Text;

// 텍스트는 데이터를 변경할 경우, 선택 범위가 바뀌므로 생긴 메서드
SmartGeoKit2D.Text.prototype.updateSelectRange = function sgk2d_text_updateSelectRange(){
	
	var textSize = SmartGeoKit2D.Util.getTextSize( this );
	var halfX = textSize.width / 20;
	var halfY = 1/2;
	
	this.selectRange = {
			x: [ -halfX, -halfX, halfX, halfX, -halfX ],
			y: [ -halfY, halfY, halfY, -halfY, -halfY ]
	};
	
};
SmartGeoKit2D.Text.prototype.isText = true;
SmartGeoKit2D.Text.prototype.drawn = function sgk2d_text_drawn( ctx, zoom ){
	this.applyPaint( ctx );
	// 폰트사이즈를 10px로 고정하고, 스케일링으로만 폰트사이즈를 조절 ( fontSize, scale 개념이 공존하면 혼란스러운 이유 ) 
	ctx.scale( 0.1, 0.1 );
	ctx.beginPath();
	ctx.textAlign = this.textAlign;
	ctx.textBaseline = this.textBaseline;
	ctx.closePath();
	
	var fontSize = 10;
	ctx.font = fontSize + "px " + this.fontFamily;
	
	if( this.borderWidth > 0 ){
		ctx.lineWidth = this.borderWidth; 
		ctx.strokeText( this.text, 0, 0 );
	}
	if( this.fillStyle != null ){
		ctx.fillText( this.text, 0,0 );
	}
};

// @TODO selectRange 구현 필요