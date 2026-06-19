(function () {
    const uaMobile    = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const touchSmall  = matchMedia("(pointer: coarse)").matches && matchMedia("(max-width: 900px)").matches;
    const isMobile    = uaMobile || touchSmall;
    if (!isMobile) return;
    document.documentElement.innerHTML =
        '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>endrosity\'s vault</title><link rel="stylesheet" href="assets/css/style.css"></head>' +
        '<body class="mobile-block">Mobile is not supported.<br>Please view on desktop.</body>';
    throw new Error("__mobile_blocked__");
})();

if (location.protocol === "http:") {
    location.replace(location.href.replace(/^http:/, "https:"));
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const isDevtools   = key === "f12";
    const isInspect    = e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c");
    const isViewSource = e.ctrlKey && key === "u";
    const isSave       = (e.ctrlKey || e.metaKey) && key === "s";

    if (isDevtools || isInspect || isViewSource || isSave) {
        e.preventDefault();
        e.stopPropagation();
        alert("Inspection is disabled.\nBlehhhh.");
        return false;
    }
});

function obliteratePage() {
    try {
        document.documentElement.innerHTML =
            '<body style="margin:0;background:#000;color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:1.5em;">Inspection is disabled. Blehhhh.</body>';
    } catch (_) {}
    try { window.stop(); } catch (_) {}
    try { location.replace("about:blank"); } catch (_) {}
}

function flagDevtools() {
    obliteratePage();
}

(function debugTrap() {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) flagDevtools();
    setTimeout(debugTrap, 50);
})();

setInterval(() => {
    try { Function("debugger;")(); } catch (_) {}
}, 50);

setInterval(() => {
    const threshold = 160;
    const widthGap  = window.outerWidth  - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    if (widthGap > threshold || heightGap > threshold) flagDevtools();
}, 500);


const loadingOverlay  = document.getElementById("loading-overlay");
const loadingProgress = document.getElementById("loading-progress");

(function cycleTabTitle() {
    const suffixes = [":3", ":p", "x3", ":<", ":o", ":c", ":>", ":b", ":d", "xP"];
    let i = 0;
    function tickTitle() {
        document.title = `endrosity's vault | ${suffixes[i]}`;
        i = (i + 1) % suffixes.length;
    }
    tickTitle();
    setInterval(tickTitle, 1750);
})();

const trackNames = [
    "Breaking", "Confined", "Crush", "Crying", "Destruction",
    "Enough", "Heartbreak", "Internal", "Limerence", "Loser",
    "Lost", "Lovely", "Nights", "Power", "Rejection",
    "Resonance", "Sleeping", "Slump", "Therapy", "Undermined", 
    "Faces",
];
const videoPath = (name) => `assets/videos/${name}.mp4`;
const playlist  = trackNames.map(videoPath);

const staticAssets = [
    "assets/buttons/play.png",
    "assets/buttons/pause.png",
    "assets/buttons/skip-back.png",
    "assets/buttons/skip-forward.png",
    "assets/buttons/speaker-muted.png",
    "assets/buttons/speaker-unmuted.png",
    "assets/buttons/reload.png",
    "assets/buttons/shuffle.png",
    "assets/buttons/noshuffle.png",
    "assets/buttons/on.png",
    "assets/buttons/off.png",
    "assets/buttons/goleft.png",
    "assets/buttons/goright.png",
    "assets/misc/cursor.png",
    "assets/misc/favi.png",
    "assets/misc/kunt.png",
    "assets/misc/hanging.png",
    "assets/misc/swinging.png",
    "assets/misc/sayori.png",
    "assets/misc/swingset.png",
    "assets/misc/miku.png",
    "assets/misc/yuri.png",
    "assets/misc/natsuki.png",
    "assets/misc/monika.png",
];

const TOTAL_STEPS = staticAssets.length;
const loadStart   = performance.now();
let   stepsDone   = 0;
let   overlayDone = false;

function refreshProgressLabel() {
    const pct     = Math.min(100, Math.round((stepsDone / TOTAL_STEPS) * 100));
    const elapsed = ((performance.now() - loadStart) / 1000).toFixed(2);
    loadingProgress.textContent = `Loading buy-drugs.online: ${pct}% (${elapsed}s)`;
}

function bumpProgress() {
    stepsDone++;
    refreshProgressLabel();
    if (stepsDone >= TOTAL_STEPS) finishLoading();
}

function finishLoading() {
    if (overlayDone) return;
    overlayDone = true;
    refreshProgressLabel();
    loadingOverlay.classList.add("fade-out");
    setTimeout(() => {
        loadingOverlay.remove();
        setTimeout(() => {
            const elsewhereDiv = document.querySelector(".elsewhere");
            if (elsewhereDiv) elsewhereDiv.classList.add("chars-running");
        }, 8750);
    }, 1750);
}

const tickTimer = setInterval(() => {
    if (overlayDone) { clearInterval(tickTimer); return; }
    refreshProgressLabel();
}, 80);

setTimeout(finishLoading, 15000);

staticAssets.forEach((src) => {
    const img = new Image();
    const done = () => bumpProgress();
    img.onload  = done;
    img.onerror = done;
    img.src = src;
});

const SETTINGS_KEY = "endrosity-settings";
function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
    catch (_) { return {}; }
}
function saveSettings(patch) {
    const merged = Object.assign(loadSettings(), patch);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged)); }
    catch (_) {}
}
const savedSettings = loadSettings();

document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-href]");
    if (!t) return;
    e.stopPropagation();
    window.open(t.dataset.href, "_blank", "noopener,noreferrer");
}, true);
document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = document.activeElement;
    if (t && t.dataset && t.dataset.href) {
        e.preventDefault();
        window.open(t.dataset.href, "_blank", "noopener,noreferrer");
    }
});

(function splitElsewhereChars() {
    const link = document.getElementById("elsewhere-link");
    if (!link) return;
    const text = link.textContent;
    const frag = document.createDocumentFragment();
    let charIdx = 0;
    for (const ch of text) {
        if (ch === " ") {
            frag.appendChild(document.createTextNode(" "));
        } else {
            const s = document.createElement("span");
            s.className = "char";
            s.textContent = ch;
            s.style.animationDelay = (charIdx * 0.1).toFixed(2) + "s";
            charIdx++;
            frag.appendChild(s);
        }
    }
    link.textContent = "";
    link.appendChild(frag);
})();

const creditsOverlay = document.getElementById("credits-overlay");
const creditsContent = document.getElementById("credits-content");

function toggleCredits() {
    creditsOverlay.classList.toggle("visible");
}

document.getElementById("credits-toggle").addEventListener("click", toggleCredits);
creditsOverlay.addEventListener("click", toggleCredits);
creditsContent.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        creditsOverlay.classList.remove("visible");
    }
});

const swingerImage = document.getElementById("swinger-image");
const swingerOptions = [
    "assets/misc/hanging.png",
    "assets/misc/swinging.png",
    "assets/misc/sayori.png",
    "assets/misc/swingset.png",
    "assets/misc/miku.png",
    "assets/misc/yuri.png",
    "assets/misc/natsuki.png",
    "assets/misc/monika.png",
];

function pickRandomSwinger() {
    let next;
    do {
        next = swingerOptions[Math.floor(Math.random() * swingerOptions.length)];
    } while (swingerImage.src.endsWith(next) && swingerOptions.length > 1);
    swingerImage.src = next;
}

const initialSwingerExclusions = ["sayori.png", "hanging.png"];
const initialSwingerPool = swingerOptions.filter(
    (src) => !initialSwingerExclusions.some((bad) => src.endsWith(bad))
);
swingerImage.src = initialSwingerPool[Math.floor(Math.random() * initialSwingerPool.length)];

document.getElementById("reload-btn").addEventListener("click", () => {
    if (!swingerVisible) return;
    pickRandomSwinger();
});

const swingerContainer  = document.querySelector(".swinger");
const swingerToggleBtn  = document.getElementById("swinger-toggle-btn");
const swingerToggleLbl  = document.getElementById("swinger-toggle-label");
const swingerToggleIcon = document.getElementById("swinger-toggle-icon");
let swingerVisible = savedSettings.swingerVisible !== false;
swingerContainer.classList.toggle("hidden", !swingerVisible);
swingerToggleLbl.textContent = swingerVisible ? "Disable Image" : "Enable Image";
swingerToggleIcon.src        = swingerVisible
    ? "assets/buttons/on.png"
    : "assets/buttons/off.png";
swingerToggleBtn.addEventListener("click", () => {
    swingerVisible = !swingerVisible;
    swingerContainer.classList.toggle("hidden", !swingerVisible);
    swingerToggleLbl.textContent  = swingerVisible ? "Disable Image" : "Enable Image";
    swingerToggleIcon.src         = swingerVisible
        ? "assets/buttons/on.png"
        : "assets/buttons/off.png";
    saveSettings({ swingerVisible });
});

const konamiSequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
];
let konamiIndex = 0;
const konamiAudio = new Audio("assets/misc/kc.mp3");
konamiAudio.preload = "auto";

let konamiAudioUnlocked = false;
function tryUnlockKonamiAudio() {
    if (konamiAudioUnlocked) return;
    const p = konamiAudio.play();
    const settle = () => {
        konamiAudio.pause();
        konamiAudio.currentTime = 0;
        konamiAudioUnlocked = true;
        document.removeEventListener("keydown",     tryUnlockKonamiAudio, true);
        document.removeEventListener("click",       tryUnlockKonamiAudio, true);
        document.removeEventListener("pointerdown", tryUnlockKonamiAudio, true);
    };
    if (p && typeof p.then === "function") {
        p.then(settle).catch(() => {});
    } else {
        settle();
    }
}
document.addEventListener("keydown",     tryUnlockKonamiAudio, true);
document.addEventListener("click",       tryUnlockKonamiAudio, true);
document.addEventListener("pointerdown", tryUnlockKonamiAudio, true);

document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
            swingerImage.src = "assets/misc/ee.png";
            konamiAudio.currentTime = 0;
            konamiAudio.play().catch(() => {});
            konamiIndex = 0;
        }
    } else {
        konamiIndex = (k === konamiSequence[0]) ? 1 : 0;
    }
});

const bgVideo      = document.getElementById("bg-video");
const bgPrefetch   = document.getElementById("bg-video-prefetch");
const muteBtn      = document.getElementById("mute-btn");
const muteIcon     = document.getElementById("mute-icon");
const playBtn      = document.getElementById("play-btn");
const playIcon     = document.getElementById("play-icon");
const volumeInput  = document.getElementById("volume");
const prevBtn      = document.getElementById("prev-btn");
const nextBtn      = document.getElementById("next-btn");
const shuffleBtn   = document.getElementById("shuffle-btn");
const shuffleIcon  = document.getElementById("shuffle-icon");
const nowPlaying   = document.getElementById("now-playing");
const trackCounter = document.getElementById("track-counter");
const trackTime    = document.getElementById("track-time");

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}
function updateTrackTime() {
    trackTime.textContent = `${formatTime(bgVideo.currentTime)} | ${formatTime(bgVideo.duration)}`;
}
function formatTrackCounter() {
    const total = shuffled.length;
    if (total === 0) return "Track: 0/0";
    const width = String(total).length;
    return `Track: ${String(cursor + 1).padStart(width, "0")}/${total}`;
}

let shuffled        = [];
let cursor          = 0;
let loadToken       = 0;
let shuffleEnabled  = savedSettings.shuffleEnabled === true;
let shuffleEnabledAt = 0;
let fadeOutScheduled = false;
let fadeOutStartedAt = 0;
let fadeOutDurationMs = 0;
let transitioning = false;
const FADE_MS = 5000;
const MANUAL_TYPE_MS = 2500;

let sliderVolume = 0.5;
let fadeMultiplier = 1;
let volumeFadeRaf = null;
function applyVolume() {
    bgVideo.volume = Math.max(0, Math.min(1, sliderVolume * fadeMultiplier));
}
function fadeVolumeTo(target, duration) {
    if (volumeFadeRaf) cancelAnimationFrame(volumeFadeRaf);
    const startMult = fadeMultiplier;
    const startTime = performance.now();
    function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        fadeMultiplier = startMult + (target - startMult) * t;
        applyVolume();
        if (t < 1) volumeFadeRaf = requestAnimationFrame(step);
        else volumeFadeRaf = null;
    }
    volumeFadeRaf = requestAnimationFrame(step);
}
function snapVolumeMultiplier(value) {
    if (volumeFadeRaf) cancelAnimationFrame(volumeFadeRaf);
    volumeFadeRaf = null;
    fadeMultiplier = value;
    applyVolume();
}

let titleAnimToken = 0;
function setTitleInstant(text) {
    titleAnimToken++;
    nowPlaying.textContent = "Now Playing: " + text;
}
function typeTitle(text, duration) {
    const myToken = ++titleAnimToken;
    const totalLen = text.length;
    nowPlaying.textContent = "Now Playing: ";
    if (totalLen === 0) return;
    const interval = duration / totalLen;
    let len = 0;
    function tick() {
        if (myToken !== titleAnimToken) return;
        len++;
        nowPlaying.textContent = "Now Playing: " + text.slice(0, len);
        if (len < totalLen) setTimeout(tick, interval);
    }
    setTimeout(tick, interval);
}
function untypeTitle(duration) {
    const myToken = ++titleAnimToken;
    const prefix = "Now Playing: ";
    const fullText = nowPlaying.textContent;

    const text = fullText.startsWith(prefix)
        ? fullText.slice(prefix.length)
        : fullText;

    const totalLen = text.length;
    if (totalLen === 0) return;

    const interval = duration / totalLen;
    let len = totalLen;

    function tick() {
        if (myToken !== titleAnimToken) return;
        len--;
        nowPlaying.textContent = prefix + text.slice(0, Math.max(0, len));
        if (len > 0) setTimeout(tick, interval);
    }

    setTimeout(tick, interval);
}

function maybeStartFadeOut() {
    if (fadeOutScheduled || bgVideo.paused) return;
    const duration = bgVideo.duration;
    if (!isFinite(duration) || duration <= 0) return;
    const remaining = duration - bgVideo.currentTime;
    if (remaining > 0 && remaining <= FADE_MS / 1000) {
        const durMs = Math.max(50, Math.round(remaining * 1000));
        fadeOutScheduled  = true;
        fadeOutStartedAt  = Date.now();
        fadeOutDurationMs = durMs;
        bgVideo.style.transition = `opacity ${durMs}ms linear`;
        bgVideo.style.opacity = "0";
        fadeVolumeTo(0, durMs);
        untypeTitle(durMs);
    }
}

function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildQueue() {
    shuffled = shuffleEnabled
        ? shuffleInPlace([...playlist])
        : [...playlist];
}

function rebuildQueueAfterEnd(prevLastUrl) {
    if (!shuffleEnabled) return;
    buildQueue();
    if (shuffled.length > 1 && shuffled[0] === prevLastUrl) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
}

function waitForReady(media) {
    if (media.error) return Promise.resolve(false);
    if (media.readyState >= 1) return Promise.resolve(true);
    return new Promise((resolve) => {
        const cleanup = () => {
            media.removeEventListener("loadedmetadata", onReady);
            media.removeEventListener("error",          onError);
        };
        const onReady = () => { cleanup(); resolve(true);  };
        const onError = () => { cleanup(); resolve(false); };
        media.addEventListener("loadedmetadata", onReady, { once: true });
        media.addEventListener("error",          onError, { once: true });
    });
}

function markNoTracks() {
    nowPlaying.textContent   = "No playable tracks";
    trackCounter.textContent = "Track: 0/0";
}

function removeTrackFromQueue(url) {
    const idx = shuffled.indexOf(url);
    if (idx >= 0) {
        shuffled.splice(idx, 1);
        if (cursor > idx) cursor--;
    }
    const plIdx = playlist.indexOf(url);
    if (plIdx >= 0) {
        playlist.splice(plIdx, 1);
        saveSettings({ persistentOrder: [...playlist] });
    }
}

bgVideo.addEventListener("play",  () => { if (!transitioning) playIcon.src = "assets/buttons/pause.png"; });
bgVideo.addEventListener("pause", () => {
    if (transitioning || bgVideo.ended) return;
    playIcon.src = "assets/buttons/play.png";
});

function prefetchNextVideo() {
    if (shuffled.length < 2) return;
    const nextIndex = (cursor + 1) % shuffled.length;
    const nextSrc   = shuffled[nextIndex];
    if (!bgPrefetch.src.endsWith(nextSrc)) {
        bgPrefetch.src = nextSrc;
        bgPrefetch.load();
    }
}

function snapNoTransition(opacityValue) {
    bgVideo.style.transition = "none";
    bgVideo.style.opacity = opacityValue;
    void bgVideo.offsetHeight;
    bgVideo.style.transition = "";
}

function showPlaybackBlocked() {
    titleAnimToken++;
    nowPlaying.textContent = "Playback blocked — click play to retry";
}

function userPlay() {
    return bgVideo.play().catch(() => {
        showPlaybackBlocked();
    });
}

async function loadCurrentTrack({ autoPlay, manual = false } = { autoPlay: false }) {
    if (shuffled.length === 0) {
        markNoTracks();
        return;
    }

    const myToken   = ++loadToken;
    transitioning = true;
    try {
        const trackUrl  = shuffled[cursor];
        const fileName = trackUrl.split("/").pop();
        const newTitle = fileName;
        const shouldFade   = fadeOutScheduled && !manual;
        const startedAt    = fadeOutStartedAt;
        const fadeOutDur   = fadeOutDurationMs;

        bgVideo.pause();

        if (!shouldFade) {
            snapNoTransition("1");
            snapVolumeMultiplier(1);
            fadeOutScheduled = false;
            if (manual) setTitleInstant("");
        }

        if (!bgVideo.src.endsWith(trackUrl)) {
            bgVideo.src = trackUrl;
            bgVideo.load();
        }

        prefetchNextVideo();

        trackCounter.textContent = formatTrackCounter();
        trackTime.textContent    = "0:00 | 0:00";
        bgVideo.style.display    = "block";
        document.body.classList.add("video-active");

        const ok = await waitForReady(bgVideo);
        if (myToken !== loadToken) return;

        if (!ok || bgVideo.error) {
            removeTrackFromQueue(trackUrl);
            if (shuffled.length === 0) {
                markNoTracks();
                return;
            }
            if (cursor >= shuffled.length) cursor = 0;
            return loadCurrentTrack({ autoPlay, manual });
        }

        try { bgVideo.currentTime = 0; } catch (_) {}

        if (shouldFade) {
            const elapsed   = Date.now() - startedAt;
            const remaining = Math.max(0, fadeOutDur - elapsed);
            if (remaining > 0) {
                await new Promise((r) => setTimeout(r, remaining));
                if (myToken !== loadToken) return;
            }
            bgVideo.style.transition = `opacity ${FADE_MS}ms linear`;
            bgVideo.style.opacity = "1";
            fadeVolumeTo(1, FADE_MS);
            typeTitle(newTitle, FADE_MS);
            fadeOutScheduled = false;
        } else if (manual) {
            typeTitle(newTitle, MANUAL_TYPE_MS);
        } else {
            setTitleInstant(newTitle);
        }

        if (autoPlay) {
            await bgVideo.play().catch(() => {});
        }
    } finally {
        if (myToken === loadToken) {
            transitioning = false;
            playIcon.src = bgVideo.paused
                ? "assets/buttons/play.png"
                : "assets/buttons/pause.png";
        }
    }
}

async function nextTrack(autoPlay = true, manual = false) {
    cursor++;
    if (cursor >= shuffled.length) {
        const prevLast = shuffled[shuffled.length - 1];
        rebuildQueueAfterEnd(prevLast);
        cursor = 0;
    }
    await loadCurrentTrack({ autoPlay, manual });
}

async function prevTrack(autoPlay = true, manual = false) {
    cursor = (cursor - 1 + shuffled.length) % shuffled.length;
    await loadCurrentTrack({ autoPlay, manual });
}

sliderVolume      = 0.5;
fadeMultiplier    = 1;
bgVideo.volume    = 0.5;
bgVideo.muted     = false;
volumeInput.value = 0.5;
playIcon.src      = "assets/buttons/play.png";
muteIcon.src      = "assets/buttons/speaker-unmuted.png";
shuffleIcon.src   = shuffleEnabled
    ? "assets/buttons/shuffle.png"
    : "assets/buttons/noshuffle.png";

(function initPlaylist() {
    const saved = Array.isArray(savedSettings.persistentOrder)
        ? savedSettings.persistentOrder
        : null;
    let order;
    if (saved) {
        const playlistSet = new Set(playlist);
        order = saved.filter((url) => playlistSet.has(url));
        const seen = new Set(order);
        const newOnes = playlist.filter((url) => !seen.has(url));
        if (newOnes.length) order.push(...shuffleInPlace(newOnes));
    } else {
        order = shuffleInPlace([...playlist]);
    }

    playlist.length = 0;
    playlist.push(...order);
    buildQueue();
    if (playlist.length === 0) {
        markNoTracks();
        return;
    }
    loadCurrentTrack({ autoPlay: false });
})();

function reshuffleQueueWithCurrentFirst() {
    const currentUrl = shuffled[cursor];
    shuffled = shuffleInPlace([...playlist]);
    if (currentUrl) {
        const idx = shuffled.indexOf(currentUrl);
        if (idx > 0) {
            shuffled.splice(idx, 1);
            shuffled.unshift(currentUrl);
        }
    }
    cursor = 0;
    if (shuffled.length > 0) {
        trackCounter.textContent = formatTrackCounter();
    }
}

let shuffleForceUsed = false;
shuffleBtn.addEventListener("click", () => {
    const now = Date.now();
    if (shuffleEnabled && !shuffleForceUsed && now - shuffleEnabledAt < 750) {
        reshuffleQueueWithCurrentFirst();
        shuffleEnabledAt = now;
        shuffleForceUsed = true;
        return;
    }
    shuffleEnabled = !shuffleEnabled;
    shuffleIcon.src = shuffleEnabled
        ? "assets/buttons/shuffle.png"
        : "assets/buttons/noshuffle.png";
    if (shuffleEnabled) {
        shuffleEnabledAt = now;
        shuffleForceUsed = false;
    } else {
        playlist.length = 0;
        playlist.push(...shuffled);
        saveSettings({ persistentOrder: [...playlist] });
    }
    saveSettings({ shuffleEnabled });
});

muteBtn.addEventListener("click", () => {
    bgVideo.muted = !bgVideo.muted;
    muteIcon.src = bgVideo.muted
        ? "assets/buttons/speaker-muted.png"
        : "assets/buttons/speaker-unmuted.png";
});

playBtn.addEventListener("click", () => {
    if (bgVideo.paused) userPlay();
    else                bgVideo.pause();
});

nextBtn.addEventListener("click", () => nextTrack(!bgVideo.paused, true));

prevBtn.addEventListener("click", async () => {
    if (bgVideo.currentTime > 5) {
        const wasPlaying = !bgVideo.paused;
        bgVideo.pause();
        try { bgVideo.currentTime = 0; } catch (_) {}
        await waitForReady(bgVideo);
        if (wasPlaying) {
            await bgVideo.play().catch(() => {});
        }
    } else {
        prevTrack(!bgVideo.paused, true);
    }
});

volumeInput.addEventListener("input", (e) => {
    sliderVolume = parseFloat(e.target.value);
    applyVolume();
});

document.addEventListener("pointerup", () => {
    const ae = document.activeElement;
    if (!ae) return;
    const tag = ae.tagName;
    if (tag === "BUTTON" || (tag === "INPUT" && ae.type === "range")) {
        ae.blur();
    }
});

const seekIndicators = {
    left:  document.getElementById("seek-indicator-left"),
    right: document.getElementById("seek-indicator-right"),
};
function flashSeekIndicator(side) {
    const el = seekIndicators[side];
    if (!el) return;
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
}

document.addEventListener("keydown", (e) => {
    const ae = document.activeElement;
    const tag = ae ? ae.tagName : "";
    const hasHref = !!(ae && ae.dataset && ae.dataset.href);
    const isFormControl = hasHref || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON";

    if (e.key === " " || e.code === "Space") {
        if (isFormControl) return;
        e.preventDefault();
        if (bgVideo.paused) userPlay();
        else                bgVideo.pause();
        return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (konamiIndex >= 4 && konamiIndex < 8) return;
        if (isFormControl) return;
        const delta = e.key === "ArrowLeft" ? -5 : 5;
        const dur = bgVideo.duration;
        let next = bgVideo.currentTime + delta;
        if (!isFinite(next)) return;
        if (next < 0) next = 0;
        if (isFinite(dur) && next > dur) next = dur;
        try { bgVideo.currentTime = next; } catch (_) {}
        updateTrackTime();
        flashSeekIndicator(delta < 0 ? "left" : "right");
    }
}, true);

bgVideo.addEventListener("ended", () => nextTrack(true, false));
bgVideo.addEventListener("timeupdate", () => {
    updateTrackTime();
    maybeStartFadeOut();
});
bgVideo.addEventListener("loadedmetadata", updateTrackTime);
bgVideo.addEventListener("durationchange", updateTrackTime);

const canvas = document.getElementById("particle-canvas");
const ctx    = canvas.getContext("2d");
const particles = [];
const PARTICLES_PER_MOVE = 1;
const MAX_PARTICLES      = 200;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let rafActive = false;
function startParticleLoop() {
    if (rafActive) return;
    rafActive = true;
    requestAnimationFrame(renderParticles);
}

document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < PARTICLES_PER_MOVE; i++) {
        particles.push({
            x: e.clientX + Math.random() * 20 - 10,
            y: e.clientY + Math.random() * 20 - 10,
            radius: Math.random() * 2 + 1,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            alpha: 1,
        });
    }
    if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
    }
    startParticleLoop();
});

function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y     += p.speedY;
        p.x     += p.speedX;
        p.alpha -= 0.005;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(85, 4, 0, ${p.alpha})`;
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) {
        requestAnimationFrame(renderParticles);
    } else {
        rafActive = false;
    }
}
