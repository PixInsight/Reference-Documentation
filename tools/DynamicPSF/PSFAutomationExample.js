/*
 * An example script to demonstrate automation of the DynamicPSF process.
 */

// Identifier of the working process icon.
#define ICON_ID   Process01

// Indexes of the columns in the 'psf' table of DynamicPSF.
#define PSF_starIndex   0
#define PSF_function    1
#define PSF_circular    2
#define PSF_status      3
#define PSF_B           4
#define PSF_A           5
#define PSF_cx          6
#define PSF_cy          7
#define PSF_sx          8
#define PSF_sy          9
#define PSF_theta      10
#define PSF_beta       11
#define PSF_mad        12

// FWHM of a Gaussian function
function FWHM( sigma )
{
   return 2.35482*sigma;
}

// We'll work with the active image window. Make sure we have one.
if ( ImageWindow.activeWindow.isNull )
   throw new Error( "There is no active image window." );

// Get the instance transported by the specified icon.
// *** Requires PixInsight Core >= 1.7.3
var instance = ProcessInstance.fromIcon( #ICON_ID );

// Make sure the icon exists and it is a process icon.
if ( instance == null )
   throw new Error( "No such process icon: \'" + #ICON_ID + "\'" );

// Make sure the icon transports a DynamicPSF instance.
if ( !instance instanceof DynamicPSF )
   throw new Error( "The \'" + #ICON_ID + "\' " +
                    "icon does not transport an instance of the DynamicPSF process." );

// Disable the automatic PSF model function feature.
instance.autoPSF = false;

// We want to fit circular PSF model functions.
instance.circularPSF = true;

// We only want to fit Gaussian PSF model functions.
instance.gaussianPSF = true;
instance.moffatPSF =
instance.moffat10PSF =
instance.moffat8PSF =
instance.moffat6PSF =
instance.moffat4PSF =
instance.moffat25PSF =
instance.moffat15PSF =
instance.lorentzianPSF = false;

// Enable regeneration of all PSF fits. This will force the DynamicPSF instance
// to re-search all stars before fitting new PSF model functions. If this
// parameter is set to false, PSF fits will be recalculated at their original
// coordinates, which can be faster but less accurate.
instance.regenerate = true;

// Force the instance to work on the active image. We assume this instance has
// a single PSF collection.
instance.views[0] = ImageWindow.activeWindow.mainView.id;

// Execute the instance in the global context.
if ( !instance.executeGlobal() )
   throw new Error( "Couldn't execute DynamicPSF in the global context." );

// Get the minimum MAD value for normalization.
var minMAD = 1;
for ( var i = 0; i < instance.psf.length; ++i )
   if ( instance.psf[i][PSF_status] == DynamicPSF.prototype.PSF_FittedOk )
      if ( instance.psf[i][PSF_mad] < minMAD )
         minMAD = instance.psf[i][PSF_mad];
if ( minMAD == 1 )
   throw new Error( "No valid PSF fit could be performed." );

console.show();

// List all valid PSF fits and compute a weighted average FWHM.
var count = 0;
var avgSigma = 0;
var sumWeight = 0;
console.writeln( "PSF#   FWHM      MAD     weight" );
console.writeln( "====  ======  =========  ======" );
for ( var i = 0; i < instance.psf.length; ++i )
{
   var psf = instance.psf[i];
   if ( psf[PSF_status] == DynamicPSF.prototype.PSF_FittedOk )
   {
      var weight = minMAD/psf[PSF_mad];
      console.writeln( format( "%4u  %6.2f  %.3e  %6.4f",
                               i, FWHM( psf[PSF_sx] ), psf[PSF_mad], weight ) );
      ++count;
      avgSigma += psf[PSF_sx]*weight;
      sumWeight += weight;
   }
}
avgSigma /= sumWeight;
console.writeln( "" );
console.writeln( format( "Total fitted stars ...... %u", count ) );
console.writeln( format( "Weighted average FWHM ... %.2f px", FWHM( avgSigma ) ) );
