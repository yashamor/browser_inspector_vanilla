(function() {
  let backgroundColors = {};
  let inspectorIds = {};
  document.addEventListener("DOMContentLoaded", () => {
    const mainWrapper = document.createElement("main");
    mainWrapper.style.cssText = "position:relative;";
    const inspectorWrapper = document.createElement("div");
    inspectorWrapper.style.cssText = "position:absolute;bottom:50px;";

    while (document.body.firstChild) {
      mainWrapper.appendChild(document.body.firstChild);
    }

    document.body.appendChild(mainWrapper);
    document.body.appendChild(inspectorWrapper);

    renderNodes(mainWrapper, inspectorWrapper);
  });

  //Walk through DOM recursevly and fill the Inspector with elements.
  //Attach events to connect between Body and Inspector elements.
  const renderNodes = (node, inspector, index) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const inspectorNode = createInspectorNode(node.nodeName);

      inspectorNode.id = generateRandomNumber(1, 1000);
      appendStyles(inspectorNode);
      //connect mouse events between body and inspector
      inspectorNode.onmouseout = () => handleMouseOut(event, node);
      inspectorNode.onmouseover = () => handleMouseOver(event, node);

      //add drag&drop event handlers
      inspectorNode.setAttribute("draggable", true);
      inspectorNode.ondragstart = handleDragStart;
      inspectorNode.ondragover = handleDragOver;
      inspectorNode.ondragenter = handleDragEnter;
      inspectorNode.ondragleave = handleDragLeave;
      inspectorNode.ondrop = handleDrop;
      inspectorNode.ondragend = handleDragEnd;

      //append child to parent and replace it.
      inspector.appendChild(inspectorNode);
      inspector = inspectorNode;
      for (let i = 0; i < node.children.length; i++) {
        renderNodes(node.children[i], inspector, i);
      }
    }
  };

  const createInspectorNode = name => {
    const inspectorNode = document.createElement("div");
    const textNode = document.createTextNode(name);
    inspectorNode.appendChild(textNode);
    return inspectorNode;
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
    event.stopPropagation();
    event.target.style.opacity = "0.5";

    event.dataTransfer.setData("srcNode", event.target.id);
  };

  const handleDragOver = event => {
    event.stopPropagation();
    if (event.preventDefault) {
      event.preventDefault();
    }
    event.target.style.borderStyle = "dashed";
    return false;
  };
  const handleDragEnter = event => {
    event.stopPropagation();
    if (event.preventDefault) {
      event.preventDefault();
    }

    return false;
  };

  const handleDragLeave = event => {
    event.stopPropagation();
    event.target.style.borderStyle = "solid";
  };

  const handleDrop = event => {
    event.stopPropagation();
    if (event.preventDefault) {
      event.preventDefault();
    }
    console.log(event.dataTransfer.getData("srcNode"));
    return false;
  };

  const handleDragEnd = event => {
    event.stopPropagation();
    event.target.style.opacity = "1";
  };

  const appendStyles = element => {
    element.style.cssText =
      "display:flex; align-self:flex-end; padding:5px; margin:5px; border:1px solid #000;cursor:move";
    if (backgroundColors.hasOwnProperty(element.textContent)) {
      element.style.background = backgroundColors[element.textContent];
    } else {
      const randomColor = getRandomColor();
      element.style.background = randomColor;
      backgroundColors[element.textContent] = randomColor;
    }
  };

  //Helpers
  const getRandomColor = () => {
    const letters = "BCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  function generateRandomNumber(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }
})();
