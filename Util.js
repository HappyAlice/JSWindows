// 事件绑定和解除
var Util = {
	on : function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			 element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},

	// 移除事件绑定
	off: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    // 获取事件类型
    getEvent : function(e){
    	return e || window.event;
    },

    // 获取鼠标在页面中的位置
    getPageAxis: function(event) {

            if(event.pageX || event.pageY){
                return {
                    x : event.pageX,
                    y : event.pageY
                }
            }

            var doc = document.documentElement;
            var body = document.body;

            return {
                x : event.clientX +
                    ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                    ( doc && doc.clientLeft || body && body.clientLeft || 0 ),
                y : event.clientY +
                    ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
                    ( doc && doc.clientTop  || body && body.clientTop  || 0 )
            }
    },

    //取消事件默认行为
    preventDefault:function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },

    // 阻止事件冒泡
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    }
}
