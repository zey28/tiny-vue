import Dep from './dep.js'

let uid = 0

export default function Watcher (vm, expOrFn, cb) {
  vm._watchers.push(this)
  this.vm = vm
  this.expOrFn = expOrFn  //就是一个字符串比如 user.name+user.age
  this.expression = expOrFn
  this.cb = cb
  this.id = ++uid // uid for batching
  this.deps = []
  this.depIds = new Set()

  // TODO: support expression, like: "'Hello' + user.name"
  this.getter = () => {
    return vm[expOrFn]
  }
  this.setter = (vm, value) => {
    return vm[expOrFn] = value
  }

  this.value = this.get()  //去触发 get函数,让dep进行收集,同时取得值
}

// set时,  dep通知 watcher的对外暴露的方法.
Watcher.prototype.update = function () {
  this.run()
}
Watcher.prototype.run = function () {
  const value = this.get()  // 获取修改后的值, 此处实现与之前看到的不同,它是通过this.depIds这个set排除重复收集的情况
  const oldValue = this.value  //之前的值

  if (value !== oldValue) {
    this.cb.call(this.vm, value, oldValue)  //  cb是真正使用新值 执行渲染的逻辑
  }
}
Watcher.prototype.get = function () {
  Dep.target = this
  const value = this.getter.call(this.vm, this.vm)
  Dep.target = null
  return value
}
Watcher.prototype.set = function (value) {
  return this.setter.call(this.vm, this.vm, value)
}
Watcher.prototype.addDep = function (dep) {
  if (!this.depIds.has(dep.id)) {// 此处过滤 防止重复收集 
    this.deps.push(dep)
    this.depIds.add(dep.id)
    dep.addSub(this)
  }
}
