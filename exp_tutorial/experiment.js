// initialize jsPsych (effectively constructing an object of the jsPsych class)
const jsPsych = initJsPsych({
    show_progress_bar: true, // the automatic progress bar calculates the total number of trials as the length of the timeline. We'll need to manually update the progress
    auto_update_progress_bar: false, 
    on_finish: function () {
        jsPsych.data.displayData('csv'); // results will be displayed at the end of the experiment
      }
  });

// timeline will be used to define which type of trials will be run at a given point during the experiment 
let timeline = []; 
// push experiment logic the timeline here...

// CONSENT
const irb = {
    // Which plugin to use
    type: jsPsychHtmlButtonResponse,
    // What should be displayed on the screen
    // You can use \ to write text in multiple lines
    stimulus: '<p><font size="4">We invite you to participate in a research study on language production and comprehension. \
    Your experimenter will ask you to do a linguistic task such as reading sentences or words, \
    naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game. \
    <br><br>There are no risks or benefits of any kind involved in this study. \
    <br><br>You will be paid for your participation at the posted rate.\
    <br><br>If you have read this form and have decided to participate in this experiment,\
    please understand your participation is voluntary and you have the right to withdraw your consent or \
    discontinue participation at anytime without penalty or loss of benefits to which you are otherwise entitled. \
    You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published \
    and written data resulting from the study. You may print this form for your records.<br><br>CONTACT INFORMATION: \
    If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, \
    you should contact the Protocol Director Meghan Sumner at (650)-725-9336. If you are not satisfied with \
    how this study is being conducted, or if you have any concerns, complaints, or general questions \
    about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) \
    to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. \
    You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, \
    Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, \
    please proceed to the study tasks.</font></p>',
    // What should the button(s) say
    choices: ['Continue']
};
// push to the timeline (push means attach to the list)
timeline.push(irb)

// INSTRUCTION
const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "In this experiment, you will hear a series of words. If it's your first time hearing the word, press 'D' \
    for NEW. If you've already heard the word during the task, press 'K' for OLD. \
    Try to respond as quickly and accurately as you can.\
    <br><br><br>When you're ready to begin, press the <b>space bar</b>.",
    choices: [" "] // choices is an array of acceptable keyboard responses
};
timeline.push(instructions);

// TRIALS
let tv_array = create_tv_array(trial_objects); // transform array format
// combine nested timelines and timeline variables.
const trials = {
    timeline: [ // timeline will hold an array of objects defining small procedures for the experiment to loop through
        { // playing audio and recording response
            type: jsPsychAudioKeyboardResponse,
            choices: ['d', 'k'],
            stimulus: jsPsych.timelineVariable('stimulus'), // read corresponding information from timeline_variables
            response_allowed_while_playing: false,
            response_ends_trial: false,
            trial_duration: 3000, // participants can response after audio onset, the trial will proceed after 2s irregardless of response
            prompt: `<div class=\"option_container\"><div class=\"option\">
            NEW<br><b>D</b></div><div class=\"option\">
            OLD<br><b>K</b></div></div>`, //  You can also write string arguments over multiple lines by enclosing everything with the ` character rather than “ or ‘.
            on_finish: function(data) {
                evaluate_response(data); // this function is defined in util.js to evaluate participants' response
            },
            data: jsPsych.timelineVariable('data') // read corresponding information from timeline_variables
        },
        { // this is a 1s silence interval, no response needed
            type: jsPsychHtmlKeyboardResponse,
            choices: [""],
            stimulus: "",
            response_ends_trial: false,
            trial_duration: 1000,
            on_finish: function(data) {
                // if we also want the progress bar to update when participants, for example, click through pages of instructions, 
                // we just need to add the same on_finish parameter to those trials as well
                jsPsych.setProgressBar((data.trial_index - 1) / (timeline.length + tv_array.length))
            }
        } 
    ],
    timeline_variables: set_trial_order(tv_array), // timeline_variables give an arrray of objects 
    //randomize_order: true // NOTE: if trial order is randomised, the NEW/OLD correct answer will change too!
}
timeline.push(trials);

// PRELOAD (preload all media so the presentation won't be delayed)
const preload_array = ['audio/Bologna.wav', 'audio/Violin.wav'];
const preload_trial = {
    type: jsPsychPreload,
    audio: preload_array
};

timeline.unshift(preload_trial); // unshift: push it to the beginning of the timeline array.

// END INSTRUCTION
const quest_intstructions = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: "That's the end of the experiment! Thank you for your responses. \
    <br><br>To help us analyze our results, it would be helpful to know know a little more about you. \
    Please answer the following questions. <br><br>"
}
timeline.push(quest_intstructions);

// POST-EXP SURVEY
const questionnaire = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'multi-choice',
                prompt: 'Did you read the instructions and do you think you did the task correctly?', 
                name: 'correct', 
                options: ['Yes', 'No', 'I was confused']
            },
            {
                type: 'drop-down',
                prompt: 'Gender:',
                name: 'gender',
                options: ['Female', 'Male', 'Non-binary/Non-conforming', 'Other']
            },
            {
                type: 'text',
                prompt: 'Age:',
                name: 'age',
                textbox_columns: 10
            },
            {
                type: 'drop-down',
                prompt: 'Level of education:',
                name: 'education',
                options: ['Some high school', 'Graduated high school', 'Some college', 'Graduated college', 'Hold a higher degree']
            },
            {
                type: 'text',
                prompt: "Native language? (What was the language spoken at home when you were growing up?)",
                name: 'language',
                textbox_columns: 20
            },
            {
                type: 'drop-down',
                prompt: 'Do you think the payment was fair?',
                name: 'payment',
                options: ['The payment was too low', 'The payment was fair']
            },
            {
                type: 'drop-down',
                prompt: 'Did you enjoy the experiment?',
                name: 'enjoy',
                options: ['Worse than the average experiment', 'An average experiment', 'Better than the average experiment']
            },
            {
                type: 'text',
                prompt: "Do you have any other comments about this experiment?",
                name: 'comments',
                textbox_columns: 30,
                textbox_rows: 4
            }
        ]
    ]
};
timeline.push(questionnaire)

// END EXP
const thanks = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: "Thank you for your time! Please click 'Continue' and then wait a moment until you're directed back to Prolific.<br><br>"
}
timeline.push(thanks)

jsPsych.run(timeline)
