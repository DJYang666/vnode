// 将模板解析的结果转为虚拟dom
import { vNode } from './vnode'

function createElement(type, props = {}, children) {
  let key;
  if (props.key) {
    key = props.key
    delete props.key
  }

  if (Array.isArray(children)) {
    children = children.map((child) => {
      if (typeof child === 'string') return vNode(undefined, undefined, undefined, undefined, child)
      return child
    })
  } else if (typeof children === 'string') {
    children = [vNode(undefined, undefined, undefined, undefined, children)]
  }
  return vNode(type, key, props, children)
}

export default createElement;