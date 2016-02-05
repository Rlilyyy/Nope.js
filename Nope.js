(function() {
	var root = this === window ? this : window;

	var np = function(selector) {
		var context = 
			this === root ? 
				context = document : context = this;
		
		return context.querySelectorAll(selector);
	};

	root.np = np;

	var nativeCreate = Object.create,
		ObjProto = Object.prototype,
		toString = ObjProto.toString;

	// 浅复制一个对象
	np.simpleCopy = function(obj) {

		if(!np.isObjectOfStrict(obj))  return obj;

		var result = {};

		for(var idx in obj) {
			console.log(idx)
			result[idx] = obj[idx];
		}

		return result;
	}

	// 深复制一个对象
	np.deepCopy = function(obj) {

		var result = {};

		for(var idx in obj) {

			typeof(obj[idx]) == "object"?

				result[idx] = np.deepCopy(obj[idx]):

				result[idx] = obj[idx];
		}

		return result;
	}

	// 获取节点的第一个元素节点
	np.firstElement = function(parentNode) {

		if(!!document.body.firstElementChild) {
			// IE 9+, FireFox 3.5+, Safari 4+, Chrome, Opera 10+
			return parentNode.firstElementChild;
		}else {
			// 所有主流浏览器
			var childNodes = parentNode.childNodes;
			for(var i=0;i<childNodes.length;i++) {
				if(childNodes[i].nodeType == 1)
					return childNodes[i];
			}
		}
	}

	np.lastElement = function(parentNode) {

		if(!!document.body.lastElementChild) {
			// IE 9+, FireFox 3.5+, Safari 4+, Chrome, Opera 10+
			return parentNode.lastElementChild;
		}else {
			// 所有主流浏览器
			var childNodes = parentNode.childNodes;
			for(var i=childNodes.length-1;i>=0;i--) {
				if(childNodes[i].nodeType == 1)
					return childNodes[i];
			}
		}
	}

	// 性能相对较差，但是兼容性最好
	np.isFunction = function(func) {
		return toString.call(func) === "[object Function]";
	}

	// Chrome 12和Safari 5及各自之前的版本下，typeof对正则表达式返回function
	// IE 8及之前的版本下，所有Function类型均被typeof识别为Object（因JScript独立于浏览器以外）
	// Chrome 12+、Safari 5+、IE 9+
	if(typeof /./ != "function" && typeof Int8Array != "object") {
		np.isFunction = function(func) {
			return typeof func === "function" || false;
		}
	}

	// 对Function和Object都认为是Object
	np.isObject = function(obj) {
		return np.isFunction(obj) || np.isObjectOfStrict(obj);
	}

	// Function不再是Object
	np.isObjectOfStrict = function(obj) {
		// null也为Object
		return typeof(obj) === "object" && !!obj;
	}

	
})();