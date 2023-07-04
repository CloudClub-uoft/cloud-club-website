// Initial data
const HTML_CODE = `function main(args) {
    return {body: "Hello. This is my function."}
  }`;

const CSS_LINKS = [
`https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css`,
];

// Elements
const editorCode = document.getElementById("editorCode");
const submit_button = document.getElementById("submit_button");
const format_button = document.getElementById("format_button");

// <iframe> inject CSS
CSS_LINKS.forEach((linkURL) => {
const link = document.createElement("link");
link.href = linkURL;
link.rel = "stylesheet";
});

// Monaco loader
require.config({
paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" },
});

window.MonacoEnvironment = {
getWorkerUrl: function (workerId, label) {
  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = {
            baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/'
          };
          importScripts('https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/base/worker/workerMain.js');`)}`;
},
};

// Monaco init
require(["vs/editor/editor.main"], function () {
createEditor(editorCode);
});

function createEditor(editorContainer) {
let editor = monaco.editor.create(editorContainer, {
  value: HTML_CODE,
  // language: "",
  minimap: { enabled: false },
  automaticLayout: true,
  contextmenu: false,
  fontSize: 16,
  quickSuggestions: false,
  scrollbar: {
    useShadows: false,
    vertical: "visible",
    horizontal: "visible",
    horizontalScrollbarSize: 14,
    verticalScrollbarSize: 14,
  },
});

setTimeout(() => {
  editor.getAction("editor.action.formatDocument").run();
}, 50);

format_button.onclick = (e) => {
  e.preventDefault();
  editor.getAction("editor.action.formatDocument").run();
};

submit_button.onclick = (e) => {
  e.preventDefault();
  console.log(editor.getValue());
  var s = document.getElementById("code");
  s.value = editor.getValue();
  document.getElementById("theForm").submit();
};
}