var EXIF=function(){function e(e){return!!e.exifdata}function t(e,t){BinaryAjax(e.src,function(o){var n=r(o.binaryResponse);e.exifdata=n||{},t&&t.call(e)})}function r(e){if(255!=e.getByteAt(0)||216!=e.getByteAt(1))return!1;for(var t,r=2,o=e.getLength();o>r;){if(255!=e.getByteAt(r))return c&&console.log("Not a valid marker at offset "+r+", found: "+e.getByteAt(r)),!1;if(t=e.getByteAt(r+1),22400==t)return c&&console.log("Found 0xFFE1 marker"),i(e,r+4,e.getShortAt(r+2,!0)-2);if(225==t)return c&&console.log("Found 0xFFE1 marker"),i(e,r+4,e.getShortAt(r+2,!0)-2);r+=2+e.getShortAt(r+2,!0)}}function o(e,t,r,o,i){var a,s,u,l=e.getShortAt(r,i),d={};for(u=0;l>u;u++)a=r+12*u+2,s=o[e.getShortAt(a,i)],!s&&c&&console.log("Unknown tag: "+e.getShortAt(a,i)),d[s]=n(e,a,t,r,i);return d}function n(e,t,r,o,n){var i,a,s,u,l,d,c=e.getShortAt(t+2,n),g=e.getLongAt(t+4,n),S=e.getLongAt(t+8,n)+r;switch(c){case 1:case 7:if(1==g)return e.getByteAt(t+8,n);for(i=g>4?S:t+8,a=[],u=0;g>u;u++)a[u]=e.getByteAt(i+u);return a;case 2:return i=g>4?S:t+8,e.getStringAt(i,g-1);case 3:if(1==g)return e.getShortAt(t+8,n);for(i=g>2?S:t+8,a=[],u=0;g>u;u++)a[u]=e.getShortAt(i+2*u,n);return a;case 4:if(1==g)return e.getLongAt(t+8,n);a=[];for(var u=0;g>u;u++)a[u]=e.getLongAt(S+4*u,n);return a;case 5:if(1==g)return l=e.getLongAt(S,n),d=e.getLongAt(S+4,n),s=new Number(l/d),s.numerator=l,s.denominator=d,s;for(a=[],u=0;g>u;u++)l=e.getLongAt(S+8*u,n),d=e.getLongAt(S+4+8*u,n),a[u]=new Number(l/d),a[u].numerator=l,a[u].denominator=d;return a;case 9:if(1==g)return e.getSLongAt(t+8,n);for(a=[],u=0;g>u;u++)a[u]=e.getSLongAt(S+4*u,n);return a;case 10:if(1==g)return e.getSLongAt(S,n)/e.getSLongAt(S+4,n);for(a=[],u=0;g>u;u++)a[u]=e.getSLongAt(S+8*u,n)/e.getSLongAt(S+4+8*u,n);return a}}function i(e,t){if("Exif"!=e.getStringAt(t,4))return c&&console.log("Not valid EXIF data! "+e.getStringAt(t,4)),!1;var r,n,i,a,s,u=t+6;if(18761==e.getShortAt(u))r=!1;else{if(19789!=e.getShortAt(u))return c&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;r=!0}if(42!=e.getShortAt(u+2,r))return c&&console.log("Not valid TIFF data! (no 0x002A)"),!1;if(8!=e.getLongAt(u+4,r))return c&&console.log("Not valid TIFF data! (First offset not 8)",e.getShortAt(u+4,r)),!1;if(n=o(e,u,u+8,S,r),n.ExifIFDPointer){a=o(e,u,u+n.ExifIFDPointer,g,r);for(i in a){switch(i){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":a[i]=h[i][a[i]];break;case"ExifVersion":case"FlashpixVersion":a[i]=String.fromCharCode(a[i][0],a[i][1],a[i][2],a[i][3]);break;case"ComponentsConfiguration":a[i]=h.Components[a[i][0]]+h.Components[a[i][1]]+h.Components[a[i][2]]+h.Components[a[i][3]]}n[i]=a[i]}}if(n.GPSInfoIFDPointer){s=o(e,u,u+n.GPSInfoIFDPointer,f,r);for(i in s){switch(i){case"GPSVersionID":s[i]=s[i][0]+"."+s[i][1]+"."+s[i][2]+"."+s[i][3]}n[i]=s[i]}}return n}function a(r,o){return r.complete?(e(r)?o&&o.call(r):t(r,o),!0):!1}function s(t,r){return e(t)?t.exifdata[r]:void 0}function u(t){if(!e(t))return{};var r,o=t.exifdata,n={};for(r in o)o.hasOwnProperty(r)&&(n[r]=o[r]);return n}function l(t){if(!e(t))return"";var r,o=t.exifdata,n="";for(r in o)o.hasOwnProperty(r)&&(n+="object"==typeof o[r]?o[r]instanceof Number?r+" : "+o[r]+" ["+o[r].numerator+"/"+o[r].denominator+"]\r\n":r+" : ["+o[r].length+" values]\r\n":r+" : "+o[r]+"\r\n");return n}function d(e){return r(e)}var c=!1,g={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},S={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},f={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},h={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}};return{readFromBinaryFile:d,pretty:l,getTag:s,getAllTags:u,getData:a,Tags:g,TiffTags:S,GPSTags:f,StringValues:h}}();