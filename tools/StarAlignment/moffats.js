#include <pjsr/UndoFlag.jsh>

#define IMAGE_SIZE   101

function filterToImage( filter, id )
{
   var w = new ImageWindow( IMAGE_SIZE, IMAGE_SIZE );
   var v = w.mainView;
   v.beginProcess( UndoFlag_NoSwapFile );
   v.image.fill( 0.005 );
   v.image.selectedPoint = new Point( (IMAGE_SIZE - filter.cols) >> 1,
                                      (IMAGE_SIZE - filter.rows) >> 1 );
   v.image.apply( filter.toImage() );
   v.id = id;
   v.endProcess();
   w.show();
   w.zoomToFit();
}

#define SCALE 28

filterToImage( Matrix.moffatFilterBySize( Math.round( 3.22*SCALE )|1, 2.83, 0.01, 0.902 ), "Moffat_L3" );
filterToImage( Matrix.moffatFilterBySize( Math.round( 3.23*SCALE )|1, 2.73, 0.01, 0.902 ), "Moffat_L4" );
filterToImage( Matrix.moffatFilterBySize( Math.round( 3.23*SCALE )|1, 2.67, 0.01, 0.903 ), "Moffat_L5" );
filterToImage( Matrix.moffatFilterBySize( Math.round( 3.31*SCALE )|1, 2.86, 0.01, 0.900 ), "Moffat_NN" );
filterToImage( Matrix.moffatFilterBySize( Math.round( 3.29*SCALE )|1, 3.00, 0.01, 0.905 ), "Moffat_BS" );
filterToImage( Matrix.moffatFilterBySize( Math.round( 3.42*SCALE )|1, 3.06, 0.01, 0.913 ), "Moffat_BL" );
