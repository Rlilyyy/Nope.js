(function() {
	var root = this;

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

	var
		nativeCreate = Object.create,
		ObjProto = Object.prototype,
		toString = ObjProto.toString,
		hasOwnProperty = Object.hasOwnProperty;

	var
		join = Array.prototype.join;

	var
		ElementTravelSupport = ("firstElementChild" in document),
		classListSupport = ("classList" in document.body),
		DOM2EventSupport = ("addEventListener" in document.body),
		IEEventSupport = ("attachEvent" in document);

	// 浅复制一个对象
	np.simpleCopy = function(obj) {

		if(!np.isObjectOfStrict(obj))  return obj;

		var result = {};

		for(var idx in obj) {
			result[idx] = obj[idx];
		}

		return result;
	};

	// 深复制一个对象
	np.deepCopy = function(obj) {

		var result = {};

		for(var idx in obj) {

			typeof(obj[idx]) == "object"?

				result[idx] = np.deepCopy(obj[idx]):

				result[idx] = obj[idx];
		}

		return result;
	};

	// 获取节点的第一个元素节点
	np.firstElement = function(parentNode) {
		this == np ? parentNode = parentNode : parentNode = this[0];

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
	};

	// 获取节点的最后一个元素节点
	np.lastElement = function(parentNode) {
		this == np ? parentNode = parentNode : parentNode = this[0];

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
	};

	// 判断 property 是 object 的原型的属性而非构造函数的属性
	np.hasPrototypeProperty = function(object, property) {
		return !hasOwnProperty.call(object, property) && (property in object);
	};

	np.hasConstructorProperty = function(object, property) {
		return hasOwnProperty.call(object, property) && !!object;
	};

	// 获取 childNode 的前一个兄弟元素节点
	// 所有主流浏览器，包括 IE 6+
	np.previousElementSibling = np.preElem = function(childNode) {

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
	};

	// 获取 childNode 的下一个兄弟元素节点
	// 所有主流浏览器，包括 IE 6+
	np.nextElementSibling = np.nextElem = function(childNode) {

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
	};

	// 删除 node 的 className 类
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
	};

	// 事件监听添加
	np.addEventListener = np.on = function(node, type, handler) {
		if(DOM2EventSupport) {
			node.addEventListener(type, handler, false);
		}else if(IEEventSupport) {
			// 使用 call 解决 IE8- 下 attachEvent 的上下文一直为 window 的 "bug"
			node.attachEvent("on" + type, function(event) {
				handler.call(node, event);
			});
		}else {
			// eventQuene为事件队列
			if(np.isFunction(node["on" + type]) && np.isObjectOfStrict(node["on" + type].eventQuene)) {
				node["on" + type].eventQuene[handler] = handler;
			}else if(np.isFunction(node["on" + type])) {
				node["on" + type].eventQuene = {};
				node["on" + type].eventQuene[handler] = handler;

				node["on" + type] = function() {
					for(var idx in this["on" + type].eventQuene) {
						this["on" + type].eventQuene[idx]();
					}
				};
			}else {
				throw new Error("node is no an element");
			}
		}
	};

	// 事件监听删除
	np.removeEventListener = np.rm = function(node, type, handler) {
		if(DOM2EventSupport) {
			node.removeEventListener(type, handler, false);
		}else if(IEEventSupport) {
			node.detachEvent("on" + type, handler);
		}else {
			if(np.isFunction(node["on" + type]))
				delete node["on" + type].eventQuene[handler];
		}
	};

	// 所有主流浏览器，对于 documentElement 和 body 的不同，根据 compatMode，由使用者自己鉴定传入值
	np.scrollToBottom = function(node) {
		node.scrollTop = node.scrollHeight;
	};

	// 所有主流浏览器
	np.scrollToTop = function(node) {
		node.scrollTop = 0;
	};

	np.each = function(obj, iteratee, context) {

	};

	np.allKeys = function(obj) {
		if(!np.isObject(obj))	return [];
		var keys = [];

		for(var key in obj)	keys.push(key);

		return keys;
	};

	// isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError函数
	// isFunction 在 IE8- 下仍会有错误，一些核心的函数例如 document.getElementById 会被认为是 Object
	// 任何以 COM 对象构造的函数都将被 IE 识别为 Object，无论哪种判断方法
	var typeArray = ['Arguments', 'Function', 'Array', 'String', 'Number', 'Date', 'RegExp', 'Error'];
	var iteratee = function(name) {
		np["is" + name] = function(obj) {
			return toString.call(obj) == "[object " + name + "]";
		};
	};
	for(var idx in typeArray) {
		iteratee(typeArray[idx]);
	}

	// 截止至 Chrome 12 和 Safari 5 及各自之前的版本下，typeof 对正则表达式返回 function
	// IE 8 及之前的版本下，所有 Function 类型均被 typeof 识别为 Object（因 JScript 独立于浏览器以外）
	// Chrome、Safari、IE 9+
	// 效率更高
	if(typeof /./ != "function" && typeof Int8Array != "object") {
		np.isFunction = function(func) {
			return typeof func === "function" || false;
		}
	}

	// 对 Function 和 Object 都认为是 Object
	np.isObject = function(obj) {
		return np.isFunction(obj) || np.isObjectOfStrict(obj);
	};

	// Function 不再是 Object
	np.isObjectOfStrict = function(obj) {
		// null也为Object
		return typeof(obj) === "object" && !!obj;
	};

	// dataset 数据规范
	var arrangeData = function(name) {
		if(!np.isString(name))	return null;

		var arrangeArray = name.split("-");
		var arrangeName = "";

		for(var idx=arrangeArray.length-1;idx>=1;idx--) {
			arrangeArray[idx] = arrangeArray[idx].substring(0,1).toUpperCase() +
								arrangeArray[idx].substring(1);
		}

		arrangeName = arrangeArray.join("");

		return arrangeName;
	};

	// node : 元素节点
	// name : 想获取的dataset的某一个名称
	// GAFlag : 直接使用getAttribute
	// IE 5+
	// getAttribute的性能比dataset性能好
	np.getDatasetOf = function(node, name, GAFlag) {
		if(!node.nodeType || !np.isString(name))	return null;

		if(GAFlag === true)	return node.getAttribute("data" + name);

		var result = null;

		if(node.dataset) {
			result = node.dataset[arrangeData(name)];
		}else {
			result = node.getAttribute("data-" + name);
		}

		return result;
	};

	// 获取node的dataset集合
	np.getDataset = function(node) {
		if(!node.nodeType)	return null;

		var result = {};

		if(node.dataset) {
			result = node.dataset;
		}else {
			var attributes = node.attributes;

			for(var idx=attributes.length-1;idx>=0;idx--) {
				var attribute = attributes[idx].name;
				if(attribute.indexOf("data-") >= 0) {
					attribute = attribute.substring(attribute.indexOf("-")+1);
					result[arrangeData(attribute)] = attributes[idx].value;
				}
			}
		}

		return result;
	};

	// 排序基本算法，留待后用
	np.SORT = {
		// 选择排序
		// 时间复杂度O(n^2)
		Selection_sort: function(compare) {
			var length = compare.length;
			for(var i=0;i<length;i++) {
				var min = i;
				for(var j=i+1;j<length;j++) {
					if(compare[j] < compare[min]) {
						min = j;
					}
				}
				var temp = compare[i];
				compare[i] = compare[min];
				compare[min] = temp;
			}

			return compare;
		},

		// 插入排序
		// 最优复杂度：当输入数组就是排好序的时候，复杂度为O(n)
		// 最差复杂度：当输入数组为倒序时，复杂度为O(n^2)
		Insert_sort: function(compare) {
			var length = compare.length;
			for(var i=1;i<length;i++) {
				for(var j=i;j>0;j--) {
					if(compare[j] < compare[j-1]) {
						var temp = compare[j];
						compare[j] = compare[j-1];
						compare[j-1] = temp;
					} else {
						break;
					}
				}
			}
			return compare;
		},

		// 冒泡排序
		// 时间复杂度最好是O(n)，最坏是O(n^2)，O(n)的实现需要改进代码
		Bubble_sort: function(compare) {
			var length = compare.length;
			for(var i=length;i>0;i--) {
				for(var j=0;j<i-1;j++) {
					if(compare[j] > compare[j+1]) {
						var temp = compare[j];
						compare[j] = compare[j+1];
						compare[j+1] = temp;
					}
				}
			}

			return compare;
		},

		// 归并排序
		// O(nlgn)
		Merge_sort: function(compare) {
			function　merge(left, right){
				var　result=[];
				while(left.length>0 && right.length>0){
					if(left[0]<right[0]){
						result.push(left.shift());
					}else{
						result.push(right.shift());
					}
				}
				return　result.concat(left).concat(right);
			}
			function　mergeSort(items){
				if(items.length == 1){
					return　items;
				}
				var　middle = Math.floor(items.length/2),
					left = items.slice(0, middle),
					right = items.slice(middle);
					return　merge(mergeSort(left), mergeSort(right));
			}

			return mergeSort(compare)
		},

		// 快速排序
		// 当输入数组已排序时，时间为O(n^2)
		// 最好是O(nlgn)
		Quick_sort: function(compare) {
			function quick_sort(compare, left, right) {
				if(left >= right)   return;
				var flag = compare[left];
				var i = left, j=right;
				while(i != j) {
					while(i != j && compare[j] >= flag) {
						j--;
					}
					compare[i] = compare[j];
					while(i != j && compare[i] <= flag) {
						i++;
					}
					compare[j] = compare[i];
				}
				compare[i] = flag;
				quick_sort(compare, left, i-1);
				quick_sort(compare, i+1, right);
			}

			quick_sort(compare, 0, compare.length-1);
			return compare;
		},

		// 希尔排序
		// O(nlogn) O(ns) 1<s<2 不稳定 O(1) s是所选分组
		Shell_sort: function(compare) {
			var length = compare.length;
			for(var d=Math.floor(length / 2);d>0;d=Math.floor(d/2)){
				for(var i=d;i<length;i++){
					for(var j=i-d;j>=0 && compare[j]>compare[d+j];j-=d){
						var temp=compare[j];
						compare[j]=compare[d+j];
						compare[d+j]=temp;
					}
				}
			}
			return compare;
		}
	};

	// context : 上下文
	// func : 执行函数
	// maxCount : 测试次数
	// timeNick : 控制台对应测试时间名称
	// restArgs1 : 剩余参数1
	// restArgs2 : 剩余参数2
	// runWithTime用于对func函数进行maxCount次的性能测试
	np.runWithTime = function(context, func, maxCount, timeNick, restArgs1, restArgs2) {
		if(func == null)	throw new Error("No function to runWithTime!");

		context == null ? context = root : context = context;

		var args = [];
		for(var i=arguments.length-1;i>=4;i--) {
			if(restArgs2 == null && np.isArray(restArgs1)) {
				args = restArgs1;
				break;
			}
			args.push(arguments[i]);
		}
		args.reverse();

		console.time(timeNick);
		for(var idx=maxCount-1;idx>=0;idx--) {
			func.apply(context, args);
		}
		console.timeEnd(timeNick);
	};

	// 控制台打印
	np.log = function() {
		try {
			console.log.apply(console, arguments);
		} catch (e) {
			try {
				opera.postError.apply(opera, arguments);
			} catch (e) {
				alert(join.call(arguments, " "));
			}
		}
	};

	// 提供同步与异步测试的函数
	// 来自《JavaScript 忍者秘籍》
	// 需要配合 unit.css 和 <ul id="results"></ul>
	// 使用方法与 QUnit 类似，本书就是 JQuery 之父 John Resig 所写
	(function() {
		var quene = [], paused = false, results;
		np.test = function(name, fn) {

			quene.push(function() {
				results = document.getElementById("results");
				results = np.assert(true, name).appendChild(document.createElement("ul"));
				fn();
			});
			runTest();
		};

		np.pause = function() {
			paused = true;
		};

		np.resume = function() {
			paused = false;
			setTimeout(runTest, 1);
		};

		function runTest() {
			if(!paused && quene.length) {
				quene.shift()();
				if(!paused) {
					resume();
				}
			}
		}

		np.assert = function assert(value, desc) {
			var li = document.createElement("li");
			li.className = value ? "pass" : "fail";
			li.appendChild(document.createTextNode(desc));
			results.appendChild(li);
			if(!value) {
				li.parentNode.parentNode.className = "fail";
			}

			return li;
		};
	})();

	// 如果页面中引入了 require.js，默认模块化，则不暴露对象给全局变量。
	if(np.isFunction(define)) {
		define("Nope", function() {
			return np;
		});
	}else {
		typeof exports != "undefined" && !exports.nodeType ?
				(typeof module != "undefined" && !module.nodeType && module.exports != null ?
					exports = module.exports = np : exports.np = np) : root.np = np;
	}
})();
