
$( window ).ready( function() {
  function init() {
    console.log('controlVid');
    console.log('init');
    var vid = document.getElementById("vid");
        vidEnd = vid.duration;    // Returns the ending time (in seconds)
        sliderRange = $('.ui-slider-range');
        currentTime = vid.currentTime.toFixed(0);
        remainingTime = (vidEnd.toFixed(0) - vid.currentTime.toFixed(0));
        currentPercent = ((vid.currentTime / vidEnd) * 100).toFixed(0);
        remainingPercent =  (100 - currentPercent).toFixed(0);
        vidWidth = vid.width;
        sliderHandle = $('.ui-slider-handle');
        sliderRangeMax = $( '#slider-range-max');
        trackProgressTime = 70;
        progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
        tl = new TimelineMax({paused:true});
        paused = false;
        
        // Check to see if calculations are made for the stats before the code runs (avoid throwing up 'NaN' errors);
        remainingTimeValue = isNaN(remainingTime);
        currentPercentValue = isNaN(currentPercent);
        remainingPercentValue = isNaN(remainingPercent);

        solveCalculations = setInterval(function(){ solvingCalulations() }, 100);

    // Run an initial check to see if the numbers for stats to be displayed have been calculated (this will avoid NaN errors being thrown up)
    // ... if not then re-init the whole program
    function solvingCalulations() {
      if (remainingTimeValue == false && currentPercentValue == false && remainingPercentValue == false) {
        console.log('NaN is no longer a problem... play video')
        vid.play();
        tl.play();
        clearInterval(solveCalculations);    
      } else {
        console.log('re-initialising');
        clearInterval(solveCalculations);    
        init();
      }
    };

    // greensock timeline
    function initTl() {
      tl.to(headerOne, 0.5, {x:20, alpha:1, delay:1});
      tl.to(headerTwo, 0.5, {x:20, alpha:1, delay:2.5});
      tl.to(headerThree, 0.5, {x:20, alpha:1, delay:2.5});
      tl.staggerTo([headerOne, headerTwo, headerThree], 0.5, {alpha:0, delay:3}, 0.25);
      tl.to(headerFour, 0.5, {x:20, alpha:1, delay:2});
      tl.to(headerFive, 0.5, {x:20, alpha:1, delay:2});
      tl.to(headerSix, 0.5, {x:20, alpha:1, delay:2});
      tl.staggerTo([headerFour, headerFive, headerSix], 0.5, {alpha:0, delay:3}, 0.25);
      tlDuration = tl.duration();
      console.log( 'tl duration = ' + tlDuration )
    }

    // JQuery slider
    $( function() {
      var inc = 10;
      $( "#slider-range-max" ).slider({
        range: "max",
        min: 0,
        max: vidEnd * inc,
        value: 0,
        slide: function( event, ui ) {
          // On the slider being on mousedown, the following happens:
          // video and animation are paused
          // clear the interval which automatically updates the stats throughout the video
          // update the stats according to slider position
          // display replay button only if the video has ended, hide it when it hasn't ended
          // keep the greensock timeline in sync with video and slider
          vid.pause();
          tl.pause();
          clearInterval( progressInterval );

          $( "#box" ).val( ui.value * inc);
          console.log(ui.value / inc);
          vid.currentTime = ui.value / inc.toFixed(0);
          tlCurrentTimeAsPercent = ui.value / inc.toFixed(0);
          var currentTime = vid.currentTime.toFixed(0);
          var remainingTime = (vidEnd.toFixed(0) - vid.currentTime.toFixed(0));
          var currentPercent = ((vid.currentTime / vidEnd) * 100).toFixed(0);
          var remainingPercent =  (100 - currentPercent).toFixed(0);
          $( "#currentTimeBox" ).text( 'Current Time = ' + vid.currentTime + ' seconds' );
          $( "#timeLeftBox" ).text( 'Time Remaining = ' + remainingTime + ' seconds' );
          $( "#currentPercentBox" ).text( 'Percent Complete = ' + currentPercent + ' %' );
          $( "#percentLeftBox" ).text( 'Percent Remaining = ' + remainingPercent + ' %' );

          if ( currentTime != vidEnd ) {
            console.log( 'vid has not ended' );
            $("#replayBtn").fadeOut(250);
          }

          // the below variable ensures the slider is in sync with both the video and timeline start and end points
          vidTotimelineGulf = vidEnd / tlDuration;
          console.log('vidEnd / tlDuration = ' + vidEnd / tlDuration )
          tlCurrentTime = (( currentPercent / 100 ) * tlDuration) * vidTotimelineGulf  ;  
          console.log( 'time in seconds of tlDuration = ' + tlCurrentTime );
          tl.seek( tlCurrentTime )
        },          
      });
    });

    // When the slider triggers mouseup, check to see if the video and timeline were playing when slider triggered mousedown
    // If they were playing, then play from current slider posiiton, if not then pause at current slider position 
    $( "#slider-range-max" ).on( "slidestop", function( event, ui ) {
      console.log('stop')
      if (paused == false) {
        progressInterval;
        vid.play(vid.currentTime);
        tl.play( tlCurrentTime );
        progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
      } else {
        vid.pause();
        tl.pause();
      }
    });

    // Automatically update the stats for the time display etc (set to occur every 70ms);
    function updateProgress() {
      var currentTime = vid.currentTime.toFixed(0);
      var remainingTime = (vidEnd.toFixed(0) - vid.currentTime.toFixed(0));
      var currentPercent = ((vid.currentTime / vidEnd) * 100);
      var remainingPercent =  (100 - currentPercent).toFixed(0);

      console.log('currentTime = ' + currentTime );
      console.log('currentPercent = ' + currentPercent );

      $( "#currentTimeBox" ).text( 'Current Time = ' + currentTime + ' seconds' );
      $( "#timeLeftBox" ).text( 'Time Remaining = ' + remainingTime + ' seconds' );
      $( "#currentPercentBox" ).text( 'Percent Complete = ' + currentPercent.toFixed(0) + ' %' );
      $( "#percentLeftBox" ).text( 'Percent Remaining = ' + remainingPercent + ' %' );

      $( '.ui-slider-handle' ).css({left: currentPercent.toFixed(10) + '%', position:'absolute'});
      $( '.ui-slider-range' ).css({right: 0 + '%', width:100-currentPercent + '%', position:'absolute'});

      // If percentage complete reaches 100%, then clear the interval
      if (currentPercent == 100 ) {
        console.log( 'progress complete' );
        clearInterval( progressInterval );
      }
    };

    // Pause video and timeline and clear interval when button clicked, resume play and setInterval when clicked again
    $( '#playPauseBtn' ).click (function() {
      console.log('///////////////// button clicked /////////////////');
      console.log(paused)
      if (paused == false) {
        vid.pause();
        tl.pause();
        document.getElementById('playPauseBtn').innerHTML = 'Play';
        clearInterval( progressInterval );
        paused = true;  
      } else {
        vid.play();
        tl.play();
        document.getElementById('playPauseBtn').innerHTML = 'Pause';
        progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
        paused = false;
      }
    });

    vid.addEventListener('ended', displayReplayIcon);

    // Display the replay button when video has ended, replay the video and timeline from the beginning when clicked 
    // Remove replay button if the video is not at the end
    function displayReplayIcon() {
      console.log('*************************** vid has ended ***************************')
      $("#replayBtn").fadeIn();
      $( '#replayBtn' ).animate({
        opacity: 1
      }, 500);
    };

    $( '#replayBtn' ).click( function() {
      console.log('replay video');
      vid.play(0);
      tl.play(0);
      progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
      $("#replayBtn").fadeOut(500);
    });

    if (vid.currentTime != vid.duration) {
      $("#replayBtn").fadeOut();
      console.log('button disappears');
    };
    // initGreensockTl
    initTl();
  };

  init();

});






