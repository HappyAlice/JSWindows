

function simpleWindows(){
	this.isMin = false,
	this.isMax = false,
	this.isDragable = true;

	this.init();	
}

simpleWindows.prototype = {
	// constructor : simpleWindows,

	// 初始化函数
	init : function(){
		var _self = this;
		_self._createWindow();
		_self._getInformation();
		_self._headerMax();
		_self.drag();
		_self._buttonAction();
		_self.changeSize();
	},

	// 创建窗体节点
	_createWindow : function(){
		// 获取包裹窗体的panel
		var panel = document.getElementById("parent-container");
			this.panel = panel;
		
		// 创建window整个对象对象
		// var winObj = document.createElement("div"); 
		// 	winObj.className = "simple-window-container";
		// 	this.winObj = winObj;

		// 创建window元素
		var winElement = document.createElement("div"); 
			winElement.className = "simple-window";
			// winObj.appendChild(winElement);
			this.winElement = winElement;

		// 创建window-heade
		var winHead = document.createElement("div");
			winHead.className = "simple-window-head";
			winElement.appendChild(winHead);
			this.winHead = winHead;

		// 创建window-title
		var winTitle = document.createElement("li");
			winTitle.className = "icon title";
			winHead.appendChild(winTitle);

		// 创建有序列表 最小化 最大化 关闭
		var ol = document.createElement("ol");
			ol.className = "simple-window-resize";
			winHead.appendChild(ol);

		// 创建最小化按钮
		var btnMin = document.createElement("li");
			btnMin.className = "icon btn-min-top";
			btnMin.title = "最小化";
			ol.appendChild(btnMin);
			this.btnMin = btnMin;

		// 创建最大化按钮
		var btnMax = document.createElement("li");
			btnMax.className ="icon btn-max";
			btnMax.title = "最大化";
			ol.appendChild(btnMax);
			this.btnMax = btnMax;

		// 创建关闭按钮
		var btnClose = document.createElement("li");
			btnClose.className = "icon btn-close";
			btnClose.title = "关闭";
			ol.appendChild(btnClose);
			this.btnClose = btnClose;

		// 创建window-body
		var winBody = document.createElement("div");
			winBody.className = "simple-window-body";
			winElement.appendChild(winBody);
			this.winBody = winBody;

		// 添加整个window对象到页面中
		panel.appendChild(winElement);
	},

	// 获取并设置要初始化的弹窗的位置和高度
	_getInformation : function(){
		var _self = this;

		// 获取panel的大小
		var panel = _self.panel;
		var panelInfo = panel.getBoundingClientRect();
		this.panelInfo = panelInfo;	

		// 获取框中输入窗体的位置的值
		var positionXval = parseInt(document.getElementById("win-positionX").value.trim()),
			positionYval = parseInt(document.getElementById("win-positionY").value.trim());

		// 获取框中输入窗体的大小 的值
		var winWidthVal = parseInt(document.getElementById("win-width").value.trim()),
			winHeightVal = parseInt(document.getElementById("win-height").value.trim());

		// 获取框中输入窗体的title 和 content
		var titleText = document.getElementById("win-title").value,
		 	contentText = document.getElementById("win-content").value;

		// 创建指定大小的windows 
		if (isNaN(positionXval) || isNaN(positionYval)) {
			positionXval = 300;
			positionYval = 100;
		};
		if (isNaN(winWidthVal) || isNaN(winHeightVal)) {
			winWidthVal = 200;
			winHeightVal = 200;
		}else{}

		var left = positionXval,
		    top = positionYval,
		    width = winWidthVal,
		    height = winHeightVal;

		_self.moveTo(left, top);
		_self.resizeTo(width, height);
		this.winBody.style.height = height - 43 + "px";  //body的高度=高度-border
	},	

	// 位置移动
	moveTo : function(left,top){
		var _self = this;
		var style = this.winElement.style;

		style.left = left + "px";
		style.top = top + "px";
	},

	// 大小改变
	resizeTo : function(width, height){
		var _self = this;
		var style = this.winElement.style;
		style.width = width + "px";
		style.height = height + "px";
		this.winBody.style.height = height - 43 + "px";
	},

	// 保存窗体原有信息
	winPrevInfoStore : function(){
		var	left = parseInt(this.winElement.style.left),
			top = parseInt(this.winElement.style.top),

			width = this.winElement.offsetWidth,
			height = this.winElement.offsetHeight;

		return {
			left :  left,
			top : top,
			width : width,
			height : height
		}
	},

	// 最大化
	maximize : function(){
		var _self = this;
		var panelInfo = this.panelInfo		

		_self.moveTo(0, 0); //移动到相对父容器的左上角

		_self.resizeTo(panelInfo.width, panelInfo.height); //调用大小改变函数	
		_self.isMax = true;
	},

	// 还原（大小和位置）
	restoreTo : function(left, top, width, height){
		var _self = this;
		_self.moveTo(left, top);
		_self.resizeTo(width, height);
		_self.winBody.style.height = height - 43 + "px";
		
		_self.isMax = false;
		_self.isMin = false;
	},

	//设置鼠标样式改变
	_setMouseStyle : function(){
		var _self = this;
		var style;  //设置鼠标样式
		var windowSize,
			windowPosition,
			MousePrev;		

		Util.on(this.winElement, "mousemove", setCursor);

		function setCursor(){  //设置鼠标样式
			if (_self.isDrag || _self.isMax) {return;}
			
			var winPrevInfo = _self.winElement.getBoundingClientRect(); //每次move都去取得窗体的基本信息
			
			var mouseX = event.clientX + (document.body.scrollLeft),
				mouseY = event.clientY + (document.body.scrollTop);  //获取鼠标当前的位置

			if (mouseX >= winPrevInfo.right - 8 && mouseX <= winPrevInfo.right) {  //E
				_self.deraction = "E";
				style = "e-resize";
				if (mouseY >= winPrevInfo.bottom - 8 &&  mouseY <= winPrevInfo.bottom) { //SE
					_self.deraction = "SE";
					style = "se-resize";
				}else if(mouseY >= winPrevInfo.top &&  mouseY <= winPrevInfo.top +8){ //NE
					_self.deraction = "NE";
					style = "ne-resize";
				};

			}else if(mouseX >= winPrevInfo.left && mouseX <= winPrevInfo.left + 8 ){  //W
				_self.deraction = "W";
				style = "w-resize";

				if (mouseY <= winPrevInfo.bottom && mouseY >= winPrevInfo.bottom - 8  ) {  //SW
					_self.deraction = "SW";
					style = "sw-resize";
				}else if(mouseY >= winPrevInfo.top &&  mouseY <= winPrevInfo.top +8){  //NW
					_self.deraction = "NW";
					style = "nw-resize";
				};

			}else if(mouseY >= winPrevInfo.bottom - 8 &&  mouseY <= winPrevInfo.bottom){ //S
				_self.deraction = "S";
				style = "s-resize";
			}else if(mouseY >= winPrevInfo.top + 43  &&  mouseY <= winPrevInfo.top + 50){  //N
				_self.deraction = "N";
				style = "n-resize";
			}else{
				_self.deraction = "";
				style = "default";	
			}
			_self.winElement.style.cursor = style;
		 }
	},

	// 边沿缩放
	changeSize : function(){
		var _self = this;
		var style;  //设置鼠标样式
		var deraction;  //鼠标移动方向
		var windowSize,
			windowPosition,
			MousePrev;
		var max = 350,
			min = 150;
		var width,height,left,top;
		var panelInfo = _self.panelInfo;
		
		this._setMouseStyle(); //调用函数，设置鼠标样式

		Util.on(this.winElement, "mousedown", dragDown);

		function dragDown(event){

			event = Util.getEvent(event);
			_self.isDrag = true;

			var mousedownPosition = Util.getPageAxis(event);
			MousePrev = { //获取鼠标当前的位置 (点击时位置)
				x : mousedownPosition.x,
				y : mousedownPosition.y
			}

			windowSize = {  //获取窗体当前的大小 (点击时大小)
				width :  _self.winElement.offsetWidth,
				height :  _self.winElement.offsetHeight,
			}
		
			windowPosition = {  //获取窗体当前的位置 (点击时位置)
				left : parseInt(_self.winElement.style.left),
				top : parseInt(_self.winElement.style.top)
			}

			// 判断，当前窗体最大化，禁止缩放,
			if (windowSize.width == panelInfo.width) {
				_self.isMax = true;
				return;
			}

			width = windowSize.width;
			height = windowSize.height;
			left = windowPosition.left;
			top = windowPosition.top;

			Util.on(document, "mousemove", dragMove);
			Util.on(document, "mouseup", dragStop);
		}	

		function dragMove(event){
			event = Util.getEvent(event);
			var winPrevInfo = _self.winElement.getBoundingClientRect();

			//鼠标移动位置
			var mousemovePosition = Util.getPageAxis(event);
			var MouseNew = {
				x : mousemovePosition.x,
				y : mousemovePosition.y
			}

			//鼠标移动偏移量
			var offsetX = MouseNew.x - MousePrev.x;
			var offsetY = MouseNew.y - MousePrev.y;

			switch(_self.deraction){
				case "E" :
					width =  windowSize.width + offsetX;
					break;
				case "N" :
					height = windowSize.height - offsetY;
					top = windowPosition.top  + offsetY;
					break;
				case "S" :
					height = windowSize.height + offsetY;
					break;
				case "W" :
					width =  windowSize.width - offsetX;
					left = windowPosition.left  + offsetX;
					break;
				case "NW" :
					height = windowSize.height - offsetY;
					top = windowPosition.top  + offsetY;
					width =  windowSize.width - offsetX;
					left = windowPosition.left  + offsetX;
					break;
				case "NE" :
					height = windowSize.height - offsetY;
					top = windowPosition.top  + offsetY;
					width =  windowSize.width + offsetX;
					break;
				case "SW" :
					height = windowSize.height + offsetY;
					width =  windowSize.width - offsetX;
					left = windowPosition.left  + offsetX;
					break;
				case "SE" :
					height = windowSize.height + offsetY;
					width =  windowSize.width + offsetX;
					break;
			}

			// 限制窗体缩放的尺寸
			width = width > max ? max : width;
			height = height > max ? max : height;
			width = width < min ? min : width;
			height = height < min ? min : height;

			// 判断缩放的范围，在外围的范围内
			left = left <= 0 ? 0 : left;
			top = top <= 0 ? 0 : top;	
			width = winPrevInfo.width + winPrevInfo.left >= panelInfo.right ? panelInfo.right - winPrevInfo.left : width;
			height = winPrevInfo.height + winPrevInfo.top >= panelInfo.bottom ? panelInfo.bottom - winPrevInfo.top : height;

			//窗体缩放，左侧在在靠左或者靠上时，禁止窗体大小继续变化
			if (left == 0 || top == 0) {     
				return;
			}

			// 窗体最大或者最小时禁止位置和大小变化
			if (width == max || width == min) {
				return;
			}else{}
			if (height == max || height == min) {
				return;
			}else{}

			_self.resizeTo(width,height);
			_self.moveTo(left,top);
			
		}	

		function dragStop(){
			_self.isDrag = false;
			Util.off(document, "mouseup", dragStop);
			Util.off(document, "mousemove", dragMove);
		}
	},

	// 拖动
	drag : function(){
		var _self = this,
			mousePrevInfo,
			winPrevInfo,
			panelInfo,
			windowSize,
			windowPosition;

		Util.on(_self.winHead, "mousedown", moveDown);

		// 阻止头部点击事件冒泡
        Util.on(_self.winHead, "mousedown", function(event) {
            Util.stopPropagation(event);
        });
		
		function moveDown(event){
			event = Util.getEvent();
			panelInfo = _self.panelInfo;

			var mousedownPosition = Util.getPageAxis(event);
			mousePrevInfo = { //获取鼠标当前位置
				x : mousedownPosition.x,
				y : mousedownPosition.y
			}
		
			windowSize = { //获取窗体大小
				width :  _self.winElement.offsetWidth,
				height :  _self.winElement.offsetHeight,
			}
		
			windowPosition = { //获取窗体位置
				left : parseInt(_self.winElement.style.left),
				top : parseInt(_self.winElement.style.top)
			}

			// 判断，当前窗口最大化的话，禁止拖动
			if (windowSize.width == panelInfo.width) {
				return;
			};

			Util.on(document, "mousemove", moveing);
			Util.on(document, "mouseup", moveEnd);
		}

		function moveing(event){
			event = Util.getEvent();
			//鼠标移动位置
			var mousemovePosition = Util.getPageAxis(event);
			var MouseNew = {
				x : mousemovePosition.x,
				y : mousemovePosition.y
			}

			//鼠标移动偏移量
			var offsetX = MouseNew.x - mousePrevInfo.x;
			var offsetY = MouseNew.y - mousePrevInfo.y;
			
			var left = windowPosition.left + offsetX;
			var top = windowPosition.top + offsetY;

			//边沿判断
			left = left <= 0 ? 0 : left;
			left = left >= panelInfo.width - windowSize.width ? (panelInfo.width - windowSize.width) : left;
			top = top <= 0 ? 0 : top;
			top = top >= panelInfo.height - windowSize.height  ? (panelInfo.height - windowSize.height) : top;
			
			_self.moveTo(left,top);
		}

		function moveEnd(){
			Util.off(document, "mousemove", moveing);
			Util.off(document, "mouseup", moveEnd);
		}
	},

	// 双击头部 最大化或者还原
	_headerMax : function(){
		var _self = this;
		var panelInfo = _self.panelInfo;

		var prePosition = {  //保存窗体原有的位置
			left : parseInt(this.winElement.style.left),
			top : parseInt(this.winElement.style.top)
		}
		var preSize = {  //保存窗体原有的大小
			width : this.winElement.offsetWidth,
			height : this.winElement.offsetHeight
		}

		// 双击头部最大化和还原
		Util.on(this.winHead, "dblclick", function(){
			var e = Util.getEvent();
			var target = e.target;
			if (target != (_self.btnMin || _self.btnMax || _self.btnClose)) {

				if (_self.isMax) {  //当前最大，还原
					_self.restoreTo(prePosition.left, prePosition.top, preSize.width, preSize.height);
					
				}else{ //最大化
					_self.maximize();
				}
			}			
		});
	},

	// 关闭
	winClose : function(){
		var _self = this;
		_self.panel.removeChild(_self.winElement);
	},

	// 窗体头部三个按钮事件
	_buttonAction : function(){
		var _self = this;
		// 点击最小按钮 最小化 或者 还原
		Util.on(_self.btnMin, "click", function(){
			if (_self.isMin) { //已经最小  还原
				_self.restoreTo(_self.winPrevInfo.left, _self.winPrevInfo.top, _self.winPrevInfo.width, _self.winPrevInfo.height);
				_self.winBody.style.display = "block";
				_self.isMin = false;
			}else{ //不是最小 折叠缩小
				_self.winPrevInfo = _self.winPrevInfoStore(); //每次都获取窗体的信息并保存
				_self.resizeTo(_self.winPrevInfo.width, _self.winHead.clientHeight);
				_self.winBody.style.display = "none";
				_self.isMin = true;
			};
		});

		// 绑定最大化按钮，点击最大化或者还原
		Util.on(this.btnMax, "click", function(){
			if (_self.isMax) { //已经最大  还原
				_self.restoreTo(_self.winPrevInfo.left, _self.winPrevInfo.top, _self.winPrevInfo.width, _self.winPrevInfo.height);
				_self.isMax = false;
			}else{  //不是最大  最大化
				_self.winPrevInfo = _self.winPrevInfoStore(); //每次都获取窗体的信息并保存
				_self.maximize();
			}			
		});

		// 绑定关闭按钮，点击关闭
		Util.on(this.btnClose, "click", function(){
			_self.winClose();
		});
	}
}

var createBtn = document.getElementById("win-create");
Util.on(createBtn, "click", function(){
	new simpleWindows();
});
