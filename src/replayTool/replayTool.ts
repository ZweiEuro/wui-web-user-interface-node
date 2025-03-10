import { parse, ParseResult } from 'papaparse';
import { WuiQueryId, WuiSupported } from '../types';
import { replayToolExport } from '../PersistentCallback';

const debugElementInnerHtml = `
<div style="
width: 100%;
color: black;
padding: 10px;
z-index: 1000;
border: 5px solid #000;
background: red;
" id="ReplaySettings">
    <div style="
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: bold;    
    " id="InfoBox">
        WUI backend not found! <br>
        You are either not running in a WUI environment or the WUI backend is not loaded.<br>
        For debugging you may load a '.wlog' file to replay events.<br>
    </div>
    <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            gap: 10px;
            margin-top: 20px;
            ">
        <input type="file" id="fileInput" accept=".wlog" style="display:none" />
        <button id="fileButton">Select log file</button>
        <div id="fileName"> </div>
        <button id="replayButton" disabled>Start replay</button>
    </div>
</div>
`;

const replayOverlayInnerHtml = `
<div style="width: 100%; 
opacity: 0.8;
position: absolute;
padding: 10px;
z-index: 1000;
bottom:0;
left: 0;
color:red;
" id="ReplayOverlay">
    Currently Showing replay: <span id="replayName"> </span>
</div>
`;

export let replayTool_is_initialized = false;

// Settings box
let fileName = document.getElementById('fileName');
let fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
let fileButton = document.getElementById('fileButton');

let infoBox = document.getElementById('InfoBox');

let replayButton = document.getElementById('replayButton');

// Overlay
let replayName = document.getElementById('replayName');

// CSV data

type CsvRowType = {
  timestamp: string;
  eventName: string;
  eventPayload: string;
};

let csvData: ParseResult<CsvRowType> | undefined = undefined;

function findAllDIVs() {
  fileName = document.getElementById('fileName');
  fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
  fileButton = document.getElementById('fileButton');

  infoBox = document.getElementById('InfoBox');
  replayButton = document.getElementById('replayButton');
  replayName = document.getElementById('replayName');
}

export function initializeReplayTool(): void {
  if (WuiSupported()) {
    console.debug(
      'WUI backend found, not initializing replay tool. Open the website in a browser without WUI backend to play replays.'
    );
    return;
  }

  if (replayTool_is_initialized) {
    return;
  } else {
    replayTool_is_initialized = true;
  }

  console.warn('WUI backend not found');

  // mock away the global functions to avoid any crashes
  globalThis.window.WuiQuery = options => {
    void options;
    return 0 as WuiQueryId;
  };
  globalThis.window.WuiQueryCancel = options => {
    void options;
    return false;
  };

  // The body should be all black since usually the WUI backend is running and rendering is considered empty as black
  document.body.style.backgroundColor = 'black';

  if (localStorage.getItem('wuiReplayActive') === 'true') {
    initReplay();
  } else {
    initReplayOverlay();
  }
}

function initReplay() {
  const overlay = globalThis.document.createElement('div');

  overlay.innerHTML = replayOverlayInnerHtml;
  document.body.prepend(overlay);

  findAllDIVs();

  if (!replayName) {
    console.error('replayName not found');
    return;
  }

  replayName.innerText = localStorage.getItem('wuiReplayFileName') ?? 'unknown';

  // prepare replay
  const csvStringContent = localStorage.getItem('wuiReplayCSV');

  if (!csvStringContent) {
    console.error('No CSV content found');
    return;
  }

  csvData = parse<CsvRowType>(csvStringContent, {
    header: true,
    comments: '#',
    quoteChar: "'",
    escapeChar: '',
  });

  runReplay(0);
}

function runReplay(index: number = 0) {
  if (!csvData) {
    console.error('No CSV data found');
    return;
  }

  if (index >= csvData.data.length) {
    finishReplay();
    return;
  }

  const row = csvData.data[index];

  if (!row['timestamp'] || !row['eventName'] || !row['eventPayload']) {
    console.warn('Invalid row', row);
    runReplay(index + 1);
    return;
  }

  const timeoutTime =
    index == 0
      ? Number(row.timestamp)
      : Number(row.timestamp) - Number(csvData.data[index - 1].timestamp);

  setTimeout(() => {
    console.log('Replaying', row);
    replayToolExport
      .getPersistentCallbacksManager(row.eventName)
      .onData(row.eventPayload);

    runReplay(index + 1);
  }, timeoutTime);
}

function finishReplay() {
  localStorage.removeItem('wuiReplayActive');
  globalThis.document.getElementById('ReplayOverlay')?.remove();

  initReplayOverlay();

  if (!infoBox) {
    console.error('infoBox not found');
    return;
  }

  infoBox.innerHTML =
    'Replay finished. You can now load a new file or restart.';
}

function startReplay() {
  localStorage.setItem('wuiReplayActive', 'true');
  location.reload();
}

function initReplayOverlay() {
  if (globalThis.document !== undefined) {
    const debugElement = globalThis.document.createElement('div');
    debugElement.innerHTML = debugElementInnerHtml;

    document.body.prepend(debugElement);

    findAllDIVs();

    if (!fileButton || !fileInput || !fileName || !replayButton) {
      console.error('fileButton, fileInput or fileName not found');
      return;
    }

    fileButton.addEventListener('click', function (e) {
      if (fileInput) {
        fileInput.click();
      }
      e.preventDefault(); // prevent navigation to "#"
    });

    fileInput.addEventListener('change', handleFilechange, false);

    const storedFileName = window.localStorage.getItem('wuiReplayFileName');

    if (fileName && storedFileName) {
      fileName.innerHTML = 'Current Filename: ' + storedFileName;
      replayButton.removeAttribute('disabled');
    }
    replayButton.addEventListener('click', startReplay);
  }
}

function handleFilechange(): void {
  if (!fileInput) {
    console.error('fileInput not found');
    return;
  }

  if (!fileInput.files) {
    console.error('fileInput.files not found or none uploaded');
    return;
  }

  const selectedFile = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target?.result;

    window.localStorage.setItem('wuiReplayCSV', text as string);
    window.localStorage.setItem('wuiReplayFileName', selectedFile.name);

    if (fileName && replayButton) {
      fileName.innerHTML = 'Current Filename' + selectedFile.name;
      replayButton.removeAttribute('disabled');
    }
  };

  reader.readAsText(selectedFile);

  console.log(selectedFile);
}
