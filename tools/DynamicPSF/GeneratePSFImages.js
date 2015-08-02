#include <pjsr/UndoFlag.jsh>

function filterToImage( filter, id )
{
   var w = new ImageWindow( 1, 1 );
   var v = w.mainView;
   v.beginProcess( UndoFlag_NoSwapFile );
   v.image.assign( filter.toImage() );
   v.id = id;
   v.endProcess();
   w.show();
   w.zoomToFit();
}

#define FILTER_SIZE  101

filterToImage( Matrix.gaussianFilterBySize( FILTER_SIZE ), "Gaussian" );
filterToImage( Matrix.moffatFilterBySize( FILTER_SIZE, 1.5 ), "Moffat_15" );
filterToImage( Matrix.moffatFilterBySize( FILTER_SIZE, 4.0 ), "Moffat_40" );
filterToImage( Matrix.gaussianFilterBySize( FILTER_SIZE, 0.01,
                                            0.5, Math.rad( 45 ) ), "GaussianRotated" );
