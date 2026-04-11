i want build a free to use browser based web application that transcribes audio, costs me nothing to host/run, and costs the user absolutely nothing.





i want a simple shitty base minium styled html document that runs a worker in the background for transcription

all i want is a nav with a couple of buttons (upload recording), a little status bar that shows the name and length of the recording once uploaded, and a transcribe button that is only enabled after a valid recording file is uploaded

i want to only enable file upload for valid audio files

the browser transcription has a couple of states, so i want a warming up phase (which will be called firing up engines), and then an active transcribing state (transcribing), and then a payload complete once it's finished

the final button that should only be enabled when the transcription is finished is a copy button which copies the transcription for the user, and also a reset button which starts over

put these buttons / statuses at the top and then just have the transcription load below

transcription can go forever. the app should be responsive. i literally don't think you need any css styling at all for it but we'll see.

i have given you an example projcet where the js files show you a working browser based implementation of a transcription project.

i want all the transcription logic to work, but i only need the html ux utilities for the described app above in the instructions (basically the same thing with all the extra crap cut out so it looks like a super bare bones shitty but highly functional gamechanging website)

recreate it in the root directory. 1 html file, and however many js files necessary - pop js in utils folder probably to keep it tidy.