(function() {
	var root = this === window ? this : window;


	// IE 8+, FireFox 3.5+, Safari 3.1+, Chrome, Opera 10+
	var np = function(selector) {
		var context =
			this.length > 0 ?
				this[0] : this === root ?
					document : this;

		var result = context.querySelectorAll(selector);
			result.np = np;

		for(var idx in np) {
			result[idx] = np[idx];
		}

		return result;
	};

	root.np = np;

	var
		nativeCreate = Object.create,
		ObjProto = Object.prototype,
		toString = ObjProto.toString,
		hasOwnProperty = Object.hasOwnProperty;

	var
		ElementTravelSupport = ("firstElementChild" in document),
		classListSupport = ("classList" in document.body),
		DOM2EventSupport = ("addEventListener" in document.body);

	// 浅复制一个对象
	np.simpleCopy = function(obj) {

		if(!np.isObjectOfStrict(obj))  return obj;

		var result = {};

		for(var idx in obj) {
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

		if(ElementTravelSupport) {
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

	// 获取节点的最后一个元素节点
	np.lastElement = function(parentNode) {

		if(ElementTravelSupport) {
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

	// 判断property是object的原型的属性而非构造函数的属性
	np.hasPrototypeProperty = function(object, property) {
		return !hasOwnProperty.call(object, property) && (property in object);
	}

	np.hasConstructorProperty = function(object, property) {
		return hasOwnProperty.call(object, property) && !!object;
	}

	// 获取childNode的前一个兄弟元素节点
	// 所有主流浏览器，包括IE 6+
	np.previousElementSibling = function(childNode) {

		if(ElementTravelSupport) {
			// IE 9+, FireFox 3.5+, Safari 4+, Chrome, Opera 10+
			return childNode.previousElementSibling;
		}else {
			// 所有主流浏览器
			var previousSibling = childNode.previousSibling;

			while(previousSibling.nodeType != 1) {
				previousSibling = previousSibling.previousSibling;
			}

			return previousSibling;
		}
	}

	// 获取childNode的下一个兄弟元素节点
	// 所有主流浏览器，包括IE 6+
	np.nextElementSibling = function(childNode) {

		if(ElementTravelSupport) {
			// IE 9+, FireFox 3.5+, Safari 4+, Chrome, Opera 10+
			return childNode.nextElementSibling;
		}else {
			// 所有主流浏览器
			var nextSibling = childNode.nextSibling;

			while(nextSibling.nodeType != 1) {
				nextSibling = nextSibling.nextSibling;
			}

			return nextSibling;
		}
	}

	// 删除node的className类
	np.removeClass = function(node, className) {

		if(classListSupport) {
			// FireFox 3.6+, chrome
			node.classList.remove(className);
		}else {
			// 所有主流浏览器
			var classList = node.className.split(/\s+/);

			for(var idx in classList) {
				if(classList[idx] == className) {
					classList.splice(idx, 1);
					node.className = classList.join(" ");
					break;
				}
			}
		}
	}

	// 事件监听添加
	np.addEventListener = function(node, type, handler) {
		if(DOM2EventSupport) {
			node.addEventListener(type, handler,false);
		}else {
			// eventQuene为事件队列
			if(np.isFunction(node["on" + type]) && np.isObjectOfStrict(node["on" + type].eventQuene)) {
				node["on" + type].eventQuene[handler] = handler;
			}else {

				node["on" + type] = function() {
					for(var idx in this["on" + type].eventQuene) {
						this["on" + type].eventQuene[idx]();
					}
				}
				node["on" + type].eventQuene = {};
				node["on" + type].eventQuene[handler] = handler;
			}
		}
	}

	// 事件监听删除
	np.removeEventListener = function(node, type, handler) {
		if(DOM2EventSupport) {
			node.removeEventListener(type, handler, false);
		}else {
			if(np.isFunction(node["on" + type]))
				delete node["on" + type].eventQuene[handler];
		}
	}

	// 所有主流浏览器，对于documentElement和body的不同，根据compatMode，由使用者自己鉴定传入值
	np.scrollToBottom = function(node) {
		node.scrollTop = node.scrollHeight;
	}

	// 所有主流浏览器
	np.scrollToTop = function(node) {
		node.scrollTop = 0;
	}

	np.each = function(obj, iteratee, context) {

	}

	np.allKeys = function(obj) {
		if(!np.isObject(obj))	return [];
		var keys = [];

		for(var key in obj)	keys.push(key);

		return keys;
	}

	// isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError函数
	var typeArray = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'];
	var iteratee = function(name) {
		np["is" + name] = function(obj) {
			return toString.call(obj) == "[object " + name + "]";
		}
	}
	for(var idx in typeArray) {
		iteratee(typeArray[idx]);
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
