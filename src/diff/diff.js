// 主要负责虚拟dom的diff
// 层级比较，当没有新节点的时候，就要移除老节点
// 节点相同的时候，就要判断“属性”跟“子节点”是否相同
// 当节点内容是String或者是Number的时候，先比较是否相等，然后再做处理
// 当以上集中情况都不匹配的时候，说明节点是不一样的类型，直接替换

let INDEX = 0; // 标记当前比较到第几个节点

function diff(oldNode, newNode) {
  let patch = {}

  walk(oldNode, newNode, INDEX, patch)
  return patch
}

const ATTR = "ATTR"
const TEXT = "TEXT"
const REMOVE = "REMOVE"
const REPLACE = "REPLACE"

function walk(oldNode, newNode, index, patch) {
  let currentPatch = []

  if (!newNode) {
    currentPatch.push({ type: REMOVE, index: index })
  } else if (!oldNode.children && !newNode.children) {
    if (oldNode.text != newNode.text) currentPatch.push({ type: TEXT, text: newNode.text })
  } else if (oldNode.type === newNode.type) {
    const newAttrs = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(newAttrs).length > 0) {
      currentPatch.push({ type: ATTR, attr: newAttrs })
    }

    // 处理子节点
    if (oldNode.children && newNode.children) {
      diffChildren(oldNode.children, newNode.children, index, patch)
    } else if (!newNode.children) {
      currentPatch.push({ type: REMOVE, index: index })
    } else if (!oldNode.children) {
      currentPatch.push({ type: REPLACE, newNode })
    }
  } else {
    currentPatch.push({ type: REPLACE, newNode })
  }

  if (currentPatch.length) patch[index] = currentPatch
}

function diffAttr(oldAttr, newAttr) {
  let attrs = {}
  for (const key in oldAttr) {
    if (oldAttr[key] !== newAttr[key]) attrs[key] = newAttr[key]
  }

  if (oldAttr && newAttr) {
    let newStyleObj = newAttr.style || {}
    let oldStyleObj = oldAttr.style || {}

    for (const key in oldStyleObj) {
      if (!newStyleObj[key]) {
        attrs.style[key] = ""
      }
    }
  }

  return attrs
}

function diffChildren(oldChildren, newChildren, index, patch) {
  oldChildren.forEach((children, idx) => {
    walk(children, newChildren[idx], ++INDEX, patch)
  })
}

export { diff }
