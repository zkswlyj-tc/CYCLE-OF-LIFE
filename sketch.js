// ============================================================
// CYCLE OF LIFE — FINAL SKETCH
// works with sound.js
// ============================================================


// ============================================================
// SOURCE / PROJECTION
// ============================================================

const SOURCE_W = 1000;
const SOURCE_H = 1500;

let source;


// ============================================================
// WASHER IMAGE
// ============================================================

let washerImg;

let washerX = SOURCE_W / 2;
let washerY = SOURCE_H / 2;

let washerScale = 1;


// ============================================================
// PROJECTION MAPPING
// ============================================================

let corners = [];
let selectedCorner = -1;

let showGuides = true;

const HANDLE_RADIUS = 14;

const MAP_HEIGHT_USAGE = 0.98;
const MAP_WIDTH_USAGE = 0.98;


// ============================================================
// VIDEO FILES
// ============================================================

const INTRO_FILE =
  "assets/videos/intro_wash.mp4";


const VIDEO_FILES = [

  "assets/videos/baby.mp4",

  "assets/videos/child_running.mp4",

  "assets/videos/child_eating.mp4",

  "assets/videos/child_bike.mp4",

  "assets/videos/teenager_running.mp4",

  "assets/videos/young_adult.mp4",

  "assets/videos/wedding.mp4",

  "assets/videos/adult_couple.mp4",

  "assets/videos/family.mp4",

  "assets/videos/middle_age.mp4",

  "assets/videos/old_age.mp4",

  "assets/videos/new_baby_cycle.mp4"

];


// ============================================================
// VIDEO OBJECTS
// ============================================================

let introVideo = null;

let stageVideos = [];

let activeVideo = null;

let hasUserStarted = false;


// ============================================================
// STAGES
// ============================================================

let currentStage = 0;


let stageWords = [

  "BABY",

  "CHILD",

  "PLAY",

  "GROW",

  "TEEN",

  "YOUNG ADULT",

  "WEDDING",

  "ADULT",

  "FAMILY",

  "MIDDLE AGE",

  "OLD AGE",

  "REBIRTH"

];


// ============================================================
// TIMER
// ============================================================

const STAGE_TIMER_START = [

  60 * 60, // BABY

  55 * 60, // CHILD

  50 * 60, // PLAY

  45 * 60, // GROW

  40 * 60, // TEEN

  34 * 60, // YOUNG

  28 * 60, // WEDDING

  23 * 60, // ADULT

  18 * 60, // FAMILY

  12 * 60, // MIDDLE AGE

  6 * 60,  // OLD AGE

  60 * 60  // REBIRTH

];


const STAGE_TIMER_END = [

  55 * 60,

  50 * 60,

  45 * 60,

  40 * 60,

  34 * 60,

  28 * 60,

  23 * 60,

  18 * 60,

  12 * 60,

  6 * 60,

  0,

  60 * 60

];


let timerText = "60:00";


// ============================================================
// TIMER POSITION
// ============================================================

let timerX = 760;
let timerY = 218;

let timerW = 190;
let timerH = 75;


// ============================================================
// DRUM
// ============================================================

let drumX = 500;
let drumY = 750;

let drumSize = 530;

let mediaZoom = 1.15;


let rotationAngle = 0;

let spinning = true;


// ============================================================
// SPIN SPEEDS
// ============================================================

const stageSpinSpeeds = [

  0.002,

  0.006,

  0.008,

  0.010,

  0.013,

  0.010,

  0.008,

  0.007,

  0.006,

  0.004,

  0.002,

  0.003

];


let spinSpeed =
  stageSpinSpeeds[0];


// ============================================================
// KNOB
// ============================================================

let knobX = 880;
let knobY = 218;

let knobRadius = 34;

let labelRadius = 105;


// ============================================================
// BABY INTRO
// ============================================================

const BABY_INTRO_HOLD = 4500;

const BABY_FADE_DURATION = 2500;

let babyIntroTimeout = null;


let crossfadeActive = false;

let fadeFrom = null;
let fadeTo = null;

let fadeStartTime = 0;


// ============================================================
// BREAK / REBIRTH
// ============================================================

let machineBroken = false;

let rebirthTimeout = null;

const REBIRTH_DELAY = 3200;


// ============================================================
// PRELOAD
// ============================================================

function preload() {

  washerImg =
    loadImage(
      "assets/washer.png"
    );

}


// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(
    windowWidth,
    windowHeight,
    WEBGL
  );


  pixelDensity(1);


  source =
    createGraphics(
      SOURCE_W,
      SOURCE_H
    );


  source.pixelDensity(1);


  resetMapping();


  createAllVideos();


  // sound.js hook
  if (
    typeof setupSoundSystem === "function"
  ) {

    setupSoundSystem();

  }


  bindControls();


  syncControls();


  console.log(
    "CYCLE OF LIFE READY"
  );

}


// ============================================================
// CREATE VIDEOS
// ============================================================

function createAllVideos() {

  introVideo =
    makeVideo(
      INTRO_FILE,
      true
    );


  stageVideos = [];


  for (
    let i = 0;
    i < VIDEO_FILES.length;
    i++
  ) {

    const video =
      makeVideo(
        VIDEO_FILES[i],
        false
      );


    stageVideos.push(
      video
    );

  }


  // OLD AGE FINISH
  stageVideos[10].addEventListener(

    "ended",

    () => {

      if (
        currentStage === 10 &&
        !machineBroken
      ) {

        oldAgeFinished();

      }

    }

  );


  activeVideo =
    introVideo;

}


// ============================================================
// CREATE VIDEO
// ============================================================

function makeVideo(
  path,
  shouldLoop = false
) {

  const video =
    document.createElement(
      "video"
    );


  video.src =
    path;


  video.muted =
    true;


  video.defaultMuted =
    true;


  video.volume =
    0;


  video.loop =
    shouldLoop;


  video.autoplay =
    false;


  video.preload =
    "auto";


  video.playsInline =
    true;


  video.setAttribute(
    "muted",
    ""
  );


  video.setAttribute(
    "playsinline",
    ""
  );


  video.setAttribute(
    "webkit-playsinline",
    ""
  );


  video.style.position =
    "fixed";


  video.style.left =
    "-100px";


  video.style.top =
    "0";


  video.style.width =
    "1px";


  video.style.height =
    "1px";


  video.style.opacity =
    "0";


  video.style.pointerEvents =
    "none";


  document.body.appendChild(
    video
  );


  video.addEventListener(

    "loadedmetadata",

    () => {

      console.log(
        "VIDEO READY:",
        path,
        video.duration
      );

    }

  );


  video.addEventListener(

    "error",

    () => {

      console.error(
        "VIDEO ERROR:",
        path,
        video.error
      );

    }

  );


  video.load();


  return video;

}


// ============================================================
// MAIN DRAW LOOP
// ============================================================

function draw() {

  background(0);


  updateStageTimer();


  drawSource();


  drawProjection();


  if (
    showGuides
  ) {

    drawProjectionGuides();

  }


  if (
    spinning &&
    !machineBroken
  ) {

    rotationAngle +=
      spinSpeed;

  }

}


// ============================================================
// SOURCE DRAW
// ============================================================

function drawSource() {

  source.push();


  // PURE BLACK FOR PROJECTION
  source.background(0);


  if (
    washerImg
  ) {

    source.imageMode(
      source.CENTER
    );


    const fitX =
      SOURCE_W /
      washerImg.width;


    const fitY =
      SOURCE_H /
      washerImg.height;


    const scale =
      Math.min(
        fitX,
        fitY
      ) *
      washerScale;


    source.image(

      washerImg,

      washerX,
      washerY,

      washerImg.width *
        scale,

      washerImg.height *
        scale

    );

  }


  source.pop();


  drawDrumVideo();


  drawKnob();


  drawTimer();


  if (
    machineBroken
  ) {

    drawBrokenMachine();

  }

}


// ============================================================
// DRUM
// ============================================================

function drawDrumVideo() {

  const ctx =
    source.drawingContext;


  ctx.save();


  // circular clip
  ctx.beginPath();


  ctx.arc(

    drumX,

    drumY,

    drumSize / 2,

    0,

    Math.PI * 2

  );


  ctx.clip();


  ctx.fillStyle =
    "black";


  ctx.fillRect(

    drumX -
      drumSize / 2,

    drumY -
      drumSize / 2,

    drumSize,

    drumSize

  );


  ctx.translate(
    drumX,
    drumY
  );


  ctx.rotate(
    rotationAngle
  );


  // ==========================================================
  // BROKEN
  // ==========================================================

  if (
    machineBroken
  ) {

    drawBrokenDrum(
      ctx,
      activeVideo
    );

  }


  // ==========================================================
  // BABY CROSSFADE
  // ==========================================================

  else if (
    crossfadeActive &&
    fadeFrom &&
    fadeTo
  ) {

    let amount =

      (
        millis() -
        fadeStartTime
      )

      /

      BABY_FADE_DURATION;


    amount =
      constrain(
        amount,
        0,
        1
      );


    drawHTMLVideo(
      ctx,
      fadeFrom,
      1 - amount
    );


    drawHTMLVideo(
      ctx,
      fadeTo,
      amount
    );


    if (
      amount >= 1
    ) {

      crossfadeActive =
        false;


      pauseVideo(
        fadeFrom
      );


      activeVideo =
        fadeTo;


      fadeFrom =
        null;


      fadeTo =
        null;

    }

  }


  // ==========================================================
  // NORMAL
  // ==========================================================

  else {

    drawHTMLVideo(
      ctx,
      activeVideo,
      1
    );

  }


  ctx.restore();


  // ----------------------------------------------------------
  // CLICK MESSAGE
  // ----------------------------------------------------------

  if (
    !hasUserStarted
  ) {

    source.push();


    source.noStroke();


    source.fill(255);


    source.textAlign(
      source.CENTER,
      source.CENTER
    );


    source.textSize(22);


    source.text(
      "CLICK TO START",
      drumX,
      drumY
    );


    source.pop();

  }


  // ----------------------------------------------------------
  // DRUM GUIDE
  // ----------------------------------------------------------

  if (
    showGuides
  ) {

    source.push();


    source.noFill();


    source.stroke(
      0,
      200,
      255
    );


    source.strokeWeight(3);


    source.circle(
      drumX,
      drumY,
      drumSize
    );


    source.pop();

  }

}


// ============================================================
// NORMAL VIDEO DRAW
// ============================================================

function drawHTMLVideo(
  ctx,
  video,
  alpha = 1
) {

  if (
    !video ||
    video.readyState < 2 ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {

    return;

  }


  const aspect =
    video.videoWidth /
    video.videoHeight;


  let drawW =
    drumSize *
    mediaZoom;


  let drawH =
    drumSize *
    mediaZoom;


  if (
    aspect >= 1
  ) {

    drawW =
      drawH *
      aspect;

  }

  else {

    drawH =
      drawW /
      aspect;

  }


  ctx.save();


  ctx.globalAlpha =
    alpha;


  try {

    ctx.drawImage(

      video,

      -drawW / 2,

      -drawH / 2,

      drawW,

      drawH

    );

  }

  catch (error) {}


  ctx.restore();

}


// ============================================================
// BROKEN DRUM GLITCH
// ============================================================

function drawBrokenDrum(
  ctx,
  video
) {

  if (
    !video ||
    video.readyState < 2 ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {

    return;

  }


  const aspect =
    video.videoWidth /
    video.videoHeight;


  let drawW =
    drumSize *
    mediaZoom;


  let drawH =
    drumSize *
    mediaZoom;


  if (
    aspect >= 1
  ) {

    drawW =
      drawH *
      aspect;

  }

  else {

    drawH =
      drawW /
      aspect;

  }


  // occasional blank frame
  if (
    random() < 0.07
  ) {

    return;

  }


  // base frozen/stutter frame
  ctx.save();


  ctx.globalAlpha =
    random(
      0.72,
      1
    );


  try {

    ctx.drawImage(

      video,

      -drawW / 2 +
        random(
          -6,
          6
        ),

      -drawH / 2 +
        random(
          -4,
          4
        ),

      drawW,

      drawH

    );

  }

  catch (error) {}


  ctx.restore();


  // horizontal tearing
  const slices =
    floor(
      random(
        3,
        7
      )
    );


  for (
    let i = 0;
    i < slices;
    i++
  ) {

    const destY =
      random(
        -drawH / 2,
        drawH / 2
      );


    const destH =
      random(
        8,
        30
      );


    const srcY =
      map(
        destY,
        -drawH / 2,
        drawH / 2,
        0,
        video.videoHeight
      );


    const srcH =
      map(
        destH,
        0,
        drawH,
        0,
        video.videoHeight
      );


    ctx.save();


    ctx.globalAlpha =
      random(
        0.65,
        1
      );


    try {

      ctx.drawImage(

        video,

        0,
        srcY,

        video.videoWidth,
        srcH,

        -drawW / 2 +
          random(
            -38,
            38
          ),

        destY,

        drawW,
        destH

      );

    }

    catch (error) {}


    ctx.restore();

  }

}


// ============================================================
// START EXPERIENCE
// ============================================================

function startExperience() {

  if (
    hasUserStarted
  ) {

    return;

  }


  hasUserStarted =
    true;


  machineBroken =
    false;


  timerText =
    "60:00";


  activeVideo =
    introVideo;


  restartVideo(
    introVideo
  );


  // ==========================================================
  // START SOUND
  // ==========================================================

  if (
    typeof startSoundSystem === "function"
  ) {

    startSoundSystem();

  }


  console.log(
    "WASHING CYCLE STARTED"
  );

}


// ============================================================
// VIDEO HELPERS
// ============================================================

function playVideo(video) {

  if (
    !video
  ) {

    return;

  }


  video.muted =
    true;


  const promise =
    video.play();


  if (
    promise &&
    promise.catch
  ) {

    promise.catch(

      error => {

        console.warn(
          "VIDEO PLAY FAILED:",
          video.src,
          error
        );

      }

    );

  }

}


function pauseVideo(video) {

  if (
    !video
  ) {

    return;

  }


  try {

    video.pause();

  }

  catch (error) {}

}


function restartVideo(video) {

  if (
    !video
  ) {

    return;

  }


  try {

    video.currentTime =
      0;

  }

  catch (error) {}


  playVideo(
    video
  );

}


function stopAllVideos() {

  pauseVideo(
    introVideo
  );


  for (
    const video of stageVideos
  ) {

    pauseVideo(
      video
    );

  }

}


// ============================================================
// CHANGE STAGE
// ============================================================

function changeStage(index) {

  index =
    constrain(
      index,
      0,
      VIDEO_FILES.length - 1
    );


  cancelPendingRebirth();


  cancelBabyIntroTransition();


  machineBroken =
    false;


  if (
    !hasUserStarted
  ) {

    startExperience();

  }


  currentStage =
    index;


  // ==========================================================
  // SOUND STAGE
  // ==========================================================

  if (
    typeof updateStageSound === "function"
  ) {

    updateStageSound(
      currentStage
    );

  }


  spinSpeed =
    stageSpinSpeeds[index];


  spinning =
    true;


  syncControls();


  const nextVideo =
    stageVideos[index];


  // ==========================================================
  // BABY
  // ==========================================================

  if (
    index === 0
  ) {

    stopAllVideos();


    crossfadeActive =
      false;


    fadeFrom =
      null;


    fadeTo =
      null;


    activeVideo =
      introVideo;


    restartVideo(
      introVideo
    );


    try {

      nextVideo.currentTime =
        0;

    }

    catch (error) {}


    timerText =
      "60:00";


    babyIntroTimeout =
      setTimeout(

        () => {

          babyIntroTimeout =
            null;


          if (
            currentStage !== 0 ||
            machineBroken
          ) {

            return;

          }


          restartVideo(
            nextVideo
          );


          fadeFrom =
            introVideo;


          fadeTo =
            nextVideo;


          fadeStartTime =
            millis();


          crossfadeActive =
            true;

        },

        BABY_INTRO_HOLD

      );


    return;

  }


  // ==========================================================
  // NORMAL STAGE
  // ==========================================================

  crossfadeActive =
    false;


  fadeFrom =
    null;


  fadeTo =
    null;


  stopAllVideos();


  activeVideo =
    nextVideo;


  restartVideo(
    activeVideo
  );


  timerText =
    secondsToClock(
      STAGE_TIMER_START[index]
    );

}


// ============================================================
// CANCEL BABY TRANSITION
// ============================================================

function cancelBabyIntroTransition() {

  if (
    babyIntroTimeout !== null
  ) {

    clearTimeout(
      babyIntroTimeout
    );


    babyIntroTimeout =
      null;

  }

}


// ============================================================
// TIMER SYNC
// ============================================================

function updateStageTimer() {

  // ----------------------------------------------------------
  // BEFORE START
  // ----------------------------------------------------------

  if (
    !hasUserStarted
  ) {

    timerText =
      "60:00";


    syncTimerField();


    return;

  }


  // ----------------------------------------------------------
  // BROKEN
  // ----------------------------------------------------------

  if (
    machineBroken
  ) {

    timerText =
      "00:00";


    syncTimerField();


    return;

  }


  // ----------------------------------------------------------
  // REBIRTH
  // ----------------------------------------------------------

  if (
    currentStage === 11
  ) {

    timerText =
      "60:00";


    syncTimerField();


    return;

  }


  // ----------------------------------------------------------
  // BABY INTRO HOLD
  // ----------------------------------------------------------

  if (
    currentStage === 0 &&
    activeVideo === introVideo &&
    !crossfadeActive
  ) {

    timerText =
      "60:00";


    syncTimerField();


    return;

  }


  let timerVideo =
    activeVideo;


  if (
    crossfadeActive &&
    fadeTo
  ) {

    timerVideo =
      fadeTo;

  }


  if (
    !timerVideo
  ) {

    return;

  }


  const stageStart =
    STAGE_TIMER_START[
      currentStage
    ];


  const stageEnd =
    STAGE_TIMER_END[
      currentStage
    ];


  if (
    !Number.isFinite(
      timerVideo.duration
    ) ||
    timerVideo.duration <= 0
  ) {

    timerText =
      secondsToClock(
        stageStart
      );


    syncTimerField();


    return;

  }


  let progress =
    timerVideo.currentTime /
    timerVideo.duration;


  progress =
    constrain(
      progress,
      0,
      1
    );


  const remaining =
    lerp(
      stageStart,
      stageEnd,
      progress
    );


  timerText =
    secondsToClock(
      remaining
    );


  syncTimerField();

}


// ============================================================
// TIMER HTML SYNC
// ============================================================

function syncTimerField() {

  const timerInput =
    document.getElementById(
      "timerText"
    );


  if (
    timerInput &&
    timerInput.value !== timerText
  ) {

    timerInput.value =
      timerText;

  }

}


// ============================================================
// SECONDS → MM:SS
// ============================================================

function secondsToClock(
  totalSeconds
) {

  totalSeconds =
    Math.max(
      0,
      Math.round(
        totalSeconds
      )
    );


  const minutes =
    Math.floor(
      totalSeconds / 60
    );


  const seconds =
    totalSeconds % 60;


  return (
    nf(
      minutes,
      2
    ) +
    ":" +
    nf(
      seconds,
      2
    )
  );

}


// ============================================================
// OLD AGE FINISH
// ============================================================

function oldAgeFinished() {

  if (
    machineBroken
  ) {

    return;

  }


  cancelBabyIntroTransition();


  crossfadeActive =
    false;


  fadeFrom =
    null;


  fadeTo =
    null;


  timerText =
    "00:00";


  machineBroken =
    true;


  spinning =
    false;


  spinSpeed =
    0;


  pauseVideo(
    stageVideos[10]
  );


  syncTimerField();


  // ==========================================================
  // SOUND FAILURE
  // ==========================================================

  if (
    typeof playMachineFailureSound === "function"
  ) {

    playMachineFailureSound();

  }


  rebirthTimeout =
    setTimeout(

      () => {

        startRebirth();

      },

      REBIRTH_DELAY

    );

}


// ============================================================
// RED FAILURE FLASH
// ============================================================

function drawBrokenMachine() {

  const burst =
    noise(
      frameCount *
      0.15
    );


  if (
    burst > 0.56
  ) {

    source.push();


    source.noStroke();


    source.rectMode(
      source.CORNER
    );


    source.fill(
      255,
      15,
      5,
      random(
        35,
        95
      )
    );


    source.rect(
      0,
      0,
      SOURCE_W,
      SOURCE_H
    );


    source.pop();

  }

}


// ============================================================
// CANCEL REBIRTH
// ============================================================

function cancelPendingRebirth() {

  if (
    rebirthTimeout !== null
  ) {

    clearTimeout(
      rebirthTimeout
    );


    rebirthTimeout =
      null;

  }

}


// ============================================================
// REBIRTH
// ============================================================

function startRebirth() {

  cancelBabyIntroTransition();


  rebirthTimeout =
    null;


  machineBroken =
    false;


  currentStage =
    11;


  timerText =
    "60:00";


  crossfadeActive =
    false;


  fadeFrom =
    null;


  fadeTo =
    null;


  stopAllVideos();


  activeVideo =
    stageVideos[11];


  restartVideo(
    activeVideo
  );


  spinSpeed =
    stageSpinSpeeds[11];


  spinning =
    true;


  // ==========================================================
  // REBIRTH SOUND
  // ==========================================================

  if (
    typeof playRebirthSound === "function"
  ) {

    playRebirthSound();

  }


  syncControls();


  console.log(
    "REBIRTH"
  );

}


// ============================================================
// KNOB
// ============================================================

function drawKnob() {

  const total =
    stageWords.length;


  if (
    total === 0
  ) {

    return;

  }


  const step =
    TWO_PI /
    total;


  const start =
    -HALF_PI;


  source.push();


  source.textAlign(
    source.CENTER,
    source.CENTER
  );


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const angle =
      start +
      step *
      i;


    const x =
      knobX +
      cos(angle) *
      labelRadius;


    const y =
      knobY +
      sin(angle) *
      labelRadius;


    source.noStroke();


    source.fill(0);


    if (
      i === currentStage
    ) {

      source.textStyle(
        source.BOLD
      );


      source.textSize(14);

    }

    else {

      source.textStyle(
        source.NORMAL
      );


      source.textSize(9);

    }


    source.text(
      stageWords[i],
      x,
      y
    );

  }


  // pointer
  const pointerAngle =
    start +
    currentStage *
    step;


  source.stroke(0);


  source.strokeWeight(3);


  source.line(

    knobX,

    knobY,

    knobX +
      cos(
        pointerAngle
      ) *
      knobRadius,

    knobY +
      sin(
        pointerAngle
      ) *
      knobRadius

  );


  if (
    showGuides
  ) {

    source.noFill();


    source.stroke(
      0,
      200,
      255
    );


    source.strokeWeight(2);


    source.circle(
      knobX,
      knobY,
      knobRadius * 2
    );

  }


  source.pop();

}


// ============================================================
// TIMER DISPLAY
// ============================================================

function drawTimer() {

  source.push();


  source.rectMode(
    source.CENTER
  );


  source.noStroke();


  source.fill(
    0,
    230
  );


  source.rect(

    timerX,

    timerY,

    timerW,

    timerH,

    6

  );


  drawSevenSegmentText(

    timerText,

    timerX -
      timerW / 2 +
      14,

    timerY -
      timerH / 2 +
      8,

    timerH *
      0.72

  );


  source.pop();

}


// ============================================================
// SEVEN SEGMENT
// ============================================================

function drawSevenSegmentText(
  text,
  x,
  y,
  height
) {

  let cursorX =
    x;


  for (
    const character of text
  ) {

    if (
      character === ":"
    ) {

      drawColon(
        cursorX,
        y,
        height
      );


      cursorX +=
        height *
        0.28;

    }

    else {

      drawDigit(
        character,
        cursorX,
        y,
        height
      );


      cursorX +=
        height *
        0.62;

    }

  }

}


// ============================================================
// DIGIT
// ============================================================

function drawDigit(
  character,
  x,
  y,
  h
) {

  const w =
    h *
    0.48;


  const t =
    max(
      3,
      h *
      0.09
    );


  const digits = {

    "0":[1,1,1,1,1,1,0],

    "1":[0,1,1,0,0,0,0],

    "2":[1,1,0,1,1,0,1],

    "3":[1,1,1,1,0,0,1],

    "4":[0,1,1,0,0,1,1],

    "5":[1,0,1,1,0,1,1],

    "6":[1,0,1,1,1,1,1],

    "7":[1,1,1,0,0,0,0],

    "8":[1,1,1,1,1,1,1],

    "9":[1,1,1,1,0,1,1]

  };


  const s =
    digits[character] ||
    [0,0,0,0,0,0,0];


  function segment(
    on,
    sx,
    sy,
    sw,
    sh
  ) {

    source.noStroke();


    if (
      on
    ) {

      source.fill(
        110,
        235,
        160
      );

    }

    else {

      source.fill(
        15,
        40
      );

    }


    source.rect(
      sx,
      sy,
      sw,
      sh,
      2
    );

  }


  segment(
    s[0],
    x + t,
    y,
    w - t * 2,
    t
  );


  segment(
    s[1],
    x + w - t,
    y + t,
    t,
    h / 2 - t * 1.5
  );


  segment(
    s[2],
    x + w - t,
    y + h / 2 + t * 0.5,
    t,
    h / 2 - t * 1.5
  );


  segment(
    s[3],
    x + t,
    y + h - t,
    w - t * 2,
    t
  );


  segment(
    s[4],
    x,
    y + h / 2 + t * 0.5,
    t,
    h / 2 - t * 1.5
  );


  segment(
    s[5],
    x,
    y + t,
    t,
    h / 2 - t * 1.5
  );


  segment(
    s[6],
    x + t,
    y + h / 2 - t / 2,
    w - t * 2,
    t
  );

}


// ============================================================
// COLON
// ============================================================

function drawColon(
  x,
  y,
  h
) {

  source.noStroke();


  source.fill(
    110,
    235,
    160
  );


  source.circle(

    x + 5,

    y +
      h *
      0.32,

    h *
      0.08

  );


  source.circle(

    x + 5,

    y +
      h *
      0.70,

    h *
      0.08

  );

}


// ============================================================
// PROJECTION
// ============================================================

function drawProjection() {

  let shakeX = 0;
  let shakeY = 0;


  if (
    machineBroken
  ) {

    const shakeBurst =
      noise(
        frameCount *
        0.18
      );


    if (
      shakeBurst > 0.46
    ) {

      shakeX =
        random(
          -12,
          12
        );


      shakeY =
        random(
          -7,
          7
        );

    }

  }


  push();


  textureMode(
    NORMAL
  );


  noStroke();


  texture(
    source
  );


  beginShape(
    TRIANGLES
  );


  // TRIANGLE 1
  vertex(

    corners[0].x -
      width / 2 +
      shakeX,

    corners[0].y -
      height / 2 +
      shakeY,

    0,

    0,
    0

  );


  vertex(

    corners[1].x -
      width / 2 +
      shakeX,

    corners[1].y -
      height / 2 +
      shakeY,

    0,

    1,
    0

  );


  vertex(

    corners[2].x -
      width / 2 +
      shakeX,

    corners[2].y -
      height / 2 +
      shakeY,

    0,

    1,
    1

  );


  // TRIANGLE 2
  vertex(

    corners[0].x -
      width / 2 +
      shakeX,

    corners[0].y -
      height / 2 +
      shakeY,

    0,

    0,
    0

  );


  vertex(

    corners[2].x -
      width / 2 +
      shakeX,

    corners[2].y -
      height / 2 +
      shakeY,

    0,

    1,
    1

  );


  vertex(

    corners[3].x -
      width / 2 +
      shakeX,

    corners[3].y -
      height / 2 +
      shakeY,

    0,

    0,
    1

  );


  endShape();


  pop();

}


// ============================================================
// PROJECTION GUIDES
// ============================================================

function drawProjectionGuides() {

  push();


  translate(
    -width / 2,
    -height / 2
  );


  noFill();


  stroke(
    0,
    200,
    255
  );


  strokeWeight(2);


  beginShape();


  for (
    const corner of corners
  ) {

    vertex(
      corner.x,
      corner.y
    );

  }


  endShape(
    CLOSE
  );


  for (
    let i = 0;
    i < corners.length;
    i++
  ) {

    const corner =
      corners[i];


    noStroke();


    fill(
      0,
      200,
      255
    );


    circle(
      corner.x,
      corner.y,
      HANDLE_RADIUS * 2
    );


    fill(255);


    textAlign(
      CENTER,
      CENTER
    );


    textSize(12);


    text(
      i + 1,
      corner.x,
      corner.y - 23
    );

  }


  pop();

}


// ============================================================
// RESET MAPPING
// ============================================================

function resetMapping() {

  const aspect =
    SOURCE_W /
    SOURCE_H;


  let mappingH =
    height *
    MAP_HEIGHT_USAGE;


  let mappingW =
    mappingH *
    aspect;


  if (
    mappingW >
    width *
    MAP_WIDTH_USAGE
  ) {

    mappingW =
      width *
      MAP_WIDTH_USAGE;


    mappingH =
      mappingW /
      aspect;

  }


  const left =
    (
      width -
      mappingW
    ) /
    2;


  const top =
    (
      height -
      mappingH
    ) /
    2;


  corners = [

    {
      x: left,
      y: top
    },

    {
      x:
        left +
        mappingW,

      y: top
    },

    {
      x:
        left +
        mappingW,

      y:
        top +
        mappingH
    },

    {
      x: left,

      y:
        top +
        mappingH
    }

  ];

}


// ============================================================
// MOUSE
// ============================================================

function mousePressed() {

  if (
    !hasUserStarted
  ) {

    startExperience();

  }


  if (
    !showGuides
  ) {

    return;

  }


  for (
    let i = 0;
    i < corners.length;
    i++
  ) {

    const d =
      dist(

        mouseX,
        mouseY,

        corners[i].x,
        corners[i].y

      );


    if (
      d < 35
    ) {

      selectedCorner =
        i;


      return;

    }

  }

}


function mouseDragged() {

  if (
    selectedCorner === -1
  ) {

    return;

  }


  corners[
    selectedCorner
  ].x =
    constrain(
      mouseX,
      0,
      width
    );


  corners[
    selectedCorner
  ].y =
    constrain(
      mouseY,
      0,
      height
    );

}


function mouseReleased() {

  selectedCorner =
    -1;

}


// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {

  if (
    !hasUserStarted
  ) {

    startExperience();

  }


  // stages 1–9
  if (
    key >= "1" &&
    key <= "9"
  ) {

    changeStage(
      Number(key) - 1
    );

  }


  // Q = MIDDLE AGE
  if (
    key === "q" ||
    key === "Q"
  ) {

    changeStage(9);

  }


  // W = OLD AGE
  if (
    key === "w" ||
    key === "W"
  ) {

    changeStage(10);

  }


  // E = REBIRTH
  if (
    key === "e" ||
    key === "E"
  ) {

    changeStage(11);

  }


  // SPACE = pause drum spin
  if (
    key === " "
  ) {

    spinning =
      !spinning;


    return false;

  }


  // H = hide UI/guides
  if (
    key === "h" ||
    key === "H"
  ) {

    const controls =
      document.getElementById(
        "controls"
      );


    if (
      controls
    ) {

      const hidden =
        controls.style.display ===
        "none";


      controls.style.display =
        hidden
          ? "block"
          : "none";


      showGuides =
        hidden;

    }

    else {

      showGuides =
        !showGuides;

    }

  }


  // F = fullscreen
  if (
    key === "f" ||
    key === "F"
  ) {

    fullscreen(
      !fullscreen()
    );

  }

}


// ============================================================
// HTML CONTROLS
// ============================================================

function bindControls() {

  bindRange(
    "drumX",
    value =>
      drumX =
        Number(value)
  );


  bindRange(
    "drumY",
    value =>
      drumY =
        Number(value)
  );


  bindRange(
    "drumSize",
    value =>
      drumSize =
        Number(value)
  );


  bindRange(
    "mediaZoom",
    value =>
      mediaZoom =
        Number(value)
  );


  bindRange(
    "spinSpeed",
    value =>
      spinSpeed =
        Number(value)
  );


  bindRange(
    "knobX",
    value =>
      knobX =
        Number(value)
  );


  bindRange(
    "knobY",
    value =>
      knobY =
        Number(value)
  );


  bindRange(
    "knobRadius",
    value =>
      knobRadius =
        Number(value)
  );


  bindRange(
    "labelRadius",
    value =>
      labelRadius =
        Number(value)
  );


  bindRange(
    "timerX",
    value =>
      timerX =
        Number(value)
  );


  bindRange(
    "timerY",
    value =>
      timerY =
        Number(value)
  );


  bindRange(
    "timerW",
    value =>
      timerW =
        Number(value)
  );


  bindRange(
    "timerH",
    value =>
      timerH =
        Number(value)
  );


  // ----------------------------------------------------------
  // STAGE SELECT
  // ----------------------------------------------------------

  const stageSelect =
    document.getElementById(
      "stageSelect"
    );


  if (
    stageSelect
  ) {

    stageSelect.addEventListener(

      "change",

      event => {

        changeStage(
          Number(
            event.target.value
          )
        );

      }

    );

  }


  // ----------------------------------------------------------
  // STAGE LABELS
  // ----------------------------------------------------------

  const stageWordsInput =
    document.getElementById(
      "stageWords"
    );


  if (
    stageWordsInput
  ) {

    stageWordsInput.addEventListener(

      "input",

      event => {

        stageWords =
          event.target.value

            .split(",")

            .map(
              word =>
                word.trim()
            )

            .filter(
              word =>
                word.length > 0
            );

      }

    );

  }


  // ----------------------------------------------------------
  // PAUSE
  // ----------------------------------------------------------

  const pauseButton =
    document.getElementById(
      "pauseSpin"
    );


  if (
    pauseButton
  ) {

    pauseButton.addEventListener(

      "click",

      () => {

        spinning =
          !spinning;


        pauseButton.textContent =
          spinning
            ? "Pause Spin"
            : "Resume Spin";

      }

    );

  }


  // ----------------------------------------------------------
  // REVERSE
  // ----------------------------------------------------------

  const reverseButton =
    document.getElementById(
      "reverseSpin"
    );


  if (
    reverseButton
  ) {

    reverseButton.addEventListener(

      "click",

      () => {

        spinSpeed *=
          -1;


        syncControls();

      }

    );

  }


  // ----------------------------------------------------------
  // RESET MAP
  // ----------------------------------------------------------

  const resetButton =
    document.getElementById(
      "resetMap"
    );


  if (
    resetButton
  ) {

    resetButton.addEventListener(
      "click",
      resetMapping
    );

  }


  // ----------------------------------------------------------
  // GUIDES
  // ----------------------------------------------------------

  const guideButton =
    document.getElementById(
      "toggleGuides"
    );


  if (
    guideButton
  ) {

    guideButton.addEventListener(

      "click",

      () => {

        showGuides =
          !showGuides;


        guideButton.textContent =
          showGuides
            ? "Hide Guides"
            : "Show Guides";

      }

    );

  }


  // ----------------------------------------------------------
  // FULLSCREEN
  // ----------------------------------------------------------

  const fullscreenButton =
    document.getElementById(
      "toggleFullscreen"
    );


  if (
    fullscreenButton
  ) {

    fullscreenButton.addEventListener(

      "click",

      () => {

        fullscreen(
          !fullscreen()
        );

      }

    );

  }

}


// ============================================================
// RANGE HELPER
// ============================================================

function bindRange(
  id,
  callback
) {

  const element =
    document.getElementById(
      id
    );


  if (
    !element
  ) {

    return;

  }


  element.addEventListener(

    "input",

    event => {

      callback(
        event.target.value
      );

    }

  );

}


// ============================================================
// SYNC CONTROLS
// ============================================================

function syncControls() {

  setControl(
    "drumX",
    drumX
  );


  setControl(
    "drumY",
    drumY
  );


  setControl(
    "drumSize",
    drumSize
  );


  setControl(
    "mediaZoom",
    mediaZoom
  );


  setControl(
    "spinSpeed",
    spinSpeed
  );


  setControl(
    "knobX",
    knobX
  );


  setControl(
    "knobY",
    knobY
  );


  setControl(
    "knobRadius",
    knobRadius
  );


  setControl(
    "labelRadius",
    labelRadius
  );


  setControl(
    "timerX",
    timerX
  );


  setControl(
    "timerY",
    timerY
  );


  setControl(
    "timerW",
    timerW
  );


  setControl(
    "timerH",
    timerH
  );


  const stageSelect =
    document.getElementById(
      "stageSelect"
    );


  if (
    stageSelect
  ) {

    stageSelect.value =
      currentStage;

  }


  const timerInput =
    document.getElementById(
      "timerText"
    );


  if (
    timerInput
  ) {

    timerInput.value =
      timerText;


    timerInput.readOnly =
      true;

  }

}


// ============================================================
// SET CONTROL
// ============================================================

function setControl(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (
    element
  ) {

    element.value =
      value;

  }

}


// ============================================================
// RESIZE
// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );


  resetMapping();

}