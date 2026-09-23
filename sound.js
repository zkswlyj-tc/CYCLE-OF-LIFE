// ============================================================
// CYCLE OF LIFE — SOUND SYSTEM
// ============================================================
//
// Uses your exact files:
// newborn.mp3
// electrical_fail.mp3
// low_drone.mp3
// home_roomtone.mp3
// wedding_bells.mp3
// crowd.mp3
// city_sounds.mp3
// bike_wind.mp3
// childhood.mp3
// heartbeat.mp3
// machine_hum.mp3
// main_track.mp3
//
// Put them in:
// assets/sounds/
// ============================================================


// ============================================================
// GLOBAL AUDIO STATE
// ============================================================

let audioContext = null;

let soundStarted = false;

let masterSoundGain = null;


// ============================================================
// VOLUMES
// ============================================================

const MASTER_VOLUME = 0.9;

const MAIN_TRACK_VOLUME = 0.42;

const MACHINE_HUM_VOLUME = 0.12;

const SOUND_FADE_TIME = 1.8;


// ============================================================
// FILES
// ============================================================

const SOUND_FILES = {

  main:
    "assets/sounds/main_track.mp3",

  machineHum:
    "assets/sounds/machine_hum.mp3",

  heartbeat:
    "assets/sounds/heartbeat.mp3",

  childhood:
    "assets/sounds/childhood.mp3",

  bikeWind:
    "assets/sounds/bike_wind.mp3",

  city:
    "assets/sounds/city_sounds.mp3",

  crowd:
    "assets/sounds/crowd.mp3",

  wedding:
    "assets/sounds/wedding_bells.mp3",

  home:
    "assets/sounds/home_roomtone.mp3",

  drone:
    "assets/sounds/low_drone.mp3",

  electricalFail:
    "assets/sounds/electrical_fail.mp3",

  newborn:
    "assets/sounds/newborn.mp3"

};


// ============================================================
// SOUND OBJECT STORAGE
// ============================================================

const sounds = {};


// ============================================================
// CREATE SOUND
// ============================================================

function createSound(
  name,
  path,
  loop = true
) {

  const audio =
    new Audio(path);


  audio.loop =
    loop;


  audio.preload =
    "auto";


  audio.crossOrigin =
    "anonymous";


  sounds[name] = {

    audio: audio,

    sourceNode: null,

    gainNode: null,

    currentVolume: 0

  };

}


// ============================================================
// SETUP ALL SOUNDS
// ============================================================

function setupSoundSystem() {

  createSound(
    "main",
    SOUND_FILES.main,
    true
  );


  createSound(
    "machineHum",
    SOUND_FILES.machineHum,
    true
  );


  createSound(
    "heartbeat",
    SOUND_FILES.heartbeat,
    true
  );


  createSound(
    "childhood",
    SOUND_FILES.childhood,
    true
  );


  createSound(
    "bikeWind",
    SOUND_FILES.bikeWind,
    true
  );


  createSound(
    "city",
    SOUND_FILES.city,
    true
  );


  createSound(
    "crowd",
    SOUND_FILES.crowd,
    true
  );


  createSound(
    "wedding",
    SOUND_FILES.wedding,
    true
  );


  createSound(
    "home",
    SOUND_FILES.home,
    true
  );


  createSound(
    "drone",
    SOUND_FILES.drone,
    true
  );


  createSound(
    "electricalFail",
    SOUND_FILES.electricalFail,
    false
  );


  createSound(
    "newborn",
    SOUND_FILES.newborn,
    false
  );


  console.log(
    "SOUND SYSTEM READY"
  );

}


// ============================================================
// START SOUND SYSTEM
// ============================================================
//
// MUST be called after user click/key
// because browsers block autoplay audio.
// ============================================================

function startSoundSystem() {

  if (
    soundStarted
  ) {

    return;

  }


  soundStarted =
    true;


  audioContext =
    new (
      window.AudioContext ||
      window.webkitAudioContext
    )();


  masterSoundGain =
    audioContext.createGain();


  masterSoundGain.gain.value =
    MASTER_VOLUME;


  masterSoundGain.connect(
    audioContext.destination
  );


  // ----------------------------------------------------------
  // CONNECT EVERY SOUND
  // ----------------------------------------------------------

  for (
    const name in sounds
  ) {

    const sound =
      sounds[name];


    const sourceNode =
      audioContext.createMediaElementSource(
        sound.audio
      );


    const gainNode =
      audioContext.createGain();


    gainNode.gain.value =
      0;


    sourceNode.connect(
      gainNode
    );


    gainNode.connect(
      masterSoundGain
    );


    sound.sourceNode =
      sourceNode;


    sound.gainNode =
      gainNode;

  }


  // ----------------------------------------------------------
  // START LOOPING TRACKS
  // ----------------------------------------------------------

  for (
    const name in sounds
  ) {

    const sound =
      sounds[name];


    if (
      sound.audio.loop
    ) {

      sound.audio.play()
        .catch(
          () => {}
        );

    }

  }


  // ----------------------------------------------------------
  // BASE LAYERS
  // ----------------------------------------------------------

  setSoundVolume(
    "main",
    MAIN_TRACK_VOLUME,
    3
  );


  setSoundVolume(
    "machineHum",
    MACHINE_HUM_VOLUME,
    3
  );


  updateStageSound(0);


  console.log(
    "SOUND STARTED"
  );

}


// ============================================================
// SET / FADE SOUND VOLUME
// ============================================================

function setSoundVolume(
  name,
  targetVolume,
  fadeTime = SOUND_FADE_TIME
) {

  if (
    !soundStarted ||
    !sounds[name] ||
    !sounds[name].gainNode
  ) {

    return;

  }


  const gain =
    sounds[name].gainNode.gain;


  const now =
    audioContext.currentTime;


  gain.cancelScheduledValues(
    now
  );


  gain.setValueAtTime(
    gain.value,
    now
  );


  gain.linearRampToValueAtTime(
    targetVolume,
    now + fadeTime
  );


  sounds[name].currentVolume =
    targetVolume;

}


// ============================================================
// FADE OUT ALL LIFE LAYERS
// ============================================================
//
// Main track + machine hum remain.
// ============================================================

function fadeOutLifeLayers(
  fadeTime = SOUND_FADE_TIME
) {

  const layers = [

    "heartbeat",

    "childhood",

    "bikeWind",

    "city",

    "crowd",

    "wedding",

    "home",

    "drone"

  ];


  for (
    const name of layers
  ) {

    setSoundVolume(
      name,
      0,
      fadeTime
    );

  }

}


// ============================================================
// LIFE STAGE SOUND
// ============================================================

function updateStageSound(stage) {

  if (
    !soundStarted
  ) {

    return;

  }


  fadeOutLifeLayers();


  // ==========================================================
  // 0 — BABY
  // ==========================================================

  if (
    stage === 0
  ) {

    setSoundVolume(
      "heartbeat",
      0.22,
      2.5
    );


    setSoundVolume(
      "machineHum",
      0.10,
      2
    );

  }


  // ==========================================================
  // 1 — CHILD RUNNING
  // ==========================================================

  else if (
    stage === 1
  ) {

    setSoundVolume(
      "childhood",
      0.18,
      2
    );


    setSoundVolume(
      "heartbeat",
      0.04,
      2
    );

  }


  // ==========================================================
  // 2 — CHILD EATING
  // ==========================================================

  else if (
    stage === 2
  ) {

    setSoundVolume(
      "home",
      0.12,
      2
    );


    setSoundVolume(
      "childhood",
      0.08,
      2
    );

  }


  // ==========================================================
  // 3 — BIKE
  // ==========================================================

  else if (
    stage === 3
  ) {

    setSoundVolume(
      "bikeWind",
      0.18,
      1.5
    );


    setSoundVolume(
      "childhood",
      0.06,
      2
    );

  }


  // ==========================================================
  // 4 — TEEN
  // ==========================================================

  else if (
    stage === 4
  ) {

    setSoundVolume(
      "city",
      0.12,
      2
    );


    setSoundVolume(
      "crowd",
      0.08,
      2
    );

  }


  // ==========================================================
  // 5 — YOUNG ADULT
  // ==========================================================

  else if (
    stage === 5
  ) {

    setSoundVolume(
      "city",
      0.18,
      2
    );


    setSoundVolume(
      "crowd",
      0.12,
      2
    );

  }


  // ==========================================================
  // 6 — WEDDING
  // ==========================================================

  else if (
    stage === 6
  ) {

    setSoundVolume(
      "wedding",
      0.15,
      2.5
    );


    setSoundVolume(
      "crowd",
      0.06,
      2
    );

  }


  // ==========================================================
  // 7 — ADULT
  // ==========================================================

  else if (
    stage === 7
  ) {

    setSoundVolume(
      "city",
      0.10,
      2
    );


    setSoundVolume(
      "home",
      0.08,
      2
    );

  }


  // ==========================================================
  // 8 — FAMILY
  // ==========================================================

  else if (
    stage === 8
  ) {

    setSoundVolume(
      "home",
      0.17,
      2
    );


    setSoundVolume(
      "childhood",
      0.05,
      2
    );

  }


  // ==========================================================
  // 9 — MIDDLE AGE
  // ==========================================================

  else if (
    stage === 9
  ) {

    setSoundVolume(
      "home",
      0.07,
      3
    );


    setSoundVolume(
      "drone",
      0.08,
      4
    );

  }


  // ==========================================================
  // 10 — OLD AGE
  // ==========================================================

  else if (
    stage === 10
  ) {

    setSoundVolume(
      "drone",
      0.18,
      4
    );


    setSoundVolume(
      "machineHum",
      0.20,
      4
    );


    // main track becomes slightly quieter
    setSoundVolume(
      "main",
      0.34,
      4
    );

  }


  // ==========================================================
  // 11 — REBIRTH
  // ==========================================================

  else if (
    stage === 11
  ) {

    setSoundVolume(
      "heartbeat",
      0.20,
      2
    );


    setSoundVolume(
      "machineHum",
      MACHINE_HUM_VOLUME,
      2
    );


    setSoundVolume(
      "main",
      MAIN_TRACK_VOLUME,
      3
    );

  }

}


// ============================================================
// ELECTRICAL FAILURE
// ============================================================

function playMachineFailureSound() {

  if (
    !soundStarted
  ) {

    return;

  }


  // life ambience disappears quickly
  fadeOutLifeLayers(
    0.35
  );


  // main music collapses down
  setSoundVolume(
    "main",
    0.08,
    0.5
  );


  // machine hum gets louder
  setSoundVolume(
    "machineHum",
    0.26,
    0.25
  );


  const failure =
    sounds.electricalFail;


  if (
    failure
  ) {

    try {

      failure.audio.currentTime =
        0;

    }

    catch (error) {}


    failure.audio.play()
      .catch(
        () => {}
      );


    setSoundVolume(
      "electricalFail",
      0.55,
      0.05
    );

  }

}


// ============================================================
// REBIRTH SOUND
// ============================================================

function playRebirthSound() {

  if (
    !soundStarted
  ) {

    return;

  }


  // electrical failure fades away
  setSoundVolume(
    "electricalFail",
    0,
    0.5
  );


  // restore machine
  setSoundVolume(
    "machineHum",
    MACHINE_HUM_VOLUME,
    2
  );


  // restore soundtrack
  setSoundVolume(
    "main",
    MAIN_TRACK_VOLUME,
    3.5
  );


  // heartbeat returns
  setSoundVolume(
    "heartbeat",
    0.20,
    2
  );


  // ----------------------------------------------------------
  // NEWBORN ACCENT
  // ----------------------------------------------------------

  const newborn =
    sounds.newborn;


  if (
    newborn
  ) {

    try {

      newborn.audio.currentTime =
        0;

    }

    catch (error) {}


    newborn.audio.play()
      .catch(
        () => {}
      );


    setSoundVolume(
      "newborn",
      0.22,
      0.15
    );


    // don't leave newborn sound sitting loud
    setTimeout(

      () => {

        setSoundVolume(
          "newborn",
          0,
          2
        );

      },

      3500

    );

  }

}


// ============================================================
// MASTER MUTE
// ============================================================

function muteSoundSystem() {

  if (
    !soundStarted ||
    !masterSoundGain
  ) {

    return;

  }


  masterSoundGain.gain
    .linearRampToValueAtTime(

      0,

      audioContext.currentTime +
        0.3

    );

}


// ============================================================
// MASTER UNMUTE
// ============================================================

function unmuteSoundSystem() {

  if (
    !soundStarted ||
    !masterSoundGain
  ) {

    return;

  }


  masterSoundGain.gain
    .linearRampToValueAtTime(

      MASTER_VOLUME,

      audioContext.currentTime +
        0.3

    );

}