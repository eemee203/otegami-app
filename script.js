// 要素の取得
const inputTo = document.getElementById("inputTo");
const inputBody = document.getElementById("inputBody");
const inputFrom = document.getElementById("inputFrom");
const viewTo = document.getElementById("viewTo");
const viewBody = document.getElementById("viewBody");
const viewFrom = document.getElementById("viewFrom");
const saveBtn = document.getElementById("saveBtn");
const letterCanvas = document.getElementById("letterCanvas");
const fontSelect = document.getElementById("fontSelect");
const bgSelect = document.getElementById("bgSelect");
const sizeSelect = document.getElementById("sizeSelect");

// 入力反映（全て updateSquarePreview に集約して安全に処理します）
inputTo.addEventListener("input", updateSquarePreview);
inputBody.addEventListener("input", updateSquarePreview);
inputFrom.addEventListener("input", updateSquarePreview);

// フォント切り替え
fontSelect.addEventListener("change", () => {
  letterCanvas.style.fontFamily = fontSelect.value;
  updateSquarePreview();
});

// サイズ切り替え
sizeSelect.addEventListener("change", updateSquarePreview);

// カラーテーマ設定
const colorThemes = [
  { name: "銀鼠（スノーホワイト）", bg: "#f8f9fa", pattern: "#495057" },
  { name: "鉄黒（クールグレー）", bg: "#e2e2e2", pattern: "#1a1a1a" },
  { name: "薄桜（ピンク）", bg: "#ffe5ec", pattern: "#e4689a" },
  { name: "茜（明るい赤）", bg: "#ffadad", pattern: "#ff0000" },
  { name: "菖蒲（ラベンダー）", bg: "#bdb2ff", pattern: "#5a189a" },
  { name: "瑠璃（澄んだ青）", bg: "#9bf6ff", pattern: "#00b4d8" },
  { name: "松葉（若草色）", bg: "#caffbf", pattern: "#2b9348" },
  { name: "海松色（ライム）", bg: "#e5ffad", pattern: "#70e000" },
  { name: "金茶（ひまわり）", bg: "#fdffb6", pattern: "#ffcc00" },
  { name: "柿（ビタミンオレンジ）", bg: "#ffdca1", pattern: "#fb5607" },
  { name: "焦茶（キャラメル）", bg: "#f0d5be", pattern: "#8a5a44" },
];

let currentBgColor = colorThemes[0].bg;
let currentPatternColor = colorThemes[0].pattern;

// --- 背景SVG生成関数群 ---
const generators = {
  "bg-hideout": (c) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='${c.replace("#", "%23")}' fill-opacity='0.1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  "bg-church": (c) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='${c.replace("#", "%23")}' fill-opacity='0.1'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  "bg-star-small": (c) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='${c.replace("#", "%23")}' fill-opacity='0.1'%3E%3Cpolygon points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E")`,
  "bg-brick": (c) =>
    `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${c.replace("#", "%23")}' fill-opacity='0.1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  "bg-floral": (c) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360' viewBox='0 0 360 360'%3E%3Cpath fill='${c.replace("#", "%23")}' fill-opacity='0.1' d='M0 85.02l4.62-4.27a49.09 49.09 0 0 0 7.33 3.74l-1.2 10.24z'/%3E%3C/svg%3E")`,
  "bg-circuit": (c) =>
    `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88z' fill='${c.replace("#", "%23")}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  "bg-mesh": (c) =>
    `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M82.42 180h-1.415L0 98.995v-2.827L6.167 90z' fill='${c.replace("#", "%23")}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  "bg-heart-line": (c, bg) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='106.2' height='159.3'%3E%3Crect width='100%25' height='100%25' fill='${bg.replace("#", "%23")}'/%3E%3Cpath fill='none' stroke='${c.replace("#", "%23")}' stroke-opacity='0.2' d='M20.642-1.662s-1.022 6.436 10.362 13.126'/%3E%3C/svg%3E")`,
  "bg-dot-heart": (c, bg) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100%25' height='100%25' fill='${bg.replace("#", "%23")}'/%3E%3Cpath fill='${c.replace("#", "%23")}' fill-opacity='0.1' d='M14.063 18.75V25h3.125v3.125'/%3E%3C/svg%3E")`,
};

function applyBackground(targetEl) {
  const pattern = bgSelect.value;
  targetEl.style.backgroundColor = currentBgColor;

  let svg;

  if (pattern === "bg-hideout") {
    svg = generators["bg-hideout"](currentPatternColor);
    targetEl.style.backgroundImage = `${svg}, ${svg}`;
    targetEl.style.backgroundPosition = "0 0, 20px 20px";
    targetEl.style.backgroundSize = "40px 40px";
  } else if (pattern === "bg-church") {
    svg = generators["bg-church"](currentPatternColor);
    targetEl.style.backgroundImage = `${svg}, ${svg}`;
    targetEl.style.backgroundPosition = "0 0, 40px 40px";
    targetEl.style.backgroundSize = "80px 80px";
  } else if (pattern === "bg-star-small") {
    svg = generators["bg-star-small"](currentPatternColor);
    targetEl.style.backgroundImage = `${svg}, ${svg}`;
    targetEl.style.backgroundPosition = "0 0, 12px 12px";
    targetEl.style.backgroundSize = "24px 24px";
  } else if (pattern === "bg-brick") {
    svg = generators["bg-brick"](currentPatternColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "42px 44px";
    targetEl.style.backgroundPosition = "0 0";
  } else if (pattern === "bg-floral") {
    svg = generators["bg-floral"](currentPatternColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "180px 180px";
    targetEl.style.backgroundPosition = "0 0";
  } else if (pattern === "bg-circuit") {
    svg = generators["bg-circuit"](currentPatternColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "180px 180px";
    targetEl.style.backgroundPosition = "0 0";
  } else if (pattern === "bg-mesh") {
    svg = generators["bg-mesh"](currentPatternColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "180px 180px";
    targetEl.style.backgroundPosition = "0 0";
  } else if (pattern === "bg-heart-line") {
    svg = generators["bg-heart-line"](currentPatternColor, currentBgColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "50px 80px";
    targetEl.style.backgroundPosition = "0 0";
  } else if (pattern === "bg-dot-heart") {
    svg = generators["bg-dot-heart"](currentPatternColor, currentBgColor);
    targetEl.style.backgroundImage = svg;
    targetEl.style.backgroundSize = "50px 50px";
    targetEl.style.backgroundPosition = "0 0";
  } else {
    targetEl.style.backgroundImage = "none";
  }
}

function updateBackground() {
  applyBackground(letterCanvas);
  const squarePages = document.querySelectorAll(
    "#squarePreview .letter-canvas",
  );
  squarePages.forEach((page) => applyBackground(page));
}

function createThemePalette() {
  const container = document.getElementById("themePalette");
  container.innerHTML = "";

  colorThemes.forEach((theme) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = `linear-gradient(135deg, ${theme.bg} 50%, ${theme.pattern} 50%)`;
    swatch.title = theme.name;

    if (currentBgColor === theme.bg) swatch.classList.add("active");

    swatch.onclick = () => {
      currentBgColor = theme.bg;
      currentPatternColor = theme.pattern;
      container
        .querySelectorAll(".swatch")
        .forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
      updateBackground();
    };
    container.appendChild(swatch);
  });
}

// ▼ 修正：宛名があるかどうか(hasTo)を受け取り、無い場合は高さを広げる
function splitTextIntoPages(text, hasTo) {
  const pages = [];
  let currentText = "";

  const tester = document.createElement("div");
  tester.className = "text-body";
  tester.style.position = "absolute";
  tester.style.visibility = "hidden";
  tester.style.width = "270px";
  tester.style.fontFamily = fontSelect.value;
  document.body.appendChild(tester);

  const maxInnerHeight = 270;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isFirstPage = pages.length === 0;

    // 宛名がある場合のみ、1枚目の限界を35px下げる（無い場合は全画面使える！）
    let limit = isFirstPage && hasTo ? maxInnerHeight - 35 : maxInnerHeight;

    tester.textContent = currentText + char;

    if (tester.offsetHeight > limit && currentText.length > 0) {
      pages.push(currentText);
      currentText = char === "\n" ? "" : char;
    } else {
      currentText += char;
    }
  }

  if (currentText.length > 0) {
    pages.push(currentText);
  }

  document.body.removeChild(tester);
  return pages.length > 0 ? pages : [""];
}

// プレビューの全体更新（縦長・正方形共通）
function updateSquarePreview() {
  const mode = sizeSelect ? sizeSelect.value : "vertical";
  const verticalPreview = document.getElementById("verticalPreview");
  const squarePreview = document.getElementById("squarePreview");

  if (!verticalPreview || !squarePreview) return;

  // trim() を使って、スペースだけの入力を「空」として扱う
  const toText = inputTo.value.trim();
  const bodyText = inputBody.value || "本文がここに出るよ";
  const fromText = inputFrom.value.trim();

  const hasTo = toText !== "";
  const hasFrom = fromText !== "";

  if (mode === "vertical") {
    // 縦長モード
    verticalPreview.style.display = "block";
    squarePreview.style.display = "none";
    letterCanvas.style.fontFamily = fontSelect.value;

    // 空欄の場合は要素自体を非表示にして詰める
    viewTo.style.display = hasTo ? "block" : "none";
    viewTo.textContent = toText;

    viewBody.textContent = bodyText;

    viewFrom.style.display = hasFrom ? "block" : "none";
    viewFrom.textContent = fromText;
  } else {
    // 正方形モード
    verticalPreview.style.display = "none";
    squarePreview.style.display = "flex";
    squarePreview.innerHTML = "";

    const pages = splitTextIntoPages(bodyText, hasTo);

    pages.forEach((pageContent, index) => {
      const isFirst = index === 0;
      const isLast = index === pages.length - 1;

      const pageEl = document.createElement("div");
      pageEl.className = "letter-canvas square";
      pageEl.style.fontFamily = fontSelect.value;

      // 空欄の場合は <p> を非表示 (display: none) にし、罫線も消す
      pageEl.innerHTML = `
        <p class="text-to" style="display: ${isFirst && hasTo ? "block" : "none"}; border-bottom: ${isFirst && hasTo ? "2px solid #333" : "none"}"></p>
        <div class="text-body"></div>
        <p class="text-from" style="display: ${isLast && hasFrom ? "block" : "none"}"></p>
        <p class="copyright-on-letter">Created by お手紙メーカー</p>
      `;

      if (isFirst && hasTo)
        pageEl.querySelector(".text-to").textContent = toText;
      pageEl.querySelector(".text-body").textContent = pageContent;
      if (isLast && hasFrom)
        pageEl.querySelector(".text-from").textContent = fromText;

      applyBackground(pageEl);
      squarePreview.appendChild(pageEl);
    });
  }
}

// 保存ボタン
saveBtn.addEventListener("click", async () => {
  const mode = sizeSelect.value;
  const imageModal = document.getElementById("imageModal");
  const resultImage = document.getElementById("resultImage");
  const modalImagesContainer = document.getElementById("modalImagesContainer");

  imageModal.style.alignItems = "flex-start";
  imageModal.style.overflowY = "auto";

  if (mode === "vertical") {
    resultImage.style.display = "block";
    modalImagesContainer.innerHTML = "";

    await document.fonts.ready;

    html2canvas(letterCanvas).then((canvas) => {
      resultImage.src = canvas.toDataURL("image/png");
      imageModal.style.display = "flex";
    });
  } else {
    resultImage.style.display = "none";
    modalImagesContainer.innerHTML =
      "<p style='color:white;'>画像を作成中...</p>";
    imageModal.style.display = "flex";

    await document.fonts.ready;

    const targets = document.querySelectorAll("#squarePreview .letter-canvas");
    const images = [];

    for (let el of targets) {
      const canvas = await html2canvas(el, { scale: 2 });
      images.push(canvas.toDataURL("image/png"));
    }

    modalImagesContainer.innerHTML = "";
    images.forEach((src, i) => {
      const wrap = document.createElement("div");
      wrap.innerHTML = `<p style="font-size:12px; color:#fff; margin-bottom:5px; text-align:center;">${i + 1}枚目</p><img src="${src}" style="width: 100%; border: 1px solid #ccc;">`;
      modalImagesContainer.appendChild(wrap);
    });
  }
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

bgSelect.addEventListener("change", updateBackground);
createThemePalette();
updateBackground();

// SNSで共有
const shareBtn = document.getElementById("shareBtn");
const appUrl = "https://otegamimaker.netlify.app/";
const shareText = "手書き風の画像が作れる「お手紙メーカー」！ #お手紙メーカー";

if (!navigator.share) {
  shareBtn.style.display = "none";
}

shareBtn.addEventListener("click", async () => {
  try {
    await navigator.share({
      title: "お手紙メーカー",
      text: shareText,
      url: appUrl,
    });
  } catch (error) {
    console.log("共有キャンセル、または失敗:", error);
  }
});

// localStorage 保存・復元
const inputIds = ["inputTo", "inputBody", "inputFrom"];

window.addEventListener("DOMContentLoaded", () => {
  inputIds.forEach((id) => {
    const savedValue = localStorage.getItem(id);
    if (savedValue) {
      document.getElementById(id).value = savedValue;
    }
  });
  updateSquarePreview();
});

inputIds.forEach((id) => {
  document.getElementById(id).addEventListener("input", (e) => {
    localStorage.setItem(id, e.target.value);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!confirm("入力内容をすべて消去しますか？")) return;

      document.getElementById("inputTo").value = "";
      document.getElementById("inputBody").value = "";
      document.getElementById("inputFrom").value = "";

      localStorage.removeItem("inputTo");
      localStorage.removeItem("inputBody");
      localStorage.removeItem("inputFrom");

      updateSquarePreview();
      alert("クリアしました！");
    });
  }
});
