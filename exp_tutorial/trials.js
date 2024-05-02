// JSON-style object including parameters for each trial. 
// This need to be transformed into a format that can be read by jsPsych, see create_tv_array(json_object) in util.js
let trial_objects = [
    {
        "stimulus": "audio/Violin.wav",
        "correct": "NEW"
    },
    {
        "stimulus": "audio/Bologna.wav",
        "correct": "NEW"
    },
    {
        "stimulus": "audio/Violin.wav",
        "correct": "OLD"
    },
    {
        "stimulus": "audio/Bologna.wav",
        "correct": "OLD"
    }
]

// parameters for each trial. 
let trial_objects2 = [
    {stimulus: 'audio/Violin.wav', data: {audio: "violin", correct: "NEW"}}, // everything in data will be recorded in results
    {stimulus: 'audio/Bologna.wav', data: {audio: "bologna", correct: "NEW"}},
    {stimulus: 'audio/Violin.wav', data: {audio: "violin", correct: "OLD"}},
    {stimulus: 'audio/Bologna.wav', data: {audio: "bologna", correct: "OLD"}}
]