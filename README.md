# HALO — Modular English prototype

This is the complete English HALO interface, split into HTML, two CSS stylesheets, and **17 JavaScript files** organized by responsibility. All three realistic mission-card images and the real Junín grebe mascot are included in `assets/`.

## Run

For a quick look, open `index.html` in Chrome or Edge. For camera/microphone testing, serve the whole folder over localhost (or HTTPS). For example:

```bash
cd HALO_Modular_English
python -m http.server 8000
```

Then open `http://localhost:8000` and grant camera/microphone permissions when requested.

## File map

| Folder/file | Purpose |
| --- | --- |
| `index.html` | Main HTML layout and ordered script references |
| `css/base.css` | Layout and general component styling |
| `css/aerospace-theme.css` | Professional aerospace-themed visual overrides |
| `js/01-utils.js` | Shared helpers and cleanup |
| `js/02-zambi-chatbot.js` | Grebe assistant, speech synthesis and guidance |
| `js/03-scenarios.js` | Orbital station, space travel and lunar surface |
| `js/04-psychology-questions.js` | Five psychological dimensions, interview prompts and keyword matching |
| `js/05-support-recommendations.js` | Context-specific support suggestions |
| `js/06-history-storage.js` | History and browser localStorage |
| `js/07-session-state.js` | Active astronaut, session state and page progression |
| `js/08-home-consent.js` | Home and informed consent screens |
| `js/09-diary-interview.js` | Audiovisual diary and adaptive interview turn-taking |
| `js/10-camera-recorder.js` | Camera/microphone acquisition and observational metrics |
| `js/11-check-in.js` | Psychological check-in screen |
| `js/12-cognitive-activities.js` | Cognitive mini-games and scoring |
| `js/13-results.js` | Summary logic and display |
| `js/14-support-activity.js` | Guided breathing and support planning |
| `js/15-closing-interview.js` | Session closing and saving |
| `js/16-history-view.js` | History screens and longitudinal charts |
| `js/17-navigation.js` | Route rendering, event bindings and app initialization |
| `assets/` | Station, transit, lunar visuals and Zambi grebe image |

**Maintenance:** Script order in `index.html` is important. Files use classic scripts with shared top-level functions and variables, not ES modules, so they work with no bundler or build step. Do not move `17-navigation.js` above other files.

**Limitations:** This is a prototype. Voice and speech recognition depend on browser support, permissions and device voices; the adaptive dialogue is rule-based, not connected to a conversational model. The tool is not validated for clinical diagnosis. Local browser history is not a secure health-record storage system.
