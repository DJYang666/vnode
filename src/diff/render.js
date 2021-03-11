// 将虚拟dom转为真实dom
function render(vNode, target) {
  let el = createRealElement(vNode)
  let container = typeof target === 'string' ? document.querySelector(target) : target

  container && el && container.appendChild(el)
  return el;
}

function createRealElement(vNode) {
  const { type, key, props, children, text } = vNode;

  if (type) {
    vNode.realDom = document.createElement(type)

    setProperties(vNode);

    if (Array.isArray(children)) {
      children.forEach(child => render(child, vNode.realDom))
    }
  } else {
    vNode.realDom = document.createTextNode(text)
  }

  return vNode.realDom
}

function setProperties(newVNode, oldProps = {}) {
  const realDom = newVNode.realDom
  const newProps = newVNode.props

  for (const oldPropsKey in oldProps) {
    if (!newProps[oldPropsKey]) {
      realDom.removeAttribute(oldPropsKey)
    }
  }

  let newStyleObj = newProps.style || {};
  let oldStyleObj = oldProps.style || {};

  for (const key in oldStyleObj) {
    if (!newStyleObj[key]) realDom.style[key] = ""
  }

  for (const newPropsKey in newProps) {
    switch (newPropsKey) {
      case "style":
        const style = newProps[newPropsKey]
        for (const styleKey in style) {
          realDom.style[styleKey] = style[styleKey]
        }
        break;

      default:
        realDom.setAttribute(newPropsKey, newProps[newPropsKey])
        break;
    }
  }
}

export { render }
