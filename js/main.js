//Globals
let backgroundColors = {};

document.addEventListener("DOMContentLoaded", () => {
  //Create wrapper for body content
  const bodyWrapper = document.createElement("div");
  bodyWrapper.id = "body";
  while (document.body.firstChild) {
    bodyWrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(bodyWrapper);

  //Create wrapper for Inspector
  let inspectorWrapper = document.createElement("div");
  inspectorWrapper.style.cssText = "display:flex;";
  inspectorWrapper.id = "inspector";
  document.body.appendChild(inspectorWrapper);

  //Walk through DOM recursevly and fill the Inspector with elements.
  //Attach events to connect between Body and Inspector elements.
  renderNodes(
    document.getElementById("body"),
    document.getElementById("inspector")
  );
});

const renderNodes = (node, inspector) => {
  if (node.nodeType == Node.ELEMENT_NODE) {
    const inspectorNode =
      node.parentNode.tagName === "BODY"
        ? createInspectorNode("BODY")
        : createInspectorNode(node.nodeName);

    //connect mouse events between body and inspector
    inspectorNode.addEventListener(
      "mouseover",
      event => handleMouseOver(event, node),
      false
    );
    inspectorNode.addEventListener(
      "mouseout",
      event => handleMouseOut(event, node),
      false
    );

    //add drag&drop event handlers
    inspectorNode.setAttribute("draggable", true);
    inspectorNode.addEventListener("dragstart", handleDragStart, false);
    inspectorNode.addEventListener("dragenter", handleDragEnter, false);
    inspectorNode.addEventListener("dragleave", handleDragLeave, false);
    inspectorNode.addEventListener("drop", handleDrop, false);
    inspectorNode.addEventListener("dragend", handleDragEnd, false);

    //append child to parent and replace it.
    inspector.appendChild(appendNodeStyles(inspectorNode));
    inspector = inspectorNode;

    for (let i = 0; i < node.children.length; i++) {
      renderNodes(node.children[i], inspectorNode);
    }
  }
};

const createInspectorNode = name => {
  const inspectorNode = document.createElement("div");
  const textNode = document.createTextNode(name);
  inspectorNode.appendChild(textNode);
  return inspectorNode;
};

//how can I not return the element and implement element.appendNodeStyles ???
const appendNodeStyles = element => {
  element.style.cssText =
    "display:flex; align-self:flex-end; padding:5px; margin:5px; border:1px solid #000;cursor:move";
  if (backgroundColors.hasOwnProperty(element.textContent)) {
    element.style.background = backgroundColors[element.textContent];
  } else {
    const randomColor = getRandomColor();
    element.style.background = randomColor;
    backgroundColors[element.textContent] = randomColor;
  }
  return element;
};

const handleMouseOver = (event, node) => {
  event.stopPropagation();
  node.style.background = "#198433";
  node.parentNode.style.background = "#80ed9b";
};

const handleMouseOut = (event, node) => {
  event.stopPropagation();
  node.style.background = "none";
  node.parentNode.style.background = "none";
};

const handleDragStart = event => {
  event.target.style.opacity = "0.5";
};
const handleDragEnter = event => {
  event.target.style.borderStyle = "dashed";
};
const handleDragLeave = event => {
  event.target.style.borderStyle = "solid";
};
const handleDrop = event => {
  console.log(event);
};
const handleDragEnd = event => {
  event.target.style.opacity = "1";
};

//Helpers
function getRandomColor() {
  const letters = "BCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
