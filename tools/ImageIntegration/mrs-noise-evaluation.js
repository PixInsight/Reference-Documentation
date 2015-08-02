/*
 * Estimation of the standard deviation of the noise, assuming a Gaussian
 * noise distribution.
 *
 * - Use MRS noise evaluation when the algorithm converges for 4 >= J >= 2
 *
 * - Use k-sigma noise evaluation when either MRS doesn't converge or the
 *   length of the noise pixels set is below a 1% of the image area.
 *
 * - Automatically iterate to find the highest layer where noise can be
 *   successfully evaluated, in the [1,3] range.
 */
function NoiseEvaluation( img )
{
   var a, n = 4, m = 0.01*img.selectedRect.area;
   for ( ;; )
   {
      a = img.noiseMRS( n );
      if ( a[1] >= m )
         break;
      if ( --n == 1 )
      {
         console.writeln( "<end><cbr>** Warning: No convergence in MRS noise evaluation routine" +
                          " - using k-sigma noise estimate." );
         a = img.noiseKSigma();
         break;
      }
   }
   this.sigma = a[0]; // estimated stddev of Gaussian noise
   this.count = a[1]; // number of pixels in the noise pixels set
   this.layers = n;   // number of layers used for noise evaluation
}

function main()
{
   // Get access to the current active image window.
   var window = ImageWindow.activeWindow;
   if ( window.isNull )
      throw new Error( "No active image" );

   console.show();
   console.writeln( "<end><cbr><br><b>" + window.currentView.fullId + "</b>" );
   console.writeln( "Calculating noise standard deviation..." );
   console.flush();

   console.abortEnabled = true;

   // Compute noise estimates for the active view.
   var img = window.currentView.image;
   for ( var c = 0; c < img.numberOfChannels; ++c )
   {
      console.writeln( "<end><cbr><br>* Channel #", c );
      console.flush();
      img.selectedChannel = c;
      var E = new NoiseEvaluation( img );
      console.writeln( format( "sigma%c = %.3e, N = %u (%.2f%%), J = %d",
                               img.isColor ? "RGB"[c] : 'K',
                               E.sigma, E.count, 100*E.count/img.selectedRect.area, E.layers ) );
      console.flush();
   }
}

main();
