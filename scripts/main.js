var HidePreviewWindowAnnotations = function () {

$(document).ready(function(){
        $( ".annotation" ).hide();
    });

};

$( document ).ready(function() {
    updateCodeLineNumber('html');
    changeTextareaSize('html');
});

// // >>> Main Variables
var wleft; // preview window current left position
var wtop; // preview window current top position

// >>> Main functions
var loadData = function(frame, html, css, jscript) {

$("#"+frame).prop("contentDocument").close();
}

var resetPanel = function() {
// function that resets the active panel, updating it with the default values
    var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
    activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel
        if (activePanel == "html")
        $("#html-window").val("<body></body>");
        else if (activePanel == "css")
        $("#css-window").val("body {}");
        else if (activePanel == "js")
        $("#js-window").val("$(document).ready(function() {});");
        $('div.code-lines.'+activePanel+'-code').empty(); // empty div.code-lines
        $('<span>1</span>').appendTo('div.code-lines.'+activePanel+'-code'); // put first line number
    loadData('iframe-preview', 'html-window', 'css-window', 'js-window'); // updates the preview result
}

var toggleBackground = function() {
// function that toggles the background of the active panel, black/white
    var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
    activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel
        if ( $('#'+activePanel+'-window').hasClass('black') ) {
        $('#'+activePanel+'-window').removeClass('black');
        $('#'+activePanel+'-window').addClass('white');
        } else {
        $('#'+activePanel+'-window').removeClass('white');
        $('#'+activePanel+'-window').addClass('black');
    }
}
var changeTextareaSize = function(tab_name) {
// function that increases or decreases the textarea according with content size
// Input:
// tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'
var text_buffer = getTextareaBufferData(tab_name+'-window');
var textarea_rows = $('#'+tab_name+'-window').prop('rows');
//checks if the number of code lines is greater than the size of textarea,
// if so, increases that textarea and the line number div
    if (text_buffer['size'] > textarea_rows) {
    $('#'+tab_name+'-window').prop('rows', function(index, value) {
    return value + 1;
    });
    $('div.code-lines.'+tab_name+'-code').height(function() {
    return $('#'+tab_name+'-window').height() + 3;
    });
    $('#tabs-'+tab_name).scrollTop(function(index, value) {
    return value + 15;
    });
    }
    //checks if the number of code lines is greater than the default size of textarea
    // but smaller than the actual textarea size, if so, decreases that textarea and the line number div
    if (text_buffer['size'] > 38 && text_buffer['size'] < textarea_rows) {
    $('#'+tab_name+'-window').prop('rows', function(index, value) {
    return value - 1;
    });
    $('div.code-lines.'+tab_name+'-code').height(function() {
    return $('#'+tab_name+'-window').height() + 3;
    });
    $('#tabs-'+tab_name).scrollTop(function(index, value) {
    return value + 15;
    });
    }
    if (text_buffer['size'] <= 38) // sets scroll bar to top
    $('#tabs-'+tab_name).scrollTop(0);
    }

var getTextareaBufferData = function(id_name) {

    var buffer = {};
    var text_str = '';
    var text_lines = [];
    var size = 0;
    text_str = $('#'+id_name).val(); // takes the textarea content given id
    text_lines = text_str.split('\n'); // create list of text lines
    size = text_lines.length;
    // update buffer
    buffer['size'] = size;
    buffer['content'] = text_lines;
    return buffer;
}

var checkForEmptyLine = function(text_lines, line) {
    return !patt.test( text_lines[line-1] );
}

var updateCodeLineNumber = function(tab_name) {
// function that updates the code line number values
// Input:
// tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'
    var text_buffer = getTextareaBufferData(tab_name+'-window');
    var nl_number = text_buffer['size'];
    $('div.code-lines.'+tab_name+'-code').empty(); // empty div.code-lines
    for (i = 1; i <= nl_number; i++)
    $('<span>'+i+'</span>').appendTo('div.code-lines.'+tab_name+'-code');
}

var codeLineNumberManagement = function() {
// function that assigns the proper events and sub-functions to deal with code line number management
$("#html-window").keydown(function() {
updateCodeLineNumber('html');
changeTextareaSize('html');
});
$("#html-window").keyup(function() {
updateCodeLineNumber('html');
changeTextareaSize('html');
});
$("#css-window").keydown(function() {
updateCodeLineNumber('css');
changeTextareaSize('css');
});
$("#css-window").keyup(function() {
updateCodeLineNumber('css');
changeTextareaSize('css');
});
$("#js-window").keydown(function() {
updateCodeLineNumber('js');
changeTextareaSize('js');
});
$("#js-window").keyup(function() {
updateCodeLineNumber('js');
changeTextareaSize('js');
});
}

var updatePreviewWindow = function() {
// function to allows the preview window to be updated while the user is typing
    $('#html-window').keyup(function() {
    loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
    });
    $('#css-window').keyup(function() {
    loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
    });
}
var dockWindow = function() {
// function that docks the preview window to the panel
    $('#div-preview').draggable('destroy');
    $('#div-preview').removeClass().addClass('docked');
    $('#div-preview').css('top', '123px');
    $('#div-preview').css('left', '656px');
    $('#div-preview div img.dock').attr('src', './images/reducedsize.png');
    $('#html-window').css('width', '48.2%');
    $('#html-window').css('float', 'left');
    $('#html-window').css('left', '2px');
    $('#css-window').css('width', '48.2%');
    $('#css-window').css('float', 'left');
    $('#css-window').css('left', '2px');
    $('#js-window').css('width', '48.2%');
    $('#js-window').css('float', 'left');
    $('#js-window').css('left', '2px');
}
var undockWindow = function(top, left) {
// function that undocks the preview window
// Input:
    $("#div-preview").draggable({ zIndex: 2, cursor:"move", iframeFix: true, containment: "#tabs", scroll:false, stack:"#ul-toolbar" });
    $('#div-preview').removeClass().addClass('undocked');
    $('#div-preview').css({'top':top, 'left':left});
    $('#div-preview div img.dock').attr('src', './images/fullsize.png');
    $('#html-window').css('width', '96.8%');
    $('#css-window').css('width', '96.8%');
    $('#js-window').css('width', '96.8%');
}
var onClickFunctions = function() {
// function that compiles all the click event functions
// Tab clicking
    $("#a-tabs-run").click(function() {
    loadData('run-window', 'html-window'); //loads html document for preview on clicking tab run
    $("#toolbar").css("display","none"); //hides toolbar
    $("#div-preview").css("display","none"); //hides preview window
    undockWindow(wtop, wleft); // undocks preview window
    });
    $("#tabs > ul > li > a").not("#a-tabs-js").click(function() {
    $("li > #a-preview").css("display","inline"); //shows preview button
    });
    $("#tabs > ul > li > a").not("#a-tabs-run").click(function() {
    //when clicking html, css or jscript tabs show toolbar
    $("#toolbar").css("display","block");
    });
    // Reset button - toolbar
    $("#a-reset").click(function() {
    resetPanel();
    });
    // Background button - toolbar
    $("#a-bg").click(function() {
    toggleBackground();
    });
    // Preview window
    $("#a-preview").click(function() {
    // opens preview window on preview button click
    $("#div-preview").css("display", "block");
    $("#div-preview").draggable({ zIndex: 2, cursor:"move", iframeFix: true, containment: "#tabs", scroll:false, stack:"#ul-toolbar",
    create: function(event, ui) { // gets current preview window position on creation
    wleft = $("#div-preview").offset().left;
    wtop = $("#div-preview").offset().top;
    }
    });
    $('#div-preview').bind("dragstop", function(event, ui) { // gets current preview window position on dragstop
    wleft = $("#div-preview").offset().left;
    wtop = $("#div-preview").offset().top;
    });
    loadData('iframe-preview', 'html-window'); // loads the preview result
    });
    $("#div-preview div img.close").click(function() {
    // closes preview window on close button click
    $("#div-preview").css("display", "none");
    });
    $("#div-preview div img.dock").click(function() {
    // docks the window and divides the panel in two, code|preview
    if ( $("#div-preview").hasClass('undocked') )
    dockWindow();
    else
    undockWindow(wtop, wleft);
    });
    // About window
    $("#a-about").click(function() {
    // opens about window on about button click
    $("#div-about").css("display", "block");
    $( "#div-about" ).draggable({ zIndex: 2, cursor:"move", containment: "#tabs", scroll:false, stack:"#ul-toolbar" });
    });
    $("#div-about div img.close").click(function() {
    // closes about window on close button click
    $("#div-about").css("display", "none");
    });
    // New Project
    $("#a-new-project").click(function() {
    // prompts the user for a project name and starts new project
    newProject();
    });
    // Download window
    $("#a-download-project").click(function() {
    downloadProject();
    });
    $("#div-download div img.close").click(function() {
    // closes preview window on close button click
    $("#div-download").css("display", "none");
    });
}

var wleft; // preview window current left position
var wtop; // preview window current top position

// >>> Main functions

var loadData = function(frame, html, css) {
    // function that creates html document to be uploaded on iframe

    $("#" + frame).prop("contentDocument").write('<style>');
    $("#" + frame).prop("contentDocument").write($("#" + css).val());
    $("#" + frame).prop("contentDocument").write('</style></head>');
    $("#" + frame).prop("contentDocument").write($("#" + html).val());
    $("#" + frame).prop("contentDocument").write('</html>');
    $("#" + frame).prop("contentDocument").close();
}

var old = '';



function init() {
}

//window.onload = init;

function update() {

}


var resetPanel = function() {
    // function that resets the active panel, updating it with the default values

    var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
    activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel

    if (activePanel == "html")
        $("#html-window").val("<body><h2>Ebola Test</h2></body>"); //put reset code here
    // else if (activePanel == "css")
    //     $("#css-window").val("body {}");
    $('div.code-lines.' + activePanel + '-code').empty(); // empty div.code-lines
    $('<span>1</span>').appendTo('div.code-lines.' + activePanel + '-code'); // put first line number
    loadData('iframe-preview', 'html-window', 'css-window', 'js-window'); // updates the preview result
}

var toggleBackground = function() {
    // function that toggles the background of the active panel, black/white

    var activePanel = $("#tabs > div").not(".ui-tabs-hide").attr("id");
    activePanel = activePanel.slice(5, activePanel.length); // get the name of the active panel

    if ($('#' + activePanel + '-window').hasClass('black')) {
        $('#' + activePanel + '-window').removeClass('black');
        $('#' + activePanel + '-window').addClass('white');
    } else {
        $('#' + activePanel + '-window').removeClass('white');
        $('#' + activePanel + '-window').addClass('black');
    }
}

var changeTextareaSize = function(tab_name) {
    // function that increases or decreases the textarea according with content size
    // Input:
    // tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'

    var text_buffer = getTextareaBufferData(tab_name + '-window');
    var textarea_rows = $('#' + tab_name + '-window').prop('rows');

    //checks if the number of code lines is greater than the size of textarea,
    // if so, increases that textarea and the line number div
    if (text_buffer['size'] > textarea_rows) {
        $('#' + tab_name + '-window').prop('rows', function(index, value) {
            return value + 1;
        });
        $('div.code-lines.' + tab_name + '-code').height(function() {
            return $('#' + tab_name + '-window').height() + 3;
        });
        $('#tabs-' + tab_name).scrollTop(function(index, value) {
            return value + 15;
        });
    }

    //checks if the number of code lines is greater than the default size of textarea
    // but smaller than the actual textarea size, if so, decreases that textarea and the line number div
    if (text_buffer['size'] > 38 && text_buffer['size'] < textarea_rows) {
        $('#' + tab_name + '-window').prop('rows', function(index, value) {
            return value - 1;
        });
        $('div.code-lines.' + tab_name + '-code').height(function() {
            return $('#' + tab_name + '-window').height() + 3;
        });
        $('#tabs-' + tab_name).scrollTop(function(index, value) {
            return value + 15;
        });
    }
    if (text_buffer['size'] <= 38) // sets scroll bar to top
        $('#tabs-' + tab_name).scrollTop(0);
}

var getTextareaBufferData = function(id_name) {
    var buffer = {};
    var text_str = '';
    var text_lines = [];
    var size = 0;

    text_str = $('#' + id_name).val(); // takes the textarea content given id
    text_lines = text_str.split('\n'); // create list of text lines
    size = text_lines.length;

    // update buffer
    buffer['size'] = size;
    buffer['content'] = text_lines;

    return buffer;
}

var checkForEmptyLine = function(text_lines, line) {
    // function that checks for an empty text line
    // Input:
    // text_lines -> list of text lines content
    // line -> line chosen to check if it's empty
    // Output:
    // ...(Boolean) -> returns a true for empty line and false otherwise


    var patt = /[^\s]/; // pattern for non_empty line
    return !patt.test(text_lines[line - 1]);
}


// // Preview window
$(document).ready(function() {
    $("#div-preview").css("display", "block");
});

var updateCodeLineNumber = function(tab_name) {
    // function that updates the code line number values
    // Input:
    // tab_name -> the name of the tab being edited. Possible values 'html', 'css' or 'js'

    var text_buffer = getTextareaBufferData(tab_name + '-window');
    var nl_number = text_buffer['size'];

    $('div.code-lines.' + tab_name + '-code').empty(); // empty div.code-lines
    for (i = 1; i <= nl_number; i++)
        $('<span>' + i + '</span>').appendTo('div.code-lines.' + tab_name + '-code');
}

var codeLineNumberManagement = function() {
    // function that assigns the proper events and sub-functions to deal with code line number management

    $("#html-window").keydown(function() {
        updateCodeLineNumber('html');
        changeTextareaSize('html');
    });
    $("#html-window").keyup(function() {
        updateCodeLineNumber('html');
        changeTextareaSize('html');
    });
    // $("#html-window").keyup(function() {
    //     console.log('HTML window keyup');
    // });
}

var updatePreviewWindow = function() {
    // function to allows the preview window to be updated while the user is typing

    $('#html-window').keyup(function() {
        loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
    });
    $('#css-window').keyup(function() {
        loadData('iframe-preview', 'html-window', 'css-window', 'js-window');
    });
}

var onClickFunctions = function() {
    // function that compiles all the click event functions

    // Tab clicking
    $("#a-tabs-run").click(function() {
        loadData('run-window', 'html-window'); //loads html document for preview on clicking tab run
        $("#toolbar").css("display", "none"); //hides toolbar
        // $("#div-preview").css("display","none"); //hides preview window
        // undockWindow(wtop, wleft); // undocks preview window
    });

    $("#tabs > ul > li > a").not("#a-tabs-js").click(function() {
        $("li > #a-preview").css("display", "inline"); //shows preview button
    });

    $("#tabs > ul > li > a").not("#a-tabs-run").click(function() {
        //when clicking html, css or jscript tabs show toolbar
        $("#toolbar").css("display", "block");
    });

    // Reset button - toolbar
    $("#a-reset").click(function() {
        resetPanel();
    });

    // Background button - toolbar
    $("#a-bg").click(function() {
        toggleBackground();
    });

    // About window
    $("#a-about").click(function() {
        // opens about window on about button click
        $("#div-about").css("display", "block");
        $("#div-about").draggable({
            zIndex: 2,
            cursor: "move",
            containment: "#tabs",
            scroll: false,
            stack: "#ul-toolbar"
        });
    });

    $("#div-about div img.close").click(function() {
        // closes about window on close button click
        $("#div-about").css("display", "none");
    });

    // New Project
    $("#a-new-project").click(function() {
        // prompts the user for a project name and starts new project
        newProject();
    });

    // Download window
    $("#a-download-project").click(function() {
        downloadProject();
    });

    $("#div-download div img.close").click(function() {
        // closes preview window on close button click
        $("#div-download").css("display", "none");
    });
}

$(document).ready(function() {
    onClickFunctions();
    codeLineNumberManagement();
    updatePreviewWindow();
    update();
    loadData('iframe-preview', 'html-window');

});

var index = 0;

function changeTask() {
    var qArray = ["Change the h2 (main heading/title)?",
        "Add your own picture as a background image?",
        "Write your own paragraph?",
        "Change figures based on your own research."
    ];
    if (index > (qArray.length - 1)) {
        document.getElementById('task').innerHTML = 'Well done!';
    } else {
        document.getElementById('task').innerHTML = qArray[index];
        index++;
    }
}

    var get_h2 = '';
    var get_h3 = '';
    var get_impact_figure = '';
    var original;
    var figure = '';
    var get_html_window = '';
    var storage = '';

$(document).on('ready', function(){
    $("#h3_annotation").hide();
    $("#impact_figure").hide();
    $("#paragraph").hide();
    var code = $("#iframe-preview").contents().find("h2");
    code.css("background-color","pink") && $("#h2_annotation").show(2000);
    get_h2 = $("#iframe-preview").contents().find('#ns_title').text();
    get_h3 = $("#iframe-preview").contents().find('.ns_subtitle').text();
    get_impact_figure = $("#iframe-preview").contents().find('.ns_super_impact__fig').text();
    get_pragraph = $("#iframe-preview").contents().find('.pragraph').text();
    original = {h2: get_h2, h3: get_h3, figure: get_impact_figure, paragraph: get_pragraph};
    get_html_window = $('#html-window').contents().text();

});

// function operacion(){
//                         get_html_window = $('#html-window').contents().text();

//                 }

// var code = $("#iframe-preview").contents().find("h3");
$(document).on('keyup', function(){
     get_h2 = $("#iframe-preview").contents().find('#ns_title').text();
     // localStorage.setItem("savedDataPic", get_html_window);
     // console.log(localStorage);

    setTimeout(function(){
        if (original.h2 === $("#iframe-preview").contents().find('#ns_title').text()) {
        console.log('match ' + 'original:' + original.h2 + 'new:' + $("#iframe-preview").contents().find('.ns_title').text());
        }
        else {
            get_h3 = $("#iframe-preview").contents().find('.ns_subtitle');
            //console.log(original.h3);
            // figure = $("#iframe-preview").contents().find(".ns_impact__fig");
            get_h3.css("background-color","pink", 2000) && $('#h3_annotation').show(2000) && $("#h2_annotation").hide() && $("#paragraph").hide();
        console.log('dont match ' + 'original:' + original.h2 + 'new:' + $("#iframe-preview").contents().find('.ns_title').text());
        }
    }, 5000);

    setTimeout(function(){
        if (original.h3 === $("#iframe-preview").contents().find('.ns_subtitle').text()) {
        console.log('match ' + 'original:' + original.h3 + 'new:' + $("#iframe-preview").contents().find('.ns_subtitle').text());
        }
        else {
            get_impact_figure = $("#iframe-preview").contents().find('.ns_super_impact__fig');
            // console.log(original.figure);
            // figure = $("#iframe-preview").contents().find(".ns_impact__fig");
            get_h3.css("background-color","transparent") && get_impact_figure.css("background-color","pink", 2000) && $('#impact_figure').show(2000) && $("#h2_annotation").hide() && $("#h3_annotation").hide() && $("#paragraph").hide();
        console.log('dont match ' + 'original:' + original.h3 + 'new:' + $("#iframe-preview").contents().find('.ns_subtitle').text());
        }
    }, 5000);

    setTimeout(function(){
        if (original.figure === $("#iframe-preview").contents().find('.ns_super_impact__fig').text()) {
        console.log('match ' + 'original:' + original.figure + 'new:' + $("#iframe-preview").contents().find('.ns_super_impact__fig').text());
        }
        else {
            get_pragraph = $("#iframe-preview").contents().find('.pragraph');
            // console.log(original.figure);
            // figure = $("#iframe-preview").contents().find(".ns_impact__fig");
            get_impact_figure.css("background-color","transparent") && get_pragraph.css("background-color","pink", 2000) && $('#paragraph').show(2000) && $("#h2_annotation").hide() && $("#h3_annotation").hide() && $("#impact_figure").hide();
        console.log('dont match ' + 'original:' + original.figure + 'new:' + $("#iframe-preview").contents().find('.ns_super_impact__fig').text());
        }
    }, 5000);


});

var targetFunction = function () {
    alert("test");

};

//This opens the iframe in a new Browser Window
var takeScreenshot = function () {

    var newIframe = document.createElement('iframe');
    var y = (newIframe.contentWindow || newIframe.contentDocument);
    var iframeCopy = document.getElementById('html-window').value;
    var newWindow = window.open('');
    newWindow.document.body.appendChild(newIframe);
    newWindow.document.write(iframeCopy);
    newWindow.alert('Take a screenshot by pressing the following keys:\nCtr + Alt + Prt Scr (on a PC)\ncmd + shift + 3 (on a Mac)\nThen use file preview to crop and save your data pic.');
    newWindow.document.close();

};

var setUpUITabs = function () {

$(function() {
    $("#tabs").tabs().find(".ui-tabs-nav").sortable({
        axis: "x"
    });
});
};

var setUpDataPicHTMLClipboard = function () {
    var client = new ZeroClipboard( document.getElementById("d_clip_button") );
    client.on( "ready", function( readyEvent ) {
      client.on( "copy", function (e) {
        var htmlString = document.getElementById('html-window').value;
        ZeroClipboard.setData("text/plain", htmlString);
      });
    } );
};

setUpDataPicHTMLClipboard();
setUpUITabs();
HidePreviewWindowAnnotations();
loadData();
resetPanel();
toggleBackground();
changeTextareaSize();
getTextareaBufferData();
checkForEmptyLine();
updateCodeLineNumber();
takeScreenshot();
onClickFunctions();












