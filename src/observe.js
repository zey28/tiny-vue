import Dep from  './dep.js'

// 1 将整个data作为参数传入value
function Observer(value) {
  this.value = value
  this.dep = new Dep()  // 收集依赖的
  // TODO: support Array
  this.walk(value)
}

// Instance methods

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj)
  for (var i = 0, l = keys.length; i < l; i++) {  // data最外层的key依次交由connver转化
    this.convert(keys[i], obj[keys[i]])
  }
}


/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val)
}


/**
 * Add an owner vm, so that when $set/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */
Observer.prototype.addVm = function (vm) {
  (this.vms || (this.vms = [])).push(vm)
}

export function observe (value, vm) {
  const ob = new Observer(value)
  ob.addVm(vm)
  return ob
}


/**
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */
export function defineReactive (obj, key, val) {  //核心代码,采用订阅发布模式在get收集依赖,set触发依赖.
  var dep = new Dep()  //每个key都有一个dep与之对应
 
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
 
      var value =  val
      if (Dep.target) {
        dep.depend()  // 将全局Dep.target赋值的watch作为 观察者收集到dep中.
      }
      return value
    },
    set: function reactiveSetter (newVal) {

      var value =  val  //原始值
      val = newVal
      dep.notify() //触发依赖
    }
  })
}
