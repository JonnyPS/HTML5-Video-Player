
$( window ).ready( function() {
  function init() {
    console.log('controlVid');
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
        paused = false;
      
        // console.log(vidEnd.toFixed(0) - vid.currentTime.toFixed(0));

        // Check to see if calculations are made for the stats before the code runs (avoid throwing up 'NaN' errors);
        remainingTimeValue = isNaN(remainingTime);
        currentPercentValue = isNaN(currentPercent);
        remainingPercentValue = isNaN(remainingPercent);

        solveCalculations = setInterval(function(){ solvingCalulations() }, 50);

    function solvingCalulations() {
      console.log('testing')
      console.log('remainingTimeValue = ' + remainingTimeValue);
      console.log('currentPercentValue = ' + currentPercentValue);
      console.log('remainingPercentValue = ' + remainingPercentValue);
      if (remainingTimeValue == false && currentPercentValue == false && remainingPercentValue == false) {
        console.log('NaN is no longer a problem... play video')
        vid.play();
        clearInterval(solveCalculations);    
      } else {
        console.log('re-initiasing');
        init();
      }
    };


    $( function() {
      var inc = 10;
      $( "#slider-range-max" ).slider({
        range: "max",
        min: 0,
        max: vidEnd * inc,
        value: 0,
        slide: function( event, ui ) {
          vid.pause();
          clearInterval( progressInterval );

          $( "#box" ).val( ui.value * inc);
          console.log(ui.value / inc);
          vid.currentTime = ui.value / inc.toFixed(0);

          // var currentPercent = ((vid.currentTime / vidEnd) * 100).toFixed(0);
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
        },          
      });
    });

    $( "#slider-range-max" ).on( "slidestop", function( event, ui ) {
      console.log('stop')
      if (paused == false) {
        progressInterval;
        vid.play(vid.currentTime);
        progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
      } else {
        vid.pause();
      }
    });

    function percentToPixel(_elem, _perc){
      return ( $('.ui-slider-range') .outerWidth()/100)* parseFloat(_perc);
    }

    function updateProgress() {
      var currentTime = vid.currentTime.toFixed(0);
      var remainingTime = (vidEnd.toFixed(0) - vid.currentTime.toFixed(0));
      var currentPercent = ((vid.currentTime / vidEnd) * 100).toFixed(0);
      var remainingPercent =  (100 - currentPercent).toFixed(0);

      console.log('currentTime = ' + currentTime );
      console.log('currentPercent = ' + currentPercent );

      $( "#currentTimeBox" ).text( 'Current Time = ' + currentTime + ' seconds' );
      $( "#timeLeftBox" ).text( 'Time Remaining = ' + remainingTime + ' seconds' );
      $( "#currentPercentBox" ).text( 'Percent Complete = ' + currentPercent + ' %' );
      $( "#percentLeftBox" ).text( 'Percent Remaining = ' + remainingPercent + ' %' );

      $( '.ui-slider-handle' ).css({left: currentPercent + '%', position:'absolute'});
      $( '.ui-slider-range' ).css({right: 0 + '%', width:100-currentPercent + '%', position:'absolute'});

      if (currentPercent == 100 ) {
        console.log( 'progress complete' );
        clearInterval( progressInterval );
      }
    };

    $( 'button' ).click (function() {
      console.log('///////////////// button clicked /////////////////');
      if (paused == false) {
        vid.pause();
        document.getElementById('playPauseBtn').innerHTML = 'Play';
        clearInterval( progressInterval );
        paused = true;  
      } else {
        vid.play();
        document.getElementById('playPauseBtn').innerHTML = 'Pause';
        progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
        paused = false;
      }
    });

    vid.addEventListener('ended', displayReplayIcon);

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
      progressInterval = setInterval(function(){ updateProgress() }, trackProgressTime);
      $("#replayBtn").fadeOut(500);
    });

    if (vid.currentTime != vid.duration) {
      $("#replayBtn").fadeOut();
      console.log('button disappears');
    };
  };

  init();

});






