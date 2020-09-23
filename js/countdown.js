/**
 * jQuery Timer doesn't natively act like a stopwatch, it only
 * aids in building one.  You need to keep track of the current
 * time in a variable and increment it manually.  Then on each
 * incrementation, update the page.
 *
 * The increment time for jQuery Timer is in milliseconds. So an
 * input time of 1000 would equal 1 time per second.  In this
 * example we use an increment time of 70 which is roughly 14
 * times per second.  You can adjust your timer if you wish.
 *
 * The update function converts the current time to minutes,
 * seconds and hundredths of a second.  It then outputs that to
 * the stopwatch element, $stopwatch, and then increments. Since
 * the current time is stored in hundredths of a second so the
 * increment time must be divided by ten.
 */

var countdown = new (function() {
    var $countdown,
        $form, // Form used to change the countdown time
        incrementTime = 70,
        currentTime = 360000,
        updateTimer = function() {
            $countdown.html(formatTime(currentTime));
            if (currentTime == 0) {
                countdown.Timer.stop();
                timerComplete();
                countdown.resetCountdown();
                return;
            }
            currentTime -= incrementTime / 10;
            if (currentTime < 0) currentTime = 0;
        },
        timerComplete = function() {
		gameover.playclip();
            	alert('Game over!');
        },
        init = function() {
            $countdown = $('.countdown-timer');
            countdown.Timer = $.timer(updateTimer, incrementTime, false);
            $form = $('#cpanel');
            $form.bind('submit', function() {
                countdown.resetCountdown();
                return false;
            });
        };
    this.resetCountdown = function() {
        var newTime = parseInt($form.find('input[type=text]').val()) * 100;
        if (newTime > 0) {currentTime = newTime;}
        this.Timer.stop().once();
    };
    $(init);
});

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}	

//Skrypt audio
var audiotypes={
        "mp3": "audio/mpeg",
        "mp4": "audio/mp4",
        "ogg": "audio/ogg",
        "wav": "audio/wav"
    }
function ss_soundbits(sound){
        var audio_element = document.createElement('audio')
        if (audio_element.canPlayType){
            for (var i=0; i<arguments.length; i++){
                var source_element = document.createElement('source')
                source_element.setAttribute('src', arguments[i])
                if (arguments[i].match(/\.(\w+)$/i))
                    source_element.setAttribute('type', audiotypes[RegExp.$1])
                audio_element.appendChild(source_element)
            }
            audio_element.load()
            audio_element.playclip=function(){
                audio_element.pause()
                audio_element.currentTime=0
                audio_element.play()
            }
            return audio_element
        }
    }
	
	var winners  = ss_soundbits('audio/winners.mp3');
   	var hint  = ss_soundbits('audio/notification.mp3');
	var gameover  = ss_soundbits('audio/game-over.mp3');
	var depesza  = ss_soundbits('audio/depesza.mp3');
	var soundtrack  = ss_soundbits('audio/soundtrack.mp3');

// MOJE ZMIANY (odtwarzanie audio, buttony, show/hide itp.)

//Start odliczania czasu + start soundtrack
var start = function() {
	countdown.Timer.toggle();
	soundtrack.play();
};

//Winners: muzyka + obraz "Mission Accomplished"
var winners_play = function() {
   	winners.playclip(); 
	countdown.Timer.stop();
	depesza.pause();
	soundtrack.pause();
	$('#winnersdiv').slideDown('slow');
};

//Button_music odtwarzanie muzyki (start/stop)
var action = 1;
var music = function() {
	 if ( action == 1 ) {
        soundtrack.pause();
        action = 2;
    } else {
        soundtrack.play();
        action = 1;
    }
};

//Button_mute zatrzymywanie wszystkich dźwieków
var mute = function() {
	depesza.pause();
	soundtrack.pause();
	winners.pause(); 
	action = 2;
};

//Button_depesza odtwarzanie depeszy radiowej ("Sierra Alpha [...]")
var depesza_play = function() {
	depesza.playclip();
	action = 2;
};

//Odkrywanie/chowanie control panelu przyciskami

$(document).ready(function() {
    $('#logo').click(function () {
        $('#cpanel').toggle();
    });
    $('#button_play').click(function () {
        $('#cpanel').toggle();
    });
    $('#button_winners').click(function () {
        $('#cpanel').toggle();
    });
});

//Dodawanie wskazówek przyciskiem "Add"
$(document).ready(function() {
    $("#button_add").click(function (){
        var toAdd = $("input[name=message]").val();
        $('#messages').append('<div class="item">' + toAdd + '</div>');
	$("input[name=message]").val('');
	hint.playclip(); 
	$('#cpanel').hide();
     });

//Dodawanie wskazówek klawiszem "enter"
$('input[name=message]').on('keypress', function(e) {
	var code = e.keyCode || e.which;
	if(code==13) {
		var toAdd = $('input[name=message]').val();
		$('#messages').append('<div class="item">' + toAdd + '</div>');
		hint.playclip();
		$('input[name=message]').val('');
		$('#cpanel').hide();
	}
	});

//Usuwanie linijek ze wskazówkami poprzez kliknięcie
$(document).on('click','.item', function() {
   $(this).remove();
    })
})
