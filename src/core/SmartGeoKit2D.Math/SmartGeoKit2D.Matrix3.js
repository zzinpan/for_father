/**
	SmartGeoKit2D.Matrix3
 **/
SmartGeoKit2D.Matrix3 = function sgk2d_matrix3(){
	
	// 단위 행렬 생성
	this.identity();
	
};
SmartGeoKit2D.Matrix3.prototype.isMatrix3 = true;
/**
	단위 행렬로 초기화
 **/
SmartGeoKit2D.Matrix3.prototype.identity = function sgk2d_matrix3_identity(){
	this.elements = [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	];
	return this;
};
/**
	행렬 전체 셋팅
 **/
SmartGeoKit2D.Matrix3.prototype.setAll = function sgk2d_matrix3_setAll( m11, m12, m13, m21, m22, m23, m31, m32, m33 ){
	this.elements = [
		
		m11, m12, m13,
		m21, m22, m23,
		m31, m32, m33
		
	];
	return this;
};
/**
	행렬 셋팅
 **/
SmartGeoKit2D.Matrix3.prototype.set = function sgk2d_matrix3_set( row, col, value ){
	return this;
};
/**
	행렬 대 행렬 곱
 **/
SmartGeoKit2D.Matrix3.prototype.multiply = function sgk2d_matrix3_multiply( matrix3 ){
	
	var a = this.elements; 
	var b = matrix3.elements;
	
	var arr = [];
	arr[ 0 ] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
	arr[ 1 ] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
	arr[ 2 ] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
	
	arr[ 3 ] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
	arr[ 4 ] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
	arr[ 5 ] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
	
	arr[ 6 ] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
	arr[ 7 ] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
	arr[ 8 ] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
	
	this.elements = arr;
	
};

SmartGeoKit2D.Matrix3.prototype.getMultiplyMatrix3 = function sgk2d_matrix3_multiply( matrix3 ){
	
	var newM = new SmartGeoKit2D.Matrix3();
	
	var a = this.elements; 
	var b = matrix3.elements;
	
	newM.elements[ 0 ] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
	newM.elements[ 1 ] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
	newM.elements[ 2 ] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
	
	newM.elements[ 3 ] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
	newM.elements[ 4 ] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
	newM.elements[ 5 ] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
	
	newM.elements[ 6 ] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
	newM.elements[ 7 ] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
	newM.elements[ 8 ] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
	
	return newM;
};

SmartGeoKit2D.Matrix3.prototype.getInverseMatrix3 = function sgk2d_matrix3_getInverseMatrix3(){
	
	var m = this.elements;
	var d = m[ 0 ] * m[ 4 ] * m[ 8 ] + m[ 1 ] * m[ 5 ] * m[ 6 ] + m[ 2 ] * m[ 3 ] * m[ 7 ]
				- ( m[ 2 ] * m[ 4 ] * m[ 6 ] + m[ 1 ] * m[ 3 ] * m[ 8 ] + m[ 0 ] * m[ 5 ] * m[ 7 ] );
	
	var matrix = new SmartGeoKit2D.Matrix3();
	var nM = matrix.elements;
	
	nM[ 0 ] = ( m[ 4 ] * m[ 8 ] - m[ 5 ] * m[ 7 ] ) / d;
	nM[ 1 ] = -( m[ 1 ] * m[ 8 ] - m[ 2 ] * m[ 7 ] ) / d;
	nM[ 2 ] = ( m[ 1 ] * m[ 5 ] - m[ 2 ] * m[ 4 ] ) / d;
	
	nM[ 3 ] = -( m[ 3 ] * m[ 8 ] - m[ 5 ] * m[ 6 ] ) / d;
	nM[ 4 ] = ( m[ 0 ] * m[ 8 ] - m[ 2 ] * m[ 6 ] ) / d;
	nM[ 5 ] = -( m[ 0 ] * m[ 5 ] - m[ 2 ] * m[ 3 ] ) / d;
	
	nM[ 6 ] = ( m[ 3 ] * m[ 7 ] - m[ 4 ] * m[ 6 ] ) / d;
	nM[ 7 ] = -( m[ 0 ] * m[ 7 ] - m[ 1 ] * m[ 6 ] ) / d;
	nM[ 8 ] = ( m[ 0 ] * m[ 4 ] - m[ 1 ] * m[ 3 ] ) / d;
	
	return matrix;
	
};




