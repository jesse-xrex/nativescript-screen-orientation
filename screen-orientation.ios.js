/**
 * Created by Sumeet on 06/04/17.
 */

var { Frame } = require("tns-core-modules/ui/frame");

/**
 * find the exact object by which the property is owned in the prototype chain
 * @param object
 * @param property
 * @returns {*}
 */

function findPrototypeForProperty(object, property) {
  while (false == object.hasOwnProperty(property)) {
    object = Object.getPrototypeOf(object);
  }
  return object;
}

/**
 * set should auto rotate
 * @param bool
 */
function setShouldAutoRotate(bool) {
  var topmostFrame = Frame.topmost();
  if (!topmostFrame) return;

  var prototypeForNavController = findPrototypeForProperty(
    topmostFrame.ios.controller,
    "shouldAutorotate"
  );
  Object.defineProperty(prototypeForNavController, "shouldAutorotate", {
    configurable: true,
    enumerable: false,
    get: function() {
      return bool;
    }
  });
}

/**
 * set current orientation and call the callback once the orientation is set
 * @param orientationType
 * @param callback
 */
function setCurrentOrientation(orientationType, callback) {
  if ("landscape" == orientationType.toLowerCase()) {
    UIDevice.currentDevice.setValueForKey(
      UIInterfaceOrientationLandscapeLeft,
      "orientation"
    );
    setShouldAutoRotate(false);
  } else if ("portrait" == orientationType.toLowerCase()) {
    UIDevice.currentDevice.setValueForKey(
      UIInterfaceOrientationPortrait,
      "orientation"
    );
    setShouldAutoRotate(false);
  } else if ("all" == orientationType.toLowerCase()) {
    setShouldAutoRotate(true);
  }
  if (undefined !== callback) {
    callback();
  }
}

/**
 * clean up the orientation
 */
function cleanupOrientation() {
  setShouldAutoRotate(true);
}

exports.setCurrentOrientation = setCurrentOrientation;

exports.orientationCleanup = cleanupOrientation;
