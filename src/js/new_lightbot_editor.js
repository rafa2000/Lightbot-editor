var lightbot = (function() {
  return {};
}());

(function() {
  lightbot.LightBotEditor = function(canvas) {
    var defaultMapData = {
      "direction": 0,
      "posX": 0,
      "posY": 0,
      "map": [
        ["1l", "1l", "1b", "1b", "1b", "1b", "1b", "1b"],
        ["1b", "2b", "2b", "1b", "1b", "1b", "1b", "1b"],
        ["1b", "1b", "3l", "1b", "1b", "1b", "1b", "1b"],
        ["1b", "1b", "2b", "1b", "1b", "1b", "1b", "1b"],
        ["1b", "1b", "1b", "1b", "1b", "1b", "1b", "1b"]
      ],
      "medals": {
        "gold": 3,
        "silver": 4,
        "bronze": 5
      }
    };

    var that = {};
    var ctx = canvas.get(0).getContext('2d');

    that.start = function() {
      console.log("start");
      lightbot.IsometricProjection.offsetX = canvas.get(0).width / 2;
      lightbot.IsometricProjection.clientHeight = canvas.get(0).height;
      that.map = lightbot.Map();
      that.map.loadMap(defaultMapData);
      that.map.draw(ctx)
    };

    that.rotateLeft = function() {
      that.map.rotateLeft();
      that.map.draw(ctx);
    };

    that.rotateRight = function() {
      that.map.rotateRight();
      that.map.draw(ctx);
    };

    return that;
  };
}());

(function() {
  lightbot.IsometricProjection = {
    offsetY: 50,
    project: function(x, y, z) {
      /*
       Math: http://en.wikipedia.org/wiki/Isometric_projection#Overview
       More Theory: http://www.compuphase.com/axometr.htm
       Angles used: vertical rotation=45°, horizontal rotation=arctan(0,5)
       projection matrix:
       | 0,707  0     -0,707 |
       | 0,321  0,891  0,321 |
       | 0,630 -0,453  0,630 |

       Additional offset!
       Y Axis is inverted.
       */
      return {'x': this.offsetX + 0.707 * x - 0.707 * z, 'y': this.clientHeight - (this.offsetY + 0.321 * x + 0.891 * y + 0.321 * z)};
    }
  };
}());

(function() {
  lightbot.Box = function() {
    var that = {};

    // dimension and position
    that.edgeLength = 50; // base is always a square so we only define length of one edge
    that.heightScale = 0.5; // the box height is weighted by this factor to make it look better

    // visual values
    var colorTop = "#c9d3d9"; //#ffa605"; // color of top facet
    var colorFront = "#adb8bd"; // "#e28b00"; // color of front facet
    var colorSide = "#e5f0f5"; // "#ffc133"; // color of side facet
    var strokeColor = "#485256"; // color of the stroke
    var strokeWidth = 0.5; // width of the stroke

    that.drawFrontFace = function(height, x, y, ctx) {
      // front face: p1 is bottom left and rest is counter-clockwise;
      ctx.fillStyle = colorFront;
      var p1 = lightbot.IsometricProjection.project(x * that.edgeLength, 0, y * that.edgeLength);
      var p2 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, 0, y * that.edgeLength);
      var p3 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p4 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
      ctx.stroke();
    };

    that.drawSideFace = function(height, x, y, ctx) {
      // left side face: p1 is bottom front and rest is counter-clockwise;
      ctx.fillStyle = colorSide;
      var p1 = lightbot.IsometricProjection.project(x * that.edgeLength, 0, y * that.edgeLength);
      var p2 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p3 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, (y + 1) * that.edgeLength);
      var p4 = lightbot.IsometricProjection.project(x * that.edgeLength, 0, (y + 1) * that.edgeLength);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
      ctx.stroke();
    };

    that.drawTopFace = function(height, x, y, ctx) {
      // top face: p1 is front left and rest is counter-clockwise
      ctx.fillStyle = colorTop;
      var p1 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p2 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p3 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, height * that.edgeLength, (y + 1) * that.edgeLength);
      var p4 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, (y + 1) * that.edgeLength);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
      ctx.stroke();
    };

    that.draw = function(height, x, y, ctx) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      height = height * that.heightScale;

      that.drawFrontFace(height, x, y, ctx);
      that.drawSideFace(height, x, y, ctx);
      that.drawTopFace(height, x, y, ctx);
    };

    return that;
  }
}());

(function() {
  lightbot.LightBox = function() {
    var that = lightbot.Box();

    // visual values
    var colorTopLightOff = "#0468fb";
    var colorTopLightOffOverlay = "#4c81ff";

    // overwrite default Box method
    that.drawTopFace = function(height, x, y, ctx) {
      // top face: p1 is front left and rest is counter-clockwise
      ctx.fillStyle = colorTopLightOff;
      var p1 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p2 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, height * that.edgeLength, y * that.edgeLength);
      var p3 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength, height * that.edgeLength, (y + 1) * that.edgeLength);
      var p4 = lightbot.IsometricProjection.project(x * that.edgeLength, height * that.edgeLength, (y + 1) * that.edgeLength);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
      ctx.stroke();

      // top face overlay: p1 is front left and rest is counter-clockwise
      var overlayOffset = 0.5 * that.edgeLength / 2;
      ctx.fillStyle = colorTopLightOffOverlay;
      p1 = lightbot.IsometricProjection.project(x * that.edgeLength + overlayOffset, height * that.edgeLength, y * that.edgeLength + overlayOffset);
      p2 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength - overlayOffset, height * that.edgeLength, y * that.edgeLength + overlayOffset);
      p3 = lightbot.IsometricProjection.project((x + 1) * that.edgeLength - overlayOffset, height * that.edgeLength, (y + 1) * that.edgeLength - overlayOffset);
      p4 = lightbot.IsometricProjection.project(x * that.edgeLength + overlayOffset, height * that.edgeLength, (y + 1) * that.edgeLength - overlayOffset);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.fill();
    };

    return that;
  }
}());

(function() {
  lightbot.Map = function() {
    var that = {};
    var levelSize = {}; // the level size
    var mapRef = []; // the actual map values
    var mapData = [];

    function mapHeight(cell) {
      return parseInt(cell.charAt(0));
    }

    function rotateArrayRight(data) {
      var w = data.length;
      var h = data[0].length;

      var retData = [];
      for (var i = 0; i < h; i++) {
        retData[i] = [];
      }

      for (i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
          retData[i][j] = data[w - j - 1][i];
        }
      }

      return retData;
    }

    that.loadMap = function(data) {
      mapData = data.map;

      // map files are defined user-friendly so we have to adapt to that
      levelSize.y = data.map[0].length; // we suppose map is a rectangle
      levelSize.x = data.map.length;

      mapRef = new Array(levelSize.x);
      for (var i = 0; i < levelSize.x; i++) {
        mapRef[i] = new Array(levelSize.y);
      }

      var box = lightbot.Box();
      var lightbox = lightbot.LightBox();
      for (i = 0; i < data.map.length; i++) {
        for (var j = 0; j < data.map[i].length; j++) {
          switch (data.map[i][j].charAt(1)) {
            case 'b':
              mapRef[i][j] = box;
              break;
            case 'l':
              mapRef[i][j] = lightbox;
              break;
            default:
              console.error('Map contains unsupported DrawableElement: ' + data.map[i][j].charAt(1));
              // fall back to box element
              mapRef[i][j] = box;
          }
        }
      }

      that.rotateRight();
      that.rotateRight();
    };

    function getHeight(x, y) {
      console.log(x + " - " + y);
      return mapHeight(mapData[x][y]);
    }

    that.rotateLeft = function() {
      that.rotateRight();
      that.rotateRight();
      that.rotateRight();
    };

    that.rotateRight = function() {
      var t = levelSize.x;
      levelSize.x = levelSize.y;
      levelSize.y = t;

      mapRef = rotateArrayRight(mapRef);
      mapData = rotateArrayRight(mapData);
    };

    that.draw = function(ctx) {
      ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

      // order is important for occlusion
      for (var i = levelSize.x - 1; i >= 0; i--) {
        for (var j = levelSize.y - 1; j >= 0; j--) {
          // draw the tile
          mapRef[i][j].draw(getHeight(i, j), i, j, ctx);
        }
      }
    };

    return that;
  }
}());


