// 收集dom的变化，以及将变化update到真实dom上
import { Element } from './vnode'
import { render } from './render';

let index = 0;

function patch(node, patchs) {
  walk(node, patchs)
}

function walk(node, patchs) {
  const currentIndex = index++
  const currentPatch = patchs[currentIndex]
  const childNodes = node.childNodes;

  if (currentPatch) {
    doPatch(node, currentPatch)
  }

  childNodes.forEach(child => {
    walk(child, patchs)
  })
}

function doPatch(node, patch) {
  patch.forEach(p => {
    switch (p.type) {
      case 'ATTR':
        Object.keys(p.attr).forEach(key => {
          setAttr(node, key, p.attr[key])
        })
        break;
      case 'TEXT':
        node.textContent = p.text
        break;
      case 'REPLACE':
        let newNode = p.newNode instanceof Element ? render(p.newNode) : document.textContent(p.newNode)
        node.parentNode.replaceChild(newNode, node)
        break;
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break;
      default:
        break;
    }
  })
}

function setAttr(element, key, value) {
  switch (key) {
    case 'value':
      const nodeName = element.nodeName.toUpperCase()
      if (nodeName === "INPUT" || nodeName === "TEXTAREA") {
        element.value = value
      } else {
        element.setAttribute(key, value);
      }
      break;
    case 'style':
      setStyle(element, value)
      break;
    default:
      element.setAttribute(key, value);
      break;
  }
}

function setStyle(element, style) {
  for (const key in style) {
    element.style[key] = style[key]
  }
}

export { patch };
