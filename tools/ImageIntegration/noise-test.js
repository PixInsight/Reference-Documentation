/*
 * An Image Integration Experiment
 */

#include <pjsr/ImageOp.jsh>
#include <pjsr/UndoFlag.jsh>

// N.B. Change to the actual file path of the test bitmap.
#define BITMAP_FILE_PATH   "/path/to/original/image.png"

// N.B. Change to the actual directory where output files will be written.
#define OUTPUT_DIR         "/path/to/output/directory"

#define NUMBER_OF_IMAGES   1024

var bmp = new Bitmap( BITMAP_FILE_PATH );

var noiseGenerator = new NoiseGenerator;
noiseGenerator.amount = 1.00;
//noiseGenerator.distribution = NoiseGenerator.prototype.Normal;
noiseGenerator.distribution = NoiseGenerator.prototype.Uniform;
noiseGenerator.preserveBrightness = NoiseGenerator.prototype.None;

var noise = new ImageWindow( bmp.width, bmp.height, 1, 32, true, false );

var sum = new Image( bmp.width, bmp.height );
sum.fill( 0 );

for ( var n0 = 0, n = 1; n <= NUMBER_OF_IMAGES; n0 = n, n *= 2 )
{
   for ( var i = n0; i < n; ++i )
   {
      noiseGenerator.executeOn( noise.mainView, false/*swapFile*/ );
      var noisyImage = new Image( bmp.width, bmp.height );
      noisyImage.blend( bmp );
      noisyImage.apply( noise.mainView.image, ImageOp_Add );
      sum.apply( noisyImage, ImageOp_Add );
      noisyImage.free();
   }

   var id = format( "integration_of_%d", n );
   var window = new ImageWindow( sum.width, sum.height, 1, 32, true, false, id );
   var view = window.mainView;
   view.beginProcess( UndoFlag_NoSwapFile );
   view.image.apply( sum, ImageOp_Mov );
   view.image.rescale();
   view.endProcess();
   window.show();
   window.zoomToFit();
   view.image.render().save( OUTPUT_DIR + "/" + id + ".png" );
}

noise.forceClose();
