!function(t){function e(t,e){this.file=t,this.options=r.extend({},n,e),this._defaults=n,this._name=a,this.init()}var a="canvasResize",r={newsize:function(t,e,a,r,n){var i=n?"h":"";if(a&&t>a||r&&e>r){var o=t/e;(o>=1||0===r)&&a&&!n?(t=a,e=a/o>>0):n&&a/r>=o?(t=a,e=a/o>>0,i="w"):(t=r*o>>0,e=r)}return{width:t,height:e,cropped:i}},dataURLtoBlob:function(t){for(var e=t.split(",")[0].split(":")[1].split(";")[0],a=atob(t.split(",")[1]),r=new ArrayBuffer(a.length),n=new Uint8Array(r),i=0;i<a.length;i++)n[i]=a.charCodeAt(i);var o=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder;return o?(o=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder),o.append(r),o.getBlob(e)):o=new Blob([r],{type:e})},detectSubsampling:function(t){var e=t.width,a=t.height;if(e*a>1048576){var r=document.createElement("canvas");r.width=r.height=1;var n=r.getContext("2d");return n.drawImage(t,-e+1,0),0===n.getImageData(0,0,1,1).data[3]}return!1},rotate:function(t,e){var a={1:{90:6,180:3,270:8},2:{90:7,180:4,270:5},3:{90:8,180:1,270:6},4:{90:5,180:2,270:7},5:{90:2,180:7,270:4},6:{90:3,180:8,270:1},7:{90:4,180:5,270:2},8:{90:1,180:6,270:3}};return a[t][e]?a[t][e]:t},transformCoordinate:function(t,e,a,r){switch(r){case 5:case 6:case 7:case 8:t.width=a,t.height=e;break;default:t.width=e,t.height=a}var n=t.getContext("2d");switch(r){case 1:break;case 2:n.translate(e,0),n.scale(-1,1);break;case 3:n.translate(e,a),n.rotate(Math.PI);break;case 4:n.translate(0,a),n.scale(1,-1);break;case 5:n.rotate(.5*Math.PI),n.scale(1,-1);break;case 6:n.rotate(.5*Math.PI),n.translate(0,-a);break;case 7:n.rotate(.5*Math.PI),n.translate(e,-a),n.scale(-1,1);break;case 8:n.rotate(-.5*Math.PI),n.translate(-e,0)}},detectVerticalSquash:function(t,e,a){var r=document.createElement("canvas");r.width=1,r.height=a;var n=r.getContext("2d");n.drawImage(t,0,0);for(var i=n.getImageData(0,0,1,a).data,o=0,c=a,h=a;h>o;){var s=i[4*(h-1)+3];0===s?c=h:o=h,h=c+o>>1}var l=h/a;return 0===l?1:l},callback:function(t){return t},extend:function(){var t=arguments[0]||{},e=1,a=arguments.length,n=!1;t.constructor===Boolean&&(n=t,t=arguments[1]||{}),1===a&&(t=this,e=0);for(var i;a>e;e++)if(null!==(i=arguments[e]))for(var o in i)t!==i[o]&&(n&&"object"==typeof i[o]&&t[o]?r.extend(t[o],i[o]):void 0!==i[o]&&(t[o]=i[o]));return t}},n={width:300,height:0,crop:!1,quality:80,rotate:0,callback:r.callback};e.prototype={init:function(){var t=this,e=this.file,a=new FileReader;a.onloadend=function(a){var n=a.target.result,i=atob(n.split(",")[1]),o=new BinaryFile(i,0,i.length),c=EXIF.readFromBinaryFile(o),h=new Image;h.onload=function(){var a=c.Orientation||1;a=r.rotate(a,t.options.rotate);var n=a>=5&&8>=a?r.newsize(h.height,h.width,t.options.width,t.options.height,t.options.crop):r.newsize(h.width,h.height,t.options.width,t.options.height,t.options.crop),i=h.width,o=h.height,s=n.width,l=n.height,d=document.createElement("canvas"),w=d.getContext("2d");w.save(),r.transformCoordinate(d,s,l,a),r.detectSubsampling(h)&&(i/=2,o/=2);var u=1024,g=document.createElement("canvas");g.width=g.height=u;for(var p=g.getContext("2d"),v=r.detectVerticalSquash(h,i,o),f=0;o>f;){for(var m=f+u>o?o-f:u,b=0;i>b;){var B=b+u>i?i-b:u;p.clearRect(0,0,u,u),p.drawImage(h,-b,-f);var I=Math.floor(b*s/i),y=Math.ceil(B*s/i),k=Math.floor(f*l/o/v),x=Math.ceil(m*l/o/v);w.drawImage(g,0,0,B,m,I,k,y,x),b+=u}f+=u}w.restore(),g=p=null;var M=document.createElement("canvas");M.width="h"===n.cropped?l:s,M.height="w"===n.cropped?s:l;var C="h"===n.cropped?.5*(l-s):0,R="w"===n.cropped?.5*(s-l):0;if(newctx=M.getContext("2d"),newctx.drawImage(d,C,R,s,l),console.log(e,e.type),"image/png"===e.type)var z=M.toDataURL(e.type);else var z=M.toDataURL("image/jpeg",.01*t.options.quality);t.options.callback(z,M.width,M.height)},h.src=n},a.readAsDataURL(e)}},t[a]=function(t,a){return"string"==typeof t?r[t](a):void new e(t,a)}}(window);