let uid = 0

/**
 * 观察者模式
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

export default function Dep () {
  this.id = uid++
  this.subs = []   //1 watcher收集于此
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub)
}

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this)  // 3 这一步也很高明, 让彼此相互收集对方, 像双向链表一样
}

/**
 * Notify all subscribers of a new value.
 */

Dep.prototype.notify = function () {   //2 当对应key的set触发时,就会触发notify,通知观察者
  // stablize the subscriber list first
  var subs = this.subs
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
