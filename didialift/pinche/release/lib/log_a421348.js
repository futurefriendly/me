
(function ($) {
    if( navigator.platform.match(/^(Win|Mac)/) ){
        return;
    }
    $.isArray = Array.isArray ||
      function(object){ return object instanceof Array };
    $.isEmptyObject = function( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    }
    //创建元素并给予初始化样式
    var createEL = function(style, tagNmae, childHTML) {
        var $el = document.createElement(tagNmae || 'DIV');
        $el.style.cssText = style.join(';');
        $el.innerHTML = childHTML || '';
        return $el;
    }
    // Make sure that there is a console object.
    //   Almost certainly not needed, but I'll leave it in anyway.
    if (!console) console = {};
    
    // Make sure that this function is stopped if it has been run 
    //   multiple times.
    if (console.overlay_check) {
        return;
    }
    console.overlay_check = true;

    // Keep track of the old log function so that it can be called as well.
    //   This comes in handy if you don't want to comment out this file every
    //   time you switch to a desktop browser if you are switching back and forth.
    if (!console.log) console.log = function () {};
    if (!console.trace) console.trace = function () {};
    old_console_log = console.log;
    old_console_trace = console.trace;


    // Create an element that sits as an overlay on top of the page
    //   to hold the developer console output.


    var $output_container = createEL([
        'position: fixed',
        'top: 60px',
        'bottom: 20px',
        'right: 30px',
        'left: 30px',
        'padding: 10px',
        'overflow: auto',
        '-webkit-overflow-scrolling: touch',
        'color: #FAFAFA',
        'background-color: #444',
        'opacity: 0.9',
        'z-index: 1000000',
        'line-height: 22px',
        'font-size: 1.2rem'

    ]);
    var style;
    var output_container_opaque = true;
    // If you click on the overlay, the opacity is toggled.
    $output_container.addEventListener('click', function (e) {
        if (output_container_opaque) {
            output_container_opaque = false;
            this.style.opacity = '0.65'
        } else {
            output_container_opaque = true;
            this.style.opacity = '1'
        }
    }, false);

    // Create a button in the top right corner that toggles the display of the overlay.

    var $output_container_minimizer = createEL([
        'position:fixed',
        'top: 60px',
        'height: 25px',
        'line-height: 23px',
        'left: ' + (innerWidth - 30) + 'px',
        'width: 25px',
        'text-align: center',
        'color: #FAFAFA',
        'background-color: #444',
        'opacity: 1',
        'z-index: 1000001',
        'border-radius: 100%',
        'font-size: 1.2rem'
    ]);
    var onDragMinimizer = function(e){
        var type = e.type;
        var target = e.target.tagName ? e.target : e.target.parentNode;
        switch(type){
            case 'touchstart':
                onDragMinimizer.startX = e.touches[0].pageX; 
                onDragMinimizer.startY = e.touches[0].pageY; 
                onDragMinimizer.left = parseInt(target.style.left);
                onDragMinimizer.top = parseInt(target.style.top);
            break;
            case 'touchmove':
                var x = onDragMinimizer.left + (e.touches[0].pageX - onDragMinimizer.startX) ;
                var y = onDragMinimizer.top + (e.touches[0].pageY - onDragMinimizer.startY) ;
                x = Math.min(innerWidth - 25, x);
                x = Math.max(x,0);
                y = Math.min(innerHeight - 25, y);
                y = Math.max(0, y);
                target.style.left = x + 'px';
                target.style.top = y +'px';
                e.stopPropagation();
                e.preventDefault();
            break;
            case 'touchend':
            break;
        }
    }
    $output_container_minimizer.addEventListener('touchstart', onDragMinimizer);
    $output_container_minimizer.addEventListener('touchmove', onDragMinimizer);
    $output_container_minimizer.addEventListener('touchend', onDragMinimizer);

    var output_container_hidden = false;
    $output_container_minimizer.addEventListener('touchstart', function () {
        if (output_container_hidden) {
            output_container_hidden = false;
            $output_container_minimizer.style.opacity= '1'
            $output_container_minimizer.innerHTML = "—";
            $output_container.style.display = 'block';
        } else {
            output_container_hidden = true;

            $output_container_minimizer.style.opacity= '0.65'
            $output_container_minimizer.innerHTML = "+";
            $output_container.style.display = 'none';
        }
    }, false);


    // var $zoom_detector = $('<div/>').css('position', 'fixed').css('right', '0px').css('left', '0px');
    var $zoom_detector =  createEL([
        'position: fixed',
        'right: 0px',
        'left: 0px'
    ]);



    // Here is the core of this file.  The function processOutput is called 
    //   recursively to put together the text to put into the console.
    //   There are a handful of helper functions as well.
    var default_max_depth = 1;
    var depth_tracker = 0;
    var current_stack = [];
    var $div_for_escaping_html = document.createElement('DIV');
    var default_error_message = '-----ERROR-----';
    var string_crop_length = 120;
    var key_color = 'rgb(253, 251, 240)';
    var string_color = '#fff';
    var boolean_color = '#ccc';
    var function_color = '#bfb';
    var number_color = '#bbf';
    var object_color = '#bff';
    var bracket_color = object_color;

    var stringifyAndCrop = function (contents, length) {
        if ($.isArray(contents)) {
            return '[object Array] (' + contents.length + ')';
        }
        var stringified_output = String(contents);
        var contents_cut_off = false;
        if (length) {
            stringified_output = stringified_output.substr(0, length);
            if (stringified_output.length === length) contents_cut_off = true;
        }
        stringified_output = $div_for_escaping_html.innerHTML = stringified_output;
        if (contents_cut_off) stringified_output += '...(Click)';
        return stringified_output;
    };
    var addCapacityToExpandOnClick = function ($element, contents) {
        $element.addEventListener('click', function (e) {
            e.stopPropagation();
            if ($element.text_expanded) {
                $element.innerHTML = (stringifyAndCrop(contents, string_crop_length));
                $element.text_expanded = false;
            } else {
                $element.innerHTML = (stringifyAndCrop(contents, false));
                $element.text_expanded = true;
            }
        }, false);
    };
    var addCapacityToExpandObjectOnClick = function ($element, contents) {
        $element.addEventListener('click', function (e) {
            e.stopPropagation();
            if ($element.$expandable_contents) {
                // Completely remove the contents so that they will be refreshed if
                //   the user closes the object and reopens it later.
                $element.$expandable_contents.parentNode.removeChild($element.$expandable_contents);
                delete $element.$expandable_contents;
            } else {
                $element.$expandable_contents = document.createElement('DIV');
                var processOutputNode = processOutput(contents);
                if( !$.isArray(processOutputNode) ){
                    processOutputNode = [processOutputNode];
                }
                processOutputNode.forEach(function(val){
                    $element.$expandable_contents.appendChild(val);
                });
                var $parentNode = $element.parentNode;
                // $element.after($element.$expandable_contents);
                $element.nextElementSibling
                   ? $parentNode.insertBefore($element.$expandable_contents, $element.nextElementSibling)
                   : $parentNode.appendChild($element.$expandable_contents);
            }
        }, false);
    };
    var createColorfulSpan = function (output_object) {
        // var $retval = $('<span style="white-space:pre-wrap"></span>');
        var $retval = document.createElement('SPAN');
        var color = '#fff';
        var newline_re = /\n/g;
        if (output_object === null) {
            $retval.innerHTML = ('null');
            color = boolean_color;
        } else if (output_object === undefined) {
            $retval.innerHTML=('undefined');
            color = boolean_color;
        } else if (output_object === true) {
            $retval.innerHTML = ('true');
            color = boolean_color;
        } else if (output_object === false) {
            $retval.innerHTML=('false');
            color = boolean_color;
        } else if (typeof output_object === 'function') {
            $retval.innerHTML =(stringifyAndCrop(output_object, string_crop_length));
            addCapacityToExpandOnClick($retval, output_object);
            color = function_color;
        } else if (typeof output_object === 'number') {
            $retval.innerHTML = (stringifyAndCrop(output_object, string_crop_length));
            addCapacityToExpandOnClick($retval, output_object);
            color = number_color;
        } else if (typeof output_object === 'string') {
            $retval.innerHTML = (stringifyAndCrop(output_object, string_crop_length));
            addCapacityToExpandOnClick($retval, output_object);
            if (output_object === default_error_message) {
                color = '#f33';
            } else {
                color = string_color;
            }
        } else if (typeof output_object === 'object') {
            if ($.isArray(output_object) && output_object.length == 0) {
                $retval.innerHTML = ('[]');
            } else if ($.isEmptyObject(output_object)) {
                $retval.innerHTML = ('{}');
            } else {
                $retval.innerHTML = (stringifyAndCrop(output_object, string_crop_length)); // Potential for improvement.
                addCapacityToExpandObjectOnClick($retval, output_object);
            }
            color = object_color;
        } else {
            $retval.innerHTML = (stringifyAndCrop(output_object, string_crop_length));
            addCapacityToExpandOnClick($retval, output_object);
        }
        $retval.style.color = color;
        $retval = [$retval, createEL([], 'BR') ];
        return $retval;
    };
    var processOutput = function (output_object, max_depth) {
        if (!max_depth && max_depth !== 0) max_depth = default_max_depth;
        if (depth_tracker >= max_depth) {
            return createColorfulSpan(output_object);
        }

        if (output_object && typeof output_object === 'object') {
            var object_endings = '{}';
            if ($.isArray(output_object)) {
                object_endings = '[]';
            }
            var $retval = createEL([
                    'color: '+ bracket_color,
                ], 'DIV', object_endings[0] + '<br>');

            // var $retval = $('<div>' + object_endings[0] + '<br></div>').css('color',bracket_color);
            if (depth_tracker || max_depth) {
                // $retval.css('padding-left','10px');
                $retval.style.paddingLeft = '10px';
            }
            // var $retval_inner = $('<div/>').css('padding-left','10px').css('color',key_color);
            var $retval_inner = createEL([
                    'padding-left:10px',
                    'color: '+ key_color
                ]);
            $retval.appendChild($retval_inner);
            var property_count = 0;
            for (var key in output_object) {
                // Comment or uncomment the following 4 lines as desired.
                // if (!output_object.hasOwnProperty(key)) continue;
                if (property_count > 1000) {
                     break;
                }
                property_count += 1;

                var value = output_object[key];
                var textNode = document.createTextNode(key + ' : ');
                $retval_inner.appendChild(textNode);
                if ( current_stack.indexOf(value) > -1) {
                    $retval_inner.appendChild(createColorfulSpan(value));
                    continue;
                } else {
                    current_stack.push(value);
                    depth_tracker += 1;
                    var processOutputNode = processOutput(value);
                    if( !$.isArray(processOutputNode) ){
                        processOutputNode = [processOutputNode];
                    }
                    processOutputNode.forEach(function(val){
                        $retval_inner.appendChild(val);
                    });
                    depth_tracker -= 1;
                    current_stack.pop();
                }
            }
            if (property_count) {
                var tn = document.createTextNode(object_endings[1]);
                $retval.appendChild(tn);
                return $retval
            } else {
                return [ document.createTextNode(object_endings) , createEL([],'br')];
            }
        } else {
            return createColorfulSpan(output_object);
        }

    };


    // Overwrite console.log so that it sends the output to the overlay.
    var init = false;
    $output_container.style.display = 'none';
    console.log = function () {
        if(init == false){
            init = true;
            $output_container.style.display = 'block'; 
        }
        old_console_log.apply(console, arguments);
        var output = processOutput(arguments[0], 0);
        if( !$.isArray(output) ){
            output = [output];
        }
        output.forEach(function(val){
            $output_container.appendChild(val);
        });
    };

    var getTraceData = function () {
        try {
            throw new Error();
        } catch (ex) {
            var stack = ex.stack;
            var edited_stack = [];
            var re = /console-log-phone.js/i;
            if (stack && stack.split) {
                stack = stack.split('\n');
                for (var i = 0; i < stack.length; i++) {
                    if (!re.test(stack[i]) && stack[i] !== 'Error') {
                        edited_stack.push(stack[i].replace(/^[ \t]*(at)?[ \t]*/, ''));
                    }
                }
            }
            return edited_stack;
        }
    };

    console.trace = function trace() {
        old_console_trace.apply(console, arguments);
        var trace_data = getTraceData();
        var processOutputNode = processOutput('Trace:', 0);
        if( !$.isArray(processOutputNode) ){
            processOutputNode = [processOutputNode];
        }
        processOutputNode.forEach(function(val){
            $output_container.appendChild(val);
        });
        processOutputNode = processOutput(trace_data, 1);
        if( !$.isArray(processOutputNode) ){
            processOutputNode = [processOutputNode];
        }
        processOutputNode.forEach(function(val){
            $output_container.appendChild(val);
        });
    };

    // Catch errors and send them to the new console.log.
    window.onerror = function (errorMsg, url, lineNumber) {
        console.log(default_error_message);
        console.log(errorMsg);
        console.log(url);
        console.log('    Line ' + lineNumber);
    };



    // The console is too large and has tiny text when the phone browser uses a larger 
    //   viewport than the css pixel width of the device.
    var currently_recalculating_zoom = false;
    var recalculateZoom = function () {
        currently_recalculating_zoom = false;
        var zoom_to_undo = 1;
        if (window.matchMedia) {
            var common_device_dimensions = [
                240, 320, 360, 375, 384, 412, 414, 427, 480, 533, 568, 600, 604, 
                640, 667, 690, 720, 736, 768, 800, 960, 966, 1024, 1280, 1366
            ];

            for (var i in common_device_dimensions) {
                var device_width = common_device_dimensions[i];
                // This will not work on all devices, and it will probably act funny if you open the keyboard
                //   because matchMedia orientation is not just the orientation of the phone.
                if (window.matchMedia('(orientation: portrait) and (max-device-width: ' + device_width + 'px)').matches ||
                        window.matchMedia('(orientation: landscape) and (max-device-height: ' + device_width + 'px)').matches) {
                    var width = $zoom_detector.offsetWidth;
                    if (width && device_width) {
                        var current_zoom = device_width / width;
                        // if (current_zoom > 1) {
                        //     current_zoom = 1;
                        // }
                        zoom_to_undo = current_zoom;
                    }
                    break;
                }
            }
        } // Maybe add other techniques for calculating zoom here.
        // var font_size = Math.round((1 / Math.sqrt(zoom_to_undo)) * 100);
        var font_size = Math.round((2 / (1+zoom_to_undo)) * 100);
        if (font_size > 200) { font_size = 200; }
        var output_container_css = [
            ['top', 60/zoom_to_undo + 'px'],
            ['bottom', 20/zoom_to_undo + 'px'],
            ['right', 30/zoom_to_undo + 'px'] ,
            ['left', 30/zoom_to_undo + 'px'],
            ['font-size', font_size + '%'],
            ['font-size', font_size + '%'],
        ]
        output_container_css.forEach(function(val, key){
            $output_container[val[0]] = val[1];
        });
        var output_container_minimizer_css = [
            ['top', 60/zoom_to_undo + 'px'],
            ['height', 25/zoom_to_undo + 'px'],
            ['right', 30/zoom_to_undo + 'px'],
            ['width', 25/zoom_to_undo + 'px'],
            ['font-size', font_size + '%']
        ]
        output_container_minimizer_css.forEach(function(val,key){
            $output_container_minimizer[val[0]] = val[1];
        });
    }
    window.addEventListener('touchend', function () {
        setTimeout(function () {
            if (!currently_recalculating_zoom) {
                currently_recalculating_zoom = true;
                recalculateZoom();
            }
        }, 40);
    }, false);
    window.addEventListener('resize',function () {
        // This works better if it is called after everything else is on the screen.
        setTimeout(function () {
            if (!currently_recalculating_zoom) {
                currently_recalculating_zoom = true;
                recalculateZoom();
            }
        }, 100);
    }, false);

    // And finally add the new console to the DOM when the window loads.
    document.addEventListener('DOMContentLoaded',function () {
        // This works better if it is called after everything else is on the screen.
        setTimeout(function () {
            document.body.appendChild($zoom_detector);
            recalculateZoom();
            document.body.appendChild($output_container);
            document.body.appendChild($output_container_minimizer);
        }, 0);
    }, false);
    
})({});