(function() {
  let backgroundColors = {};
  let inspectorIds = [];
  document.addEventListener("DOMContentLoaded", () => {
    //create wrappers
    const mainWrapper = document.createElement("main");
    const inspectorWrapper = document.createElement("div");
    mainWrapper.id = "main";
    inspectorWrapper.id = "inspector";
    //run on body elements and move them under wrapper.
    while (document.body.firstChild) {
      mainWrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(mainWrapper);
    document.body.appendChild(inspectorWrapper);

    //append some styles to body and inner wrappers

    appendGlobalStyles(mainWrapper, inspectorWrapper);

    //do the magic
    renderNodes(mainWrapper, inspectorWrapper);
  });

  //Walk through DOM recursevly and fill the Inspector with elements.
  //Attach events to connect between Body and Inspector elements.
  const renderNodes = (node, inspector) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const inspectorNode = createInspectorNode(node.nodeName);

      appendIDs(node, inspectorNode);
      appendInspectorStyles(inspectorNode);
      //add mouse event handlers
      inspectorNode.onmouseout = handleMouseOut;
      inspectorNode.onmouseover = handleMouseOver;

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

  const handleMouseOver = event => {
    event.stopPropagation();
    const bodyElement = getBodyElementByInspectorID(event.target.id);
    bodyElement.style.background = "#198433";
    bodyElement.parentNode.style.background = "#80ed9b";
  };

  const handleMouseOut = event => {
    event.stopPropagation();
    const bodyElement = getBodyElementByInspectorID(event.target.id);
    bodyElement.style.background = "none";
    bodyElement.parentNode.style.background = "none";
  };

  const handleDragStart = event => {
    event.stopPropagation();
    event.target.style.opacity = "0.5";

    event.dataTransfer.setData("srcElementID", event.target.id);
  };

  const handleDragOver = event => {
    event.stopPropagation();
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (event.offsetX >= 0 && event.offsetX <= 5) {
      event.target.style.cssText += "box-shadow:inset 4px 0 0 0 #000";
    } else if (event.target.clientWidth - event.offsetX <= 5) {
      event.target.style.cssText += "box-shadow:inset -4px 0 0 0 #000";
    } else {
      event.target.style.cssText += "box-shadow:inset 0 0 0 4px #000";
    }
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
    event.target.style.cssText += "box-shadow:none";
  };

  const handleDrop = event => {
    event.stopPropagation();
    if (event.preventDefault) {
      event.preventDefault();
    }
    event.target.style.cssText += "box-shadow:none";
    const srcInspectorID = event.dataTransfer.getData("srcElementID");
    const toInspectorID = event.target.id;

    const srcInpectorElement = document.getElementById(srcInspectorID);
    const toInspectorElement = event.target;
    const srcBodyElement = getBodyElementByInspectorID(srcInspectorID);
    const toBodyElement = getBodyElementByInspectorID(toInspectorID);

    if (!srcInpectorElement.isSameNode(toInspectorElement)) {
      //if appending before
      if (event.offsetX >= 0 && event.offsetX <= 5) {
        toInspectorElement.parentNode.insertBefore(
          srcInpectorElement,
          toInspectorElement
        );
        toBodyElement.parentNode.insertBefore(srcBodyElement, toBodyElement);
        //if appending after (if no nextSibling append to parent)
      } else if (toInspectorElement.clientWidth - event.offsetX <= 5) {
        if (toInspectorElement.nextSibling) {
          toInspectorElement.parentNode.insertBefore(
            srcInpectorElement,
            toInspectorElement.nextSibling
          );
          toBodyElement.parentNode.insertBefore(
            srcBodyElement,
            toBodyElement.nextSibling
          );
        } else {
          toInspectorElement.parentNode.appendChild(srcInpectorElement);
          toBodyElement.parentNode.appendChild(srcBodyElement);
        }
        //if appending inside
      } else {
        toInspectorElement.appendChild(srcInpectorElement);
        toBodyElement.appendChild(srcBodyElement);
      }
    }
    return false;
  };

  const handleDragEnd = event => {
    event.stopPropagation();
    event.target.style.opacity = "1";
    const bodyElement = getBodyElementByInspectorID(event.target.id);
    bodyElement.style.background = "none";
    bodyElement.parentNode.style.background = "none";
  };

  const getBodyElementByInspectorID = inspectorID => {
    const digits = inspectorID.split("-")[1];
    return document.getElementById(`body-${digits}`);
  };

  const appendIDs = (bodyElement, inspectorElement) => {
    const ID = generateRandomID();
    bodyElement.id = `body-${ID}`;
    inspectorElement.id = `inspector-${ID}`;
  };

  //Styles
  const appendInspectorStyles = element => {
    element.style.cssText +=
      "display:flex; align-self:flex-end; padding:5px; margin:5px; border:1px solid #000;cursor:move";
    if (backgroundColors.hasOwnProperty(element.textContent)) {
      element.style.background = backgroundColors[element.textContent];
    } else {
      const randomColor = getRandomLightColor();
      element.style.background = randomColor;
      backgroundColors[element.textContent] = randomColor;
    }
  };

  appendGlobalStyles = (mainWrapper, inspectorWrapper) => {
    inspectorWrapper.style.cssText +=
      "display:flex; width:100%; padding-bottom:50px; background-color:#eee;";
    mainWrapper.style.margin = "5px";
    document.documentElement.style.height = "100%";
    document.body.style.cssText +=
      "height:100%; margin:0; display:flex; flex-direction:column; justify-content:space-between;";
  };

  //Helpers
  const getRandomLightColor = () => {
    const letters = "BCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  const generateRandomID = () => {
    const min = 1;
    const max = 1000000;
    let returnedID;
    let isUnique = false;
    do {
      const randomID = parseInt(Math.random() * (max - min) + min);
      if (!inspectorIds.includes(randomID)) {
        inspectorIds.push(randomID);
        returnedID = randomID;
        isUnique = true;
      }
    } while (!isUnique);
    return returnedID;
  };
})();
