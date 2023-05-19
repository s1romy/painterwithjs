const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option")); // foreach function 사용 위해 배열을 생성해준것
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // brush 같은.. 그림 그릴 수 있게 해주는 code

/* ctx.rect(50, 50, 100, 100); //rect는 사각형을 쉽게 그리는 shortcut function
ctx.rect(150, 150, 100, 100); 
ctx.rect(250, 250, 100, 100);
ctx.fill(); //위의 사각형들에 색을 채우는 것. 선만 그리고 싶다면 ctx.stroke();

ctx.beginPath(); // 위의 path와의 연결을 끊고 새로운 path를 만든것
ctx.rect(350, 350, 100, 100);
ctx.rect(450, 450, 100, 100);
ctx.fillStyle = "red"; //fill color 바꾸는것
ctx.fill(); */

/* ctx.moveTo(50, 50); // pencil을 캔버스의 시작 모서리에서 50, 50으로 옮긴것
ctx.lineTo(150, 50); // 50, 50으로 옮긴 좌표에서부터 선을 그린것
ctx.lineTo(150, 150);
ctx.lineTo(50, 150);
ctx.lineTo(50, 50);
ctx.stroke(); // 선 그리는 code */

/* 집 만들기
ctx.fillRect(200, 200, 50, 200); // 왼쪽 벽
ctx.fillRect(400, 200, 50, 200); // 오른쪽 벽
// ctx.lineWidth = 2; 선의 굵기를 조절할 수 있는 코드
ctx.fillRect(300, 300, 50, 100); // 가운데 있는 문
ctx.fillRect(200, 200, 200, 20); // 천장
ctx.moveTo(200, 200);
ctx.lineTo(325, 100);
ctx.lineTo(450, 200);
ctx.fill(); */

/*
// 팔 + 몸통
ctx.fillRect(210 - 40, 200 - 20, 15, 100);
ctx.fillRect(350 - 40, 200 - 20, 15, 100);
ctx.fillRect(260 - 40, 200 - 20, 60, 200);

// 머리
ctx.arc(250, 100, 50, 0, 2 * Math.PI); // 원 그리는 code: x, y, radius, start-angle, end-angle
ctx.fill();

//눈
ctx.beginPath();
ctx.fillStyle = "white";
ctx.arc(260 + 10, 80, 8, Math.PI, 2 * Math.PI); 
ctx.arc(220 + 10, 80, 8, Math.PI, 2 * Math.PI);
ctx.fill();
*/

/*
//움직일때마다 선의 색깔이 바뀌는 캔버스의 왼쪽 모서리에서부터 시작하는 코드
ctx.lineWidth = 2;

const colors = [
    "#ffcccc",
    "#fffa65",
    "#7efff5",
    "#a29bfe",
    "#dfe6e9",
    "#55efc4",
    "#00cec9",
    "#fd79a8",
    "#ff7675",
    "#badc58",
];

function onClick(event) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = color;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

canvas.addEventListener("mousemove", onClick); */

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value; //처음에 그림판 켰을때 딱 한번만 실행됨
ctx.lineCap = "round"; // 브러쉬의 질감?을 동그랗게 바꿈
let isPainting = false;
let isFilling = false;

function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath(); //이게 전에 그린 선의 path와 연결고리를 끊게 해줌. 이거 안하면 line 굵기나 이런거 변경하면 다 같이 변경됨
    ctx.moveTo(event.offsetX, event.offsetY); //유저가 마우스를 움직이면 pencil이 따라 움직이는 code
}

function startPainting() {
    isPainting = true; // 유저가 마우스를 클릭하고 있으면 true. click이랑은 다름. down은 누르고 있는것
}

function cancelPainting() {
    isPainting = false;
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value; //range input을 가져오는 function (선 굵기 change)
} 

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue; // give a feedback for user    
}

function onModeClick() {
    if(isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onCanvasClick() {
    if(isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event) {
    const file = event.target.files[0]; //배열 속성을 부여하면 user가 여러개의 파일 업로드 가능. 하지만 이 그림판은 하나만 허용하기 때문에 첫번째것만[0] 불러옴
    const url = URL.createObjectURL(file); //해당 파일의 브라우저 메모리 url을 알아내는 code
    const image = new Image(); // same as document.createElement("img");
    image.src = url;
    //the other way to create the eventlistner
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    }
}

function onDoubleClick(event) {
    const text = textInput.value;
    if(text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore();
    }
}

function onSaveClick() {
    const url = canvas.toDataURL(); //그린 그림을 url로 변환시켜준 다음에
    const a = document.createElement("a"); //a 태그를 생성해서 가짜 링크를 만든 다음에
    a.href = url; //링크의 href는 그림 url로 설정해주고
    a.download = "myDrawing.png"; //"myDrawing.png"라는 파일명으로 저장시킨다고 설정해주고 (파일이름은 아무거나 다 가능, 파일 형식도 jpg 도 됨)
    a.click(); //링크를 누르면 파일이 다운로드 됨
}

canvas.addEventListener("dblclick", onDoubleClick); // dblclick마우스를 빠르게 누를때
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);