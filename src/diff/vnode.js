// 虚拟dom的构造函数
class Element {
  constructor(type, key, props, children, text) {
    this.type = type
    this.props = props
    this.key = key
    this.children = children
    this.text = text
  }
}

function vNode(type, key, props, children, text) {
  return new Element(type, key, props, children, text)
}

export { Element, vNode }
