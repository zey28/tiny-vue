import { observe } from './observe.js'

export default function (Vue) {
  Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    },
    set (newData) {
      if (newData !== this._data) {
        this._setData(newData)
      }
    }
  })

  Vue.prototype._initState = function () {
    this._initData()
  }

  Vue.prototype._initData = function () {

    var dataFn = this.$options.data
    var data = this._data = dataFn ? ( typeof dataFn == 'function' ? dataFn() : dataFn ) : {}   // 0 对外暴露的data字段

    var keys = Object.keys(data)
    var i, key
    i = keys.length
    while (i--) {
      key = keys[i]
      this._proxy(key)
    }
    // observe data
    observe(data, this)  // 4 此处也是使用Object.defineProperty ,将data变成可监听的.
  }

	Vue.prototype._proxy = function (key) {
		// need to store ref to self here
		// because these getter/setters might
		// be called by child scopes via
		// prototype inheritance.
		var self = this
		Object.defineProperty(self, key, {  // 1 将data对象的属性,绑定到vue实例自身上,只是充当一个代理作用. 
			configurable: true,
			enumerable: true,
			get: function proxyGetter () {
				return self._data[key]
			},
			set: function proxySetter (val) {
				self._data[key] = val  //2 当在vue实例中调用this.x会触发此处,进而修改原data数据
			}
		})
  }
}
