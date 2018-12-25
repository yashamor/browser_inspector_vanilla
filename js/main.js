//Globals
let backgroundColors = {};

document.addEventListener("DOMContentLoaded", function() {
  //Create wrappers for body content and Inspector
  const bodyWrapper = document.createElement("div");
  bodyWrapper.id = "body";
  while (document.body.firstChild) {
    bodyWrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(bodyWrapper);

  var inspectorWrapper = document.createElement("div");
  inspectorWrapper.id = "inspector";
  document.body.appendChild(inspectorWrapper);
  //Walk through DOM recursevly and fill the Inspector with elements
  renderNodes(
    document.getElementById("body"),
    document.getElementById("inspector")
  );
});

function renderNodes(node, inspector) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    const inspectorNode = createInspectorNode(node.nodeName);
    if (node.parentNode.tagName !== "BODY") {
      inspectorNode.onmouseover = function(event) {
        event.stopPropagation();
        node.style.background = "#198433";
        node.parentNode.style.background = "#80ed9b";
      };

      inspectorNode.onmouseout = function(event) {
        event.stopPropagation();
        node.style.background = "transparent";
        node.parentNode.style.background = "transparent";
      };
    }
    inspector.appendChild(appendNodeStyles(inspectorNode));
    inspector = inspectorNode;

    for (let i = 0; i < node.children.length; i++) {
      renderNodes(node.children[i], inspectorNode);
    }
  }
}

const createInspectorNode = name => {
  const inspectorNode = document.createElement("div");
  const textNode = document.createTextNode(name);
  inspectorNode.appendChild(textNode);
  return inspectorNode;
};

const appendNodeStyles = element => {
  element.style.cssText =
    "display:flex; padding:5px; margin:5px; border:1px solid #000";
  if (backgroundColors.hasOwnProperty(element.textContent)) {
    element.style.background = backgroundColors[element.textContent];
  } else {
    const randomColor = getRandomColor();
    element.style.background = randomColor;
    backgroundColors[element.textContent] = randomColor;
  }
  return element;
};

//Helpers

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
