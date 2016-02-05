(function() {
	var root = this === window ? this : window;

	var np = function() {};

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