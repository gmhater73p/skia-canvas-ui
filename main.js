import * as UI from "./core.js";

const context = new UI.Context(document.getElementById("main"));

function updateCanvas() {
    context.size = new UI.Vector2(window.innerWidth, window.innerHeight);
}
updateCanvas();
addEventListener("resize", updateCanvas);

let previousRect = null;
for (var i = 0; i < 1024; i++) {
    const rect = new UI.Frame();
    rect.size = previousRect ? UI.SDim2.fromScale(1, 1) : new UI.SDim2(70, 70);
    rect.position = new UI.SDim2(20, 20);
    if (!previousRect) rect.anchorPoint = UI.SDim2.fromScale(0.5, 0.5);
    rect.style.background = UI.FillPaint.fromColor(UI.Color.fromRGB(Math.random() * 200, Math.random() * 200, Math.random() * 200, 0.5));
    rect.parent = previousRect ?? context.root;
    previousRect = rect;
}
previousRect = null;
for (var i = 0; i < 1024; i++) {
    const label = new UI.TextLabel();
    label.size = previousRect ? UI.SDim2.fromScale(1, 1) : new UI.SDim2(80, 60);
    label.position = new UI.SDim2(0, -65);
    label.style.background = UI.FillPaint.fromColor(UI.Color.fromRGB(Math.random() * 200, Math.random() * 200, Math.random() * 200, 0.5));
    //label.text = "TextLabel";
    label.style.textSize = 11;
    label.parent = previousRect ?? context.root.children[0];
    previousRect = label;
}

const label = new UI.TextLabel();
label.text = "Hello, world!";
label.size = UI.SDim2.fromScale(0.2, 0.2);
label.position = UI.SDim2.fromScale(0.5, 0.5);
label.anchorPoint = UI.SDim2.fromScale(0.5, 0.5);

label.style.background = UI.FillPaint.fromColor(UI.Color.fromRGB(200, 0, 0, 0.5));

const paddingStyle = new UI.UIStyle();
paddingStyle.paddingTop = UI.SDim.fromOffset(10);
paddingStyle.paddingLeft = UI.SDim.fromOffset(10);
paddingStyle.paddingRight = UI.SDim.fromOffset(10);
paddingStyle.paddingBottom = UI.SDim.fromOffset(10);
label.styles.push(paddingStyle);

label.text = "This label is awesome"
label.parent = context.root;

const debugLabel = new UI.TextLabel();
debugLabel.text = "UI | 8 August 2022";
debugLabel.size = new UI.SDim2(1, 0, 0, 40);
debugLabel.anchorPoint = UI.SDim2.fromScale(0, 1);
debugLabel.position = UI.SDim2.fromScale(0, 1);
debugLabel.style.color = UI.Color.fromRGB(0, 0, 0, 0.5);
debugLabel.style.textAlign = UI.enums.TextAlign("Left");
debugLabel.styles.push(paddingStyle);
debugLabel.zIndex = 0;
debugLabel.parent = context.root;

const label2 = new UI.TextLabel();
label2.text = "Padding works!";
label2.size = UI.SDim2.fromScale(1, 1);
label2.style.background = UI.FillPaint.fromColor(UI.Color.fromRGB(0, 200, 0, 0.5));
label2.parent = label;

context.start();

/*const rectCentered = new auroraUIextra.Frame();
rectCentered.size = new auroraUI.UICoordinate(0, 20, 0, 20);
rectCentered.position = new auroraUI.UICoordinate(0.5, 0, 0.5, 0);
rectCentered.anchorPoint = new auroraUI.UICoordinate(0.5, 0.5);
rectCentered.backgroundFill = "green";
rectCentered.appendUIModifier(new auroraUIextra.ShadowEffect());
labelScaled.appendUIObject(rectCentered);*/

addEventListener("mousemove", e => context.root.children[0].position = new UI.SDim2(e.clientX, e.clientY));
addEventListener("touchmove", e => {
    e.preventDefault();
    context.root.children[0].position = new UI.SDim2(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

const style = new UI.UIStyle();
style.background = UI.FillPaint.fromColor(UI.Color.fromRGB(255, 0, 0));

const frame = new UI.Frame();
frame.styles.push(style);
frame.size = UI.SDim2.fromOffset(100, 100);

frame.parent = context.root;

context.start();

window.context = context;
window.UI = UI;