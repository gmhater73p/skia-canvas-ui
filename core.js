const CanvasKit = await CanvasKitInit({ locateFile: (file) => "https://unpkg.com/canvaskit-wasm@0.35.0/bin/" + file });

const fontData = await (await fetch("fonts/Inter-VariableFont.ttf")).arrayBuffer();
const fontMgr = CanvasKit.FontMgr.FromData(fontData);
const typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(fontData);
const font = new CanvasKit.Font(typeface, 12);

// Classes

/**
 * Vector class with 2 points.
 * 
 * This class is mutable for performance reasons involving internal calculations.
 * 
 * Despite being mutable, any changes to this object's properties will not result in a UIObject update. Create a new Vector2 instance if you would like to modify any properties.
 * @public
 */
export class Vector2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x = 0, y = 0) {
        if (isNaN(x)) throw new Error("x is NaN");
        if (isNaN(y)) throw new Error("y is NaN");
        this.x = x;
        this.y = y;
        //Object.freeze(this);
    }

    /**
     * The length of the vector
     */
    get length() { return Math.sqrt(this.x * this.x + this.y * this.y); }

    /**
     * A normalized copy of the vector
     */
    get normalized() { return Vector2.divide(this, this.length); }

    /**
     * Returns a Vector2 linearly interpolated between this Vector2 and `to` by amount `weight`
     * @param {Vector2} to The Vector2 to interpolate to
     * @param {number} weight The amount of interpolation
     * @returns {Vector2} The resulting Vector2
     */
    lerp(to, weight) {
        if (!to instanceof Vector2) throw new Error("to is not Vector2");
        if (isNaN(weight)) throw new Error("weight is NaN");
        return new Vector2(this.x * (1 - weight) + to.x * weight, this.y * (1 - weight) + to.y * weight);
    }

    /**
     * Adds two Vector2s together
     * @param {Vector2} a
     * @param {Vector2} b
     * @returns {Vector2} The resulting Vector2
     */
    static add(a, b) {
        if (!a instanceof Vector2) throw new Error("a is not Vector2");
        if (!b instanceof Vector2) throw new Error("b is not Vector2");
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    /**
     * Subtracts one Vector2 from another
     * @param {Vector2} a
     * @param {Vector2} b
     * @returns {Vector2} The resulting Vector2
     */
    static subtract(a, b) {
        if (!a instanceof Vector2) throw new Error("a is not Vector2");
        if (!b instanceof Vector2) throw new Error("b is not Vector2");
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    /**
     * Multiplies a Vector2 by a number or two Vector2s together
     * @param {Vector2} a
     * @param {Vector2|number} b
     * @returns {Vector2} The resulting Vector2
     */
    static multiply(a, b) {
        if (!a instanceof Vector2) throw new Error("a is not Vector2");
        if (!b instanceof Vector2 || isNaN(b)) throw new Error("b is not Vector2 or number");
        return b instanceof Vector2 ? new Vector2(a.x * b.x, a.y * b.y) : new Vector2(a.x * b, a.y * b);
    }

    /**
     * Divides a Vector2 by a number or one Vector2 by another
     * @param {Vector2} a
     * @param {Vector2|number} b
     * @returns {Vector2} The resulting Vector2
     */
    static divide(a, b) {
        if (!a instanceof Vector2) throw new Error("a is not Vector2");
        if (!b instanceof Vector2 || isNaN(b)) throw new Error("b is not Vector2 or number");
        return b instanceof Vector2 ? new Vector2(a.x / b.x, a.y / b.y) : new Vector2(a.x / b, a.y / b);
    }

    static zero = new Vector2(0, 0);
    static one = new Vector2(1, 1);
    static xAxis = new Vector2(1, 0);
    static yAxis = new Vector2(0, 1);
}

/**
 * Screen dimension class; consists of a scale and an offset to determine where a point is located on the screen.
 * 
 * The final computed result is `(parent UI object size * scale) + offset`
 * 
 * This class is immutable; you cannot assign to its properties once it is created.
 * @public
 */
export class SDim {
    /**
     * @param {number} scale
     * @param {number} offset
     * @example <caption>Creates an SDim with a scale of 0.5 and an offset of 0</caption>
     * new SDim(0.5);
     * @example <caption>Creates an SDim with a scale of 0 and an offset of 200</caption>
     * new SDim(0, 200);
     */
    constructor(scale = 0, offset = 0) {
        if (isNaN(scale)) throw new Error("scale is NaN");
        if (isNaN(offset)) throw new Error("offset is NaN");
        /**
         * A number that is a percentage of the parent UI object's size
         * @type {number}
         * @public
         */
        this.scale = scale;
        /**
         * A number that represents the pixel offset of the SDim
         * @type {number}
         * @public
         */
        this.offset = offset;
        Object.freeze(this);
    }

    /**
     * Creates a SDim from a scale value (equivalent to passing only one value to the constructor)
     * @param {number} scale
     * @returns {SDim} The new SDim
     */
    static fromScale(scale = 0) {
        if (isNaN(scale)) throw new Error("scale is NaN");
        return new SDim(scale);
    }

    /**
     * Creates a SDim from an offset value
     * @param {number} offset
     * @returns {SDim} The new SDim
     */
    static fromOffset(offset = 0) {
        if (isNaN(offset)) throw new Error("offset is NaN");
        return new SDim(0, offset);
    }

    /**
     * Adds two SDims together
     * @param {SDim} a
     * @param {SDim} b
     * @returns {SDim} The resulting SDim
     */
    static add(a, b) {
        if (!a instanceof SDim) throw new Error("a is not SDim");
        if (!b instanceof SDim) throw new Error("b is not SDim");
        return new SDim(a.scale + b.scale, a.offset + b.offset);
    }

    /**
     * Subtracts one SDim from another
     * @param {SDim} a
     * @param {SDim} b
     * @returns {SDim} The resulting SDim
     */
    static subtract(a, b) {
        if (!a instanceof SDim) throw new Error("a is not SDim");
        if (!b instanceof SDim) throw new Error("b is not SDim");
        return new SDim(a.scale - b.scale, a.offset - b.offset);
    }
}

/**
 * Screen dimension class; consists of a scale and an offset to determine where a point is located on the screen.
 * 
 * The final computed result is `(parent UI object size * scale) + offset`
 * 
 * This class is immutable; you cannot assign to its properties once it is created.
 * @public
 */
export class SDim2 {
    /**
     * @param {number} [scaleX=0]
     * @param {number} [offsetX=0]
     * @param {number} [scaleY]
     * @param {number} [offsetY]
     * @example <caption>Creates an SDim2 with a scale of 0.2, 0.5 and an offset of 300, 200</caption>
     * new SDim2(0.2, 300, 0.5, 200);
     * @example <caption>Creates an SDim2 with a scale of 0, 0 and an offset of 300, 200</caption>
     * new SDim2(300, 200);
     */
    constructor(scaleX = 0, offsetX = 0, scaleY, offsetY) {
        if (isNaN(scaleX)) throw new Error("scaleX is NaN");
        if (isNaN(offsetX)) throw new Error("offsetX is NaN");
        if (scaleY !== undefined && isNaN(scaleY)) throw new Error("scaleY is NaN");
        if (offsetY !== undefined && isNaN(offsetY)) throw new Error("offsetY is NaN");
        /**
         * A number that is a percentage of the parent UI object's size along the X axis
         * @type {number}
         * @public
         */
        this.scaleX = offsetY !== undefined ? scaleX : 0;
        /**
         * A number that represents the X axis pixel offset of the SDim2
         * @type {number}
         * @public
         */
        this.offsetX = offsetY !== undefined ? offsetX : scaleX;
        /**
         * A number that is a percentage of the parent UI object's size along the Y axis
         * @type {number}
         * @public
         */
        this.scaleY = offsetY !== undefined ? scaleY : 0;
        /**
         * A number that represents the Y axis pixel offset of the SDim2
         * @type {number}
         * @public
         */
        this.offsetY = offsetY !== undefined ? offsetY : offsetX;
        Object.freeze(this);
    }

    get x() { return new SDim(this.scaleX, this.offsetX); }
    get y() { return new SDim(this.scaleY, this.offsetY); }

    /**
     * Creates an SDim2 from two scale values
     * @param {number} scaleX
     * @param {number} scaleY
     * @example <caption>Creates an SDim2 with a scale of 0.2, 0.5 and an offset of 0, 0</caption>
     * SDim2.fromScale(0.2, 0.5);
     * @returns {SDim2} The new SDim2
     */
    static fromScale(scaleX = 0, scaleY = 0) {
        if (isNaN(scaleX)) throw new Error("scaleX is NaN");
        if (isNaN(scaleY)) throw new Error("scaleY is NaN");
        return new SDim2(scaleX, 0, scaleY, 0);
    }

    /**
     * Creates a SDim2 from two offset values (equivalent to passing two values to the constructor)
     * @param {number} offsetX
     * @param {number} offsetY
     * @example <caption>Creates a SDim2 with a scale of 0, 0 and an offset of 300, 200</caption>
     * SDim2.fromOffset(300, 200);
     * @returns {SDim2} The new SDim2
     */
    static fromOffset(offsetX = 0, offsetY = 0) {
        if (isNaN(offsetX)) throw new Error("offsetX is NaN");
        if (isNaN(offsetY)) throw new Error("offsetY is NaN");
        return new SDim2(offsetX, offsetY);
    }

    /**
     * Creates a SDim2 from two SDims
     * @param {SDim} x
     * @param {SDim} y
     * @example <caption>Creates a SDim2 with a scale of 0.2, 0.5 and an offset of 300, 200</caption>
     * SDim2.fromSDim(new SDim(0.2, 300), new SDim(0.5, 200));
     * @returns {SDim2} The new SDim2
     */
    static fromSDim(x = new SDim(), y = new SDim()) {
        if (!x instanceof SDim) throw new Error("x is not SDim");
        if (!y instanceof SDim) throw new Error("y is not SDim");
        return new SDim2(x.scale, x.offset, y.scale, y.offset);
    }

    /**
     * Adds two SDim2s together
     * @param {SDim2} a
     * @param {SDim2} b
     * @returns {SDim2} The resulting SDim2
     */
    static add(a, b) {
        if (!a instanceof SDim2) throw new Error("a is not SDim2");
        if (!b instanceof SDim2) throw new Error("b is not SDim2");
        return new SDim2(
            a.scaleX + b.scaleX,
            a.offsetX + b.offsetX,
            a.scaleY + b.scaleY,
            a.offsetY + b.offsetY
        );
    }

    /**
     * Subtracts one SDim2 from another
     * @param {SDim2} a
     * @param {SDim2} b
     * @returns {SDim2} The resulting SDim2
     */
    static subtract(a, b) {
        if (!a instanceof SDim2) throw new Error("a is not SDim2");
        if (!b instanceof SDim2) throw new Error("b is not SDim2");
        return new SDim2(
            a.scaleX - b.scaleX,
            a.offsetX - b.offsetX,
            a.scaleY - b.scaleY,
            a.offsetY - b.offsetY
        );
    }
}

/**
 * Color class for storing RGBA values
 * 
 * This class is immutable; you cannot assign to its properties once it is created.
 * @public
 */
export class Color {
    /**
     * Create a Color with the given RGBA values in the range [0-1].
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} [a=1]
     * @example <caption>Create a Color with RGB values (255, 0, 0) (Red)</caption>
     * new Color(1, 0, 0);
     * @example <caption>Create a Color with RGBA values (0, 255, 0, 0.5) (Partially transparent green)</caption>
     * new Color(0, 1, 0, 0.5);
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        if (isNaN(r)) throw new Error("r is NaN");
        if (isNaN(g)) throw new Error("g is NaN");
        if (isNaN(b)) throw new Error("b is NaN");
        if (isNaN(a)) throw new Error("a is NaN");
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this._ckColor = CanvasKit.Color4f(r, g, b, a);
        Object.freeze(this);
    }

    /**
     * Creates a Color with the given RGB values, with RGB in the range [0-255] and A in the range [0-1].
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} [a=1]
     * @example <caption>Create a Color with RGB values (255, 0, 0) (Red)</caption>
     * Color.fromRGB(255, 0, 0);
     * @example <caption>Create a Color with RGBA values (0, 255, 0, 0.5) (Partially transparent green)</caption>
     * Color.fromRGB(0, 255, 0, 0.5);
     */
    static fromRGB(r = 0, g = 0, b = 0, a = 1) {
        return new Color(r / 255, g / 255, b / 255, a);
    }

    /**
     * Creates a Color with the given HSVA values, with H in the range [0-360] and SVA in the range [0-1].
     * @param {number} h
     * @param {number} s
     * @param {number} v
     * @param {number} [a=1]
     */
    static fromHSV(h = 0, s = 0, v = 0, a = 1) {
        const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return new Color(f(5), f(3), f(1), a);
    }

    /**
     * Creates a Color from a six- or eight-character hexadecimal color code. A preceding octothorpe (#) is ignored, if present.
     * 
     * The given string is interpreted as a typical hexadecimal color code in the format #RRGGBB or #RRGGBBAA.
     * @param {string} hex
     * @example <caption>Create a Color from the hexadecimal color code #FF0000 (Red)</caption>
     * Color.fromHex("#FF0000");
     * Color.fromHex("FF0000");
     */
    static fromHex(hex) {
        if (typeof hex !== "string") throw new Error("hex is not a string");
        if (hex.charAt(0) === "#") hex = hex.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
        return new Color(r / 255, g / 255, b / 255, a);
    }

    /**
     * Returns the hue, saturation, and value of this Color.
     * 
     * This function is the inverse operation of the `Color.fromHSV` constructor.
     * @returns {number[]} An array containing the hue [0-360], saturation [0-1], and value [0-1] of this Color.
     * @example <caption>Get the hue, saturation, and value of a Color</caption>
     * const color = new Color();
     * const [h, s, v] = color.toHSV();
     */
    toHSV() {
        const r = this.r, g = this.g, b = this.b;
        const v = Math.max(r, g, b), c = v - Math.min(r, g, b);
        const h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
        return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
    }

    /**
     * Converts this Color to an eight-character hexadecimal color code representing the color in the format #RRGGBBAA.
     * 
     * The result is not prefixed with an octothorpe (#).
     * 
     * The returned string can be provided to `Color.fromHex` to produce the original color.
     * @returns {string} An eight-character hexadecimal color code representing the color in the format #RRGGBBAA.
     * @example
     * console.log(new Color(0, 1, 0).toHex()); // 00FF0000
     */
    toHex() {
        const r = Math.round(this.r * 255).toString(16);
        const g = Math.round(this.g * 255).toString(16);
        const b = Math.round(this.b * 255).toString(16);
        const a = Math.round(this.a * 255).toString(16);
        return `${r.length === 1 ? "0" + r : r}${g.length === 1 ? "0" + g : g}${b.length === 1 ? "0" + b : b}${a.length === 1 ? "0" + a : a}`;
    }
}

// Enums

export class Enum {
    constructor(...values) {
        const instance = function(value) { return values.indexOf(value); }
        instance.from = index => values[index];
        return instance;
    }
}

export const enums = {
    PaintType: new Enum("Color", "LinearGradient", "RadialGradient", "Image"),
    StrokeJoin: new Enum("Miter", "Round", "Bevel"),
    StrokeCap: new Enum("Butt", "Round", "Square"),
    TextAlign: new Enum("Left", "Center", "Right", "Justify", "Start", "End"),
    VerticalTextAlign: new Enum("Top", "Middle", "Bottom"),
};

// Layout

function layout(updatePosition, updateChildPosition) { // Default layout
    const parent = this.parent;
    const size = this.size;
    const absolutePosition = this.absolutePosition;
    const parentAbsoluteSize = parent.absoluteSize;
    const computedStyle = this.computedStyle;

    const absoluteSizeX = size.scaleX * parentAbsoluteSize.x + size.offsetX - parent.absolutePaddingLeft - parent.absolutePaddingRight;
    const absoluteSizeY = size.scaleY * parentAbsoluteSize.y + size.offsetY - parent.absolutePaddingTop - parent.absolutePaddingBottom;

    this.absolutePaddingLeft = computedStyle.paddingLeft.scale * absoluteSizeX + computedStyle.paddingLeft.offset;
    this.absolutePaddingTop = computedStyle.paddingTop.scale * absoluteSizeY + computedStyle.paddingTop.offset;
    this.absolutePaddingRight = computedStyle.paddingRight.scale * absoluteSizeX + computedStyle.paddingRight.offset;
    this.absolutePaddingBottom = computedStyle.paddingBottom.scale * absoluteSizeY + computedStyle.paddingBottom.offset;

    this.absoluteSize.x = absoluteSizeX;
    this.absoluteSize.y = absoluteSizeY;

    if (updatePosition) {
        const anchorPoint = this.anchorPoint;
        const position = this.position;
        const parentAbsolutePosition = parent.absolutePosition;

        const absoluteAnchorPointX = anchorPoint.scaleX * absoluteSizeX + anchorPoint.offsetX;
        const absoluteAnchorPointY = anchorPoint.scaleY * absoluteSizeY + anchorPoint.offsetY;

        this.absoluteAnchorPoint.x = absoluteAnchorPointX;
        this.absoluteAnchorPoint.y = absoluteAnchorPointY;

        absolutePosition.x = position.scaleX * parentAbsoluteSize.x + position.offsetX - absoluteAnchorPointX + parentAbsolutePosition.x + parent.absolutePaddingLeft;
        absolutePosition.y = position.scaleY * parentAbsoluteSize.y + position.offsetY - absoluteAnchorPointY + parentAbsolutePosition.y + parent.absolutePaddingTop;
    }

    const contextSize = this._context.size;
    this.visibleOnScreen = absolutePosition.x < contextSize.x && absolutePosition.y < contextSize.y && absolutePosition.x + absoluteSizeX > 0 && absolutePosition.y + absoluteSizeY > 0;

    for (const child of this.children) {
        if (child.visible && child.layout) child.layout(updateChildPosition !== false);
    }
}

// Styles

/**
 * Paint class for determining how a component should be painted.
 * @public
 */
export class Paint {
    type = null;

    _toCkPaint() {
        const paint = new CanvasKit.Paint();
        switch (this.type) {
            case enums.PaintType("Color"):
                paint.setColor(this.color._ckColor);
                break;
            case enums.PaintType("LinearGradient"):
                break;
            case enums.PaintType("RadialGradient"):
                break;
            case enums.PaintType("Image"):
                break;
        }
        return paint;
    }
}
export class StrokePaint extends Paint {
    strokeWidth = 1;
    strokeMiter = 4;

    strokeCap = enums.StrokeCap("Round");
    strokeJoin = enums.StrokeJoin("Round");

    _toCkPaint() {
        const paint = super._toCkPaint();
        paint.setStrokeWidth(this.strokeWidth);
        paint.setStrokeMiter(this.strokeMiter);
        paint.setStrokeCap(CanvasKit.StrokeCap[enums.StrokeCap.from(this.strokeCap)]);
        paint.setStrokeJoin(CanvasKit.StrokeJoin[enums.StrokeJoin.from(this.strokeJoin)]);
        paint.setStyle(CanvasKit.PaintStyle.Stroke);
        return paint;
    }

    /**
     * Copies this StrokePaint, returning a new Paint with the same values as this one.
     * @returns {StrokePaint}
     */
    copy() {
        const newPaint = new StrokePaint();
        for (const property in this) newPaint[property] = this[property];
        return newStyle;
    }

    /**
     * Creates a StrokePaint from a Color.
     * @param {Color} color
     * @returns {StrokePaint}
     * @example
     * StrokePaint.fromColor(Color.fromRGB(255, 255, 255));
     */
    static fromColor(color) {
        const paint = new StrokePaint();
        paint.type = enums.PaintType("Color");
        paint.color = color;
        return paint;
    }
}
export class FillPaint extends Paint {
    _toCkPaint() {
        const paint = super._toCkPaint();
        return paint;
    }

    /**
     * Copies this FillPaint, returning a new Paint with the same values as this one.
     * 
     * This is a shallow copy; properties that are objects (such as Color) will be copied by reference.
     * @returns {FillPaint}
     */
    copy() {
        const newPaint = new FillPaint();
        for (const property in this) newPaint[property] = this[property];
        return newStyle;
    }

    /**
     * Creates a FillPaint from a Color.
     * @param {Color} color
     * @returns {FillPaint}
     * @example
     * FillPaint.fromColor(Color.fromRGB(255, 255, 255));
     */
    static fromColor(color) {
        const paint = new FillPaint();
        paint.type = enums.PaintType("Color");
        paint.color = color;
        return paint;
    }
}

/**
 * UIStyle class for configuring the appearance of UI elements.
 * @public
 */
export class UIStyle {
    /** @type {?FillPaint} The FillPaint used to render the background of the element. */
    background = null;
    /** @type {?Color} The foreground (typically text) color of the element. */
    color = null;

    /** @type {?SDim} The left padding of the element, represented as an SDim. Padding affects the positioning of text and all child elements. */
    paddingLeft = null;
    /** @type {?SDim} The top padding of the element, represented as an SDim. Padding affects the positioning of text and all child elements. */
    paddingTop = null;
    /** @type {?SDim} The right padding of the element, represented as an SDim. Padding affects the positioning of text and all child elements. */
    paddingRight = null;
    /** @type {?SDim} The bottom padding of the element, represented as an SDim. Padding affects the positioning of text and all child elements. */
    paddingBottom = null;

    /** @type {?number} The size of the text */
    textSize = null;
    /** @type {?enums.TextAlign} Determines how text will be aligned horizontally. */
    textAlign = null;
    /** @type {?enums.VerticalTextAlign} Determines how text will be aligned vertically. */
    verticalTextAlign = null;

    /**
     * Returns a UIStyle initialized to default values.
     * @returns {UIStyle}
     */
    static fromDefault() {
        const style = new UIStyle();
        style.background = FillPaint.fromColor(Color.fromRGB(255, 255, 255));
        style.color = Color.fromRGB(0, 0, 0);
        style.paddingLeft = new SDim();
        style.paddingTop = new SDim();
        style.paddingRight = new SDim();
        style.paddingBottom = new SDim();
        style.textSize = 14;
        style.textAlign = enums.TextAlign("Center");
        style.verticalTextAlign = enums.VerticalTextAlign("Middle");
        return style;
    }

    /** @type {UIStyle} Default UIStyle. This style is read-only; its properties cannot be changed. */
    static default = UIStyle.fromDefault();

    /**
     * Copies this UIStyle, returning a new UIStyle with the same values as this one.
     * 
     * This is a shallow copy; properties that are objects (such as Paint) will be copied by reference.
     * @returns {UIStyle}
     */
    copy() {
        const newStyle = new UIStyle();
        for (const property in this) newStyle[property] = this[property];
        return newStyle;
    }

    /**
     * Merges an array of UIStyles and returns the resulting UIStyle.
     * 
     * Styles are merged in the order they appear in the array. Properties set to `null` take the value of the preceeding style.
     * 
     * This merge performs a shallow copy; properties that are objects (such as Paint) will be copied by reference.
     * @param {UIStyle[]} styles
     * @returns {UIStyle}
     * @example
     * const style1 = new UIStyle();
     * style1.backgroundColor = Color.fromRGB(0, 0, 0);
     * 
     * const style2 = new UIStyle();
     * style2.color = Color.fromRGB(255, 255, 255);
     * 
     * const result = UIStyle.merge([style1, style2]);
     * result.backgroundColor; // Color.fromRGB(0, 0, 0)
     * result.color; // Color.fromRGB(255, 255, 255)
     */
    static merge(styles) {
        const newStyle = new UIStyle();
        for (const style of styles) {
            for (const property in style) if (style[property] !== null) newStyle[property] = style[property];
        }
        return newStyle;
    }
}
Object.freeze(UIStyle.default);

// UI

export class Node {
    name = "Node";

    _context = null;

    #parent = null;
    children = [];

    set parent(newParent) {
        if (newParent === this.#parent) return;
        if (this.#parent) {
            this.#parent.children.splice(this.#parent.children.indexOf(this), 1);
            this.#parent._context._scheduleLayout(this.#parent);
        }
        if (newParent === null) {
            this._context = null;
            this.#parent = null;
            return;
        }
        this._context = newParent._context;
        newParent.children.push(this);
        this._context._scheduleLayout(this);
        this.#parent = newParent;
    }

    get parent() { return this.#parent; }

    getChild(name) { return this.children.find(child => child.name === name); }
}

export class UIObject extends Node {
    name = "UIObject";

    absolutePosition = new Vector2();
    absoluteSize = new Vector2();
    absoluteAnchorPoint = new Vector2();

    absolutePaddingLeft = 0;
    absolutePaddingTop = 0;
    absolutePaddingRight = 0;
    absolutePaddingBottom = 0;

    visibleOnScreen = true;

    zIndex = 1;

    clipsDescendants = false;

    position = new SDim2();
    size = new SDim2();
    anchorPoint = new SDim2();
    visible = true;

    style = new UIStyle(); // Override style; equivalent to HTML .style attribute. Takes precedence over styles in .styles
    styles = []; // Main styles

    get computedStyle() {
        return UIStyle.merge([UIStyle.default, ...this.styles, this.style]);
    }

    paint() { }
    layout = layout;

    _styleTriggersLayout = {
        "paddingLeft": null,
        "paddingTop": null,
        "paddingRight": null,
        "paddingBottom": null,
    };
    _propertyTriggersLayout(properties) {
        for (const property of properties) {
            let value = this[property];
            Object.defineProperty(this, property, {
                enumerable: true,
                set: function(newValue) {
                    value = newValue;
                    if (this._context) this._context._scheduleLayout(this);
                },
                get: function() { return value }
            });
        }
    }

    constructor() {
        super();
        this._propertyTriggersLayout(["position", "size", "anchorPoint", "visible"]);
    }
}

export class Frame extends UIObject {
    name = "Frame";

    paint(canvas) {
        super.paint(canvas);

        const rect = CanvasKit.XYWHRect(this.absolutePosition.x, this.absolutePosition.y, this.absoluteSize.x, this.absoluteSize.y);

        const paint = this.computedStyle.background._toCkPaint();
        canvas.drawRect(rect, paint);
        paint.delete();
    }
}

export class ListLayoutFrame extends Frame {
    name = "ListLayoutFrame";


}

export class TextLabel extends Frame {
    name = "TextLabel";

    text = "TextLabel";

    #paragraph = null;
    #paragraphX = 0;
    #paragraphY = 0;

    constructor() {
        super();
        this._propertyTriggersLayout(["text"]);
        this._styleTriggersLayout["textSize"] = null;
        this._styleTriggersLayout["textAlign"] = null;
        this._styleTriggersLayout["verticalTextAlign"] = null;
    }

    layout = function(updatePosition) {
        layout.call(this, updatePosition);

        if (!this.visible || !this.visibleOnScreen) return;

        if (this.#paragraph) this.#paragraph.delete();

        const computedStyle = this.computedStyle;

        const paragraphStyle = new CanvasKit.ParagraphStyle({
            textStyle: {
                color: computedStyle.color._ckColor,
                fontFamilies: ["Inter"],
                fontSize: computedStyle.textSize,
            },
            textAlign: CanvasKit.TextAlign[enums.TextAlign.from(computedStyle.textAlign)]
        });

        const builder = CanvasKit.ParagraphBuilder.Make(paragraphStyle, fontMgr);

        builder.addText(this.text);

        const paragraph = builder.build();

        paragraph.layout(this.absoluteSize.x - this.absolutePaddingLeft - this.absolutePaddingRight);

        builder.delete();

        this.#paragraph = paragraph;

        this.#paragraphX = this.absolutePosition.x + this.absolutePaddingLeft;

        switch (computedStyle.verticalTextAlign) {
            case enums.VerticalTextAlign("Top"):
                this.#paragraphY = this.absolutePosition.y + this.absolutePaddingTop;
                break;
            case enums.VerticalTextAlign("Middle"):
                this.#paragraphY = this.absolutePosition.y + (this.absoluteSize.y - this.absolutePaddingTop - this.absolutePaddingBottom) / 2 - paragraph.getHeight() / 2 + this.absolutePaddingTop;
                break;
            case enums.VerticalTextAlign("Bottom"):
                this.#paragraphY = this.absolutePosition.y + this.absoluteSize.y - paragraph.getHeight() - this.absolutePaddingBottom;
                break;
        }
    }

    paint(canvas) {
        super.paint(canvas);
        canvas.drawParagraph(this.#paragraph, this.#paragraphX, this.#paragraphY);
    }
}

// Context Handler

const contexts = new Map();
let contextId = 0;

export class Context {
    constructor(canvas) {
        this.canvas = canvas;
        this.surface = CanvasKit.MakeCanvasSurface(this.canvas.id);//canvas.getContext("2d", { desynchronized: true });

        this.id = contextId++;

        this.relayout = [];

        this.root = new UIObject();
        this.root.layout = function() {
            this.absoluteSize = this._context.size;
            for (const child of this.children) {
                if (child.visible && child.layout) child.layout(true);
            }
        }
        const writeProtected = {
            name: "Root",
            parent: null,
            _context: this,
            visible: true,
            size: new SDim2(),
            position: new SDim2(),
            anchorPoint: new SDim2(),
            absolutePosition: new Vector2(),
            absoluteAnchorPoint: new Vector2(),
            zIndex: 1,
            clipsDescendants: false
        }
        for (const [key, value] of Object.entries(writeProtected)) Object.defineProperty(this.root, key, { enumerable: true, writable: false, value });

        let size = new Vector2(this.canvas.width, this.canvas.height);
        Object.defineProperty(this, "size", {
            enumerable: true,
            set: function(newValue) {
                size = newValue;
                this.canvas.width = Math.floor(this.size.x * window.devicePixelRatio);
                this.canvas.height = Math.floor(this.size.y * window.devicePixelRatio);
                this.surface.delete();
                this.surface = CanvasKit.MakeCanvasSurface(this.canvas.id);
                this.surface.getCanvas().scale(window.devicePixelRatio, window.devicePixelRatio);
                this.relayout.push(this.root);
            },
            get: function() {
                return size;
            },
        });
    }

    _scheduleLayout(object) {
        if (object._context === this && object.parent && object.visible && !this.relayout.includes(object)) this.relayout.push(object);
    }

    get running() {
        return contexts.has(this.id);
    }

    start() {
        contexts.set(this.id, this);
    }
    stop() {
        return contexts.delete(this.id);
    }
    cleanup() {
        contexts.delete(this.id);
        this.surface.delete();
        this.surface = null;
        this.root = null;
        this.relayout.length = 0;
    }
}

function iterativeCheckForStyleChanges(UIObject) {
    if (UIObject.visible) {
        if (UIObject.visibleOnScreen) {//UIObject.absolutePosition.x < UIObject._context.size.x && UIObject.absolutePosition.y < UIObject._context.size.y && UIObject.absolutePosition.x + UIObject.absoluteSize.x > 0 && UIObject.absolutePosition.y + UIObject.absoluteSize.y > 0) {
            const computedStyle = UIObject.computedStyle;
            for (const [property, value] of Object.entries(UIObject._styleTriggersLayout)) {
                if (computedStyle[property] !== value) { UIObject._context._scheduleLayout(UIObject); break; }
            }
            for (const property in UIObject._styleTriggersLayout) UIObject._styleTriggersLayout[property] = computedStyle[property];

            for (const child of UIObject.children) iterativeCheckForStyleChanges(child);
        } else if (!UIObject.clipsDescendants) for (const child of UIObject.children) iterativeCheckForStyleChanges(child);
    }
}

function iterativeDraw(UIObject, canvas) {
    if (UIObject.visible) {
        if (UIObject.visibleOnScreen) {
            UIObject.paint(canvas);
            for (const child of [...UIObject.children].sort((a, b) => a.zIndex - b.zIndex)) iterativeDraw(child, canvas);
        } else if (!UIObject.clipsDescendants) for (const child of [...UIObject.children].sort((a, b) => a.zIndex - b.zIndex)) iterativeDraw(child, canvas);
    }
}

function iterativeDrawDebugGetObjects(UIObject) {
    let visible = 0;
    let total = 1;
    if (UIObject.visible && UIObject.visibleOnScreen) {
        visible++;
        for (let i = 0; i < UIObject.children.length; i++) { const result = iterativeDrawDebugGetObjects(UIObject.children[i]); visible += result[0]; total += result[1]; }
    } else for (let i = 0; i < UIObject.children.length; i++) { const result = iterativeDrawDebugGetObjects(UIObject.children[i]); if (!UIObject.clipsDescendants) visible += result[0]; total += result[1]; }
    return [visible, total];
}
function iterativeRelayoutCheckDebug(object) {
    let value = 1;
    for (const child of object.children) value += iterativeRelayoutCheckDebug(child);
    return value;
}

class performanceWatcher {
    #data = new Map();
    #recording = new Map();
    colors = new Map();

    start(key) { if (!this.#data.has(key)) this.#data.set(key, [0, 0, 0, 0, 0]); this.#recording.set(key, performance.now()); if (!this.colors.has(key)) this.colors.set(key, CanvasKit.Color4f(Math.random(), Math.random(), Math.random(), 1)); }
    end(key) {
        key = (key === undefined && this.#recording.size > 0) ? this.#recording.keys().next().value : key;
        const array = this.#data.get(key);
        if (this.#recording.has(key)) { array.push(performance.now() - this.#recording.get(key)); array.shift(); }
        this.#recording.delete(key);
    }
    get(key) { return this.#data.get(key); }
    forEach(callback) { for (const [key, value] of this.#data) callback(key, value.reduce((a, b) => a + b) / value.length); }
    delete(key) { this.#data.delete(key); this.#recording.delete(key); }
    clear() { this.#data.clear(); this.#recording.clear(); }
    get size() { return this.#data.size; }
}

const frameTimes = [];

const debugPaint = new CanvasKit.Paint();
debugPaint.setColor(CanvasKit.BLACK);

const debugForegroundPaint = new CanvasKit.Paint();
debugForegroundPaint.setColor(CanvasKit.WHITE);

function update(timestamp) {
    while (frameTimes.length > 0 && frameTimes[0] <= timestamp - 1000) frameTimes.shift(); frameTimes.push(timestamp);

    const fps = frameTimes.length;
    const frameDelta = 1000 / fps;

    for (const [id, context] of contexts) {
        if (!context.performanceWatcher) context.performanceWatcher = new performanceWatcher();

        context.performanceWatcher.start("prepare");
        const canvas = context.surface.getCanvas();
        canvas.clear(CanvasKit.WHITE);
        context.performanceWatcher.end();

        context.performanceWatcher.start("processStyleChanges");
        iterativeCheckForStyleChanges(context.root);
        context.performanceWatcher.end();

        context.performanceWatcher.start("layoutDebug");
        for (const object of context.relayout) canvas.drawRect(CanvasKit.XYWHRect(object.absolutePosition.x, object.absolutePosition.y, object.absoluteSize.x, object.absoluteSize.y), debugPaint);
        context.performanceWatcher.end();

        context.performanceWatcher.start("layout");
        for (const object of context.relayout) object.layout(true);
        context.performanceWatcher.end();

        context.performanceWatcher.start("draw");
        iterativeDraw(context.root, canvas);
        context.performanceWatcher.end();

        context.performanceWatcher.start("debugProfiler");
        const [visibleObjects, totalObjects] = iterativeDrawDebugGetObjects(context.root);

        const performanceGraphWidth = Math.max(Math.min(context.size.x - 20, 480), 280);
        canvas.drawRect(CanvasKit.XYWHRect(10, 10, performanceGraphWidth, context.performanceWatcher.size * 20 + 72 + 20), debugPaint);

        canvas.drawText(`Draw | ${fps} FPS | ${frameDelta.toFixed(2)} ms`, 20, 20 + 9, debugForegroundPaint, font);

        canvas.drawText(`Rendering ${visibleObjects - 1} of ${totalObjects - 1} objects`, 240, 20 + 9, debugForegroundPaint, font);

        canvas.drawRect(CanvasKit.XYWHRect(20, 40, performanceGraphWidth - 20, 30), debugForegroundPaint);

        let [x, y] = [20, 80];
        context.performanceWatcher.forEach((key, value) => {
            const paint = new CanvasKit.Paint();
            paint.setColor(context.performanceWatcher.colors.get(key));

            canvas.drawRect(CanvasKit.XYWHRect(x, 40, (performanceGraphWidth - 20) * (value / frameDelta), 30), paint);

            x += (performanceGraphWidth - 20) * (value / frameDelta);

            canvas.drawRect(CanvasKit.XYWHRect(20, y, 14, 14), paint);
            canvas.drawText(`${key} | ${value.toFixed(2)} ms | ${Math.floor(value / frameDelta * 100)}%`, 40, y + 2 + 9, debugForegroundPaint, font);

            y += 20;

            paint.delete();
        });
        canvas.drawRect(CanvasKit.XYWHRect(20, y, 14, 14), debugForegroundPaint);
        canvas.drawText(`${(frameDelta - x / (performanceGraphWidth - 20) * frameDelta).toFixed(2)} ms | ${Math.floor((frameDelta - x / (performanceGraphWidth - 20) * frameDelta) / frameDelta * 100)}%`, 40, y + 2 + 9, debugForegroundPaint, font);

        if (context.relayout.length > 0) {
            canvas.drawRect(CanvasKit.XYWHRect(10, context.performanceWatcher.size * 20 + 72 + 40, performanceGraphWidth, 30), debugPaint);
            let total = 0;
            for (const object of context.relayout) total += iterativeRelayoutCheckDebug(object);
            canvas.drawText(`Relayout ${context.relayout.length} objects. Total ${total + context.relayout.length}.`, 20, context.performanceWatcher.size * 20 + 72 + 50 + 9, debugForegroundPaint, font);
        }

        context.performanceWatcher.end();

        context.performanceWatcher.start("flush");
        context.surface.flush();
        context.relayout.length = 0;
        context.performanceWatcher.end();
    }

    requestAnimationFrame(update);
}
requestAnimationFrame(update);

window.ck = CanvasKit;