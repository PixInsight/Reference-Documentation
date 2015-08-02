/*
 * Returns a random sample of size n from a standard normal distribution.
 *
 * Generates n random normal deviates using the Marsaglia polar method:
 *    http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 *    http://en.wikipedia.org/wiki/Marsaglia_polar_method
 */
function normalSample( n )
{
   var g = new Vector( n );
   for ( var i = 0; i < n; ++i )
   {
      var s, u, v; // I love SUVs :)
      do
      {
         u = 2*Math.random() - 1;
         v = 2*Math.random() - 1;
         s = u*u + v*v;
      }
      while ( s >= 1 || s == 0 );
      s = Math.sqrt( -2*Math.ln( s )/s );
      g.at( i, u*s );
      if ( ++i < n )
         g.at( i, v*s );
   }
   return g;
}

/*
 * Bootstrap estimation
 */

#define sampleSize      2000
#define numberOfSamples 2000
#define numberOfTests   1000

console.show();
console.writeln( "<end><cbr>Performing bootstrap, please wait..." );

var sigma_a = new Vector( numberOfTests );
var sigma_m = new Vector( numberOfTests );
for ( var j = 0; j < numberOfTests; ++j )
{
   var a = new Vector( numberOfSamples );
   var m = new Vector( numberOfSamples );
   for ( var i = 0; i < numberOfSamples; ++i )
   {
     var x = normalSample( sampleSize );
     a.at( i, x.mean() );
     m.at( i, x.median() );
   }
   sigma_a.at( j, a.stdDev() );
   sigma_m.at( j, m.stdDev() );
}

var aa = sigma_a.mean();
var ma = sigma_m.mean();
console.writeln( format( "<end><cbr>Stddev of the mean ......... %.6f", aa ) );
console.writeln( format(           "Stddev of the median ....... %.6f", ma ) );
console.writeln( format(           "Median/mean stddev ratio ... %.3f", ma/aa ) );
/*
Result:
Stddev of the mean ......... 0.022350
Stddev of the median ....... 0.028001
Median/mean stddev ratio ... 1.253
*/
