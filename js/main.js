var am_hor = "1";
var am_vert = "1";
var hlink = "";
var title = "";
var tileresx = 0;
var tileresy = 0;
var resx = 0;
var resy = 0;
var leftcrop = 0;
var topcrop = 0;
var widthcrop = 0;
var heightcrop = 0;
var imgAmount = 0;
var lastPressed = 0;
var ratio = 0;
var imgParts = [];
var imageSelected = false;
var temp = new Image();
var image = new Image();

/*
 * Libraries used: Jquery, JSZip, Filesaver.js
 *
 *
 */

$(document).ready(function() {
  //show modal
  $(".main-img").click(function() {
    $("#myModal").css("display", "block");
  });
  //close modal with x
  $(".close").click(function() {
    $("#myModal, #tip").css("display", "none");
  });

  //close modal outside popup-content
  $("#myModal, #tip").on("click", function(e) {
    if (e.target == this) {
      $("#myModal, #tip").fadeOut("fast");
    }
  });

  $("#file").change(function(e) {
    temp.src = URL.createObjectURL(e.target.files[0]);
  });

  //handle load button button click
  $("#loadbtn").click(function() {
    if ($("#file").val() == '') {
      imageSelected = true;
      hlink = $("input[name='usrurl']").val();
      loadImg(hlink, null, ".main-img");
    }
    if ($("input[name='usrurl']").val() == '') {
      imageSelected = true;
      hlink = $("#file").val();
      loadImg(hlink, temp, ".main-img");
    }
    $("#myModal").fadeOut("fast");
  });
  //load settings for each website functionality
  $(".methodbtn").click(function(e) {
    if (e.currentTarget.id == "tileimg" && lastPressed != 0) {
      lastPressed = 0;
      $(".settings-category").fadeOut(300).promise().done(function() {
        $(".imgtilelayout").fadeIn(400);
        $(".imgtilesize").fadeIn(400);
      });
    }
    if (e.currentTarget.id == "reszimg" && lastPressed != 1) {
      lastPressed = 1;
      $(".settings-category").fadeOut(300).promise().done(function() {
        $(".imgresolution").fadeIn(400);
      });
    }
    if (e.currentTarget.id == "cropimg" && lastPressed != 2) {
      lastPressed = 2;
      $(".settings-category").fadeOut(300).promise().done(function() {
        $(".imgcrop").fadeIn(400);
      });
    }
  });
  //TODO don't allow input greater than 32
  //keep both input boxes equal if checkbox is checked
  $("input[name=amount_hor], input[name=amount_vert]").keyup(function() {
    //check if keepql is set
    if ($("#keepeql").is(':checked')) {
      //change text input based on which is currently i n focus
      if ($("input[name=amount_hor]").is(':focus')) {
        $("input[name=amount_vert]").val($("input[name=amount_hor]").val());
      } else {
        $("input[name=amount_hor]").val($("input[name=amount_vert]").val());
      }
    }
    //keep slider the same as input text
    $("input[name=rangeInput_hor]").val($("input[name=amount_hor]").val());
    $("input[name=rangeInput_vert]").val($("input[name=amount_vert]").val());
  });
  //keep input range slider and text input the same
  $("input[name=rangeInput_hor]").on('input', function() {
    $("input[name=amount_hor]").val($("input[name=rangeInput_hor]").val());
    if ($("#keepeql").is(':checked')) {
      $("input[name=amount_vert]").val($("input[name=amount_hor]").val());
      $("input[name=rangeInput_hor]").val($("input[name=amount_hor]").val());
      $("input[name=rangeInput_vert]").val($("input[name=amount_vert]").val());
    }
  });
  //keep input range slider and text input the same
  $("input[name=rangeInput_vert]").on('input', function() {
    $("input[name=amount_vert").val($("input[name=rangeInput_vert]").val());
    if ($("#keepeql").is(':checked')) {
      $("input[name=amount_hor]").val($("input[name=amount_vert]").val());
      $("input[name=rangeInput_hor]").val($("input[name=amount_hor]").val());
      $("input[name=rangeInput_vert]").val($("input[name=amount_vert]").val());
    }
  });

  //calculate and set width or height of textfield if keepasp2 is checked for resizeImg
  $("input[name=tileresx], input[name=tileresy]").keyup(function() {
    if ($("#keepasp1").is(':checked')) {
      if ($("input[name=tileresx]").is(':focus')) {
        //height = width / ratio;
        $("input[name=tileresy]").val(Math.round(($("input[name=tileresx]").val() / ratio) * 1) / 1);
      }
      if ($("input[name=tileresy]").is(':focus')) {
        //width = height * ratio;;
        $("input[name=tileresx]").val(Math.round(($("input[name=tileresy]").val() * ratio) * 1) / 1);
      }
    }
  });

  //The same for imgTile and keepasp1
  $("input[name=resx], input[name=resy]").keyup(function() {
    if ($("#keepasp2").is(':checked')) {
      if ($("input[name=resx]").is(':focus')) {
        //height = width / ratio;
        $("input[name=resy]").val(Math.round(($("input[name=resx]").val() / ratio) * 1) / 1);
      }
      if ($("input[name=resy]").is(':focus')) {
        //width = height * ratio;;
        $("input[name=resx]").val(Math.round(($("input[name=resy]").val() * ratio) * 1) / 1);
      }
    }
  });

  //handle Download button click based on settings
  $("#downloadbtn").click(function() {
    updateSettings();
    if (imageSelected == true) {
      if (lastPressed == 0) {
        //lastPressed == 1 cut image
        cutImg(image);
      }
      if (lastPressed == 1) {
        //lastPressed == 2 resize image
        resizeImg(image);
      }
      if (lastPressed == 2) {
        //lastPressed == 3 crop image
        cropImg(image);
      }
    } else {
      $("#tip").fadeIn("fast");
    }
  });
});
//load image from modal to main-img div
function loadImg(path, img, target) {
  //image from URI
  if (img == null) {
    //image.src = path + '?' + new Date().getTime();
    //image.setAttribute('crossOrigin', '');
    image.crossOrigin = "anonymous";
    image.src = path;
    $(target).html('<img src="' + path + '">');
    $(target).children("img").attr("width", "100%");
    $(target).children("img").attr("height", "auto");
  } else {
    image.src = img.src;
    $(target).append(temp);
    $(target).children(temp).attr("width", "100%");
    $(target).children(temp).attr("height", "auto");
  }
  changeTitle(path);
  updateSettings();
}
//TODO
//draw grid on canvasd image based on params
function drawGrid(canvas) {

}
//cut image in set pieces
function cutImg(img, width, height) {
  if (am_hor <= 0 || am_vert <= 0) {
    am_hor = 1;
    am_vert = 1;
  }
  //create tiles
  for (j = 0; j <= am_hor; j++) {
    for (i = 0; i <= am_vert; i++) {
      canvas = document.createElement('canvas');
      //canvas resolution = image resolution
      canvas.width = img.width / (am_hor * 1 + 1);
      canvas.height = img.height / (am_vert * 1 + 1);
      canvas.getContext('2d').drawImage(image, i * canvas.width, j * canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      //yep
      imgParts.push(fetch(canvas.toDataURL()).then(res => res.blob()));
    }
  }
  zipIt(imgParts);
}
//resize image based on given width and height
//TODO proportional resizing
function resizeImg(image) {
  canvas = document.createElement('canvas');
  canvas.width = resx;
  canvas.height = resy;
  canvas.getContext("2d").drawImage(image, 0, 0, resx, resy);
  //canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height, 0,0, resx, resy);
  canvas.toBlob(function(blob) {
    saveAs(blob, title + ".png");
  });
}
//TODO
//crop image based on params
function cropImg(image) {
  canvas = document.createElement('canvas');
  canvas.width = widthcrop;
  canvas.height = heightcrop;
  canvas.getContext("2d").drawImage(image, leftcrop, topcrop, widthcrop, heightcrop, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(function(blob) {
    saveAs(blob, title + ".png");
  });
}

//get settings
function updateSettings() {
  //update title
  title = $(".main-title").children("h3").text();

  //aspect ratio
  ratio = image.width / image.height;

  //for image tiles
  am_hor = $("input[name='amount_hor']").val();
  am_vert = $("input[name='amount_vert']").val();
  tileresx = $("input[name='tileresx']").val();
  tileresy = $("input[name='tileresy']").val();
  //for resizing image
  resx = $("input[name='resx']").val();
  resy = $("input[name='resy']").val();
  //for cropping image
  leftcrop = $("input[name='leftcrop']").val();
  topcrop = $("input[name='topcrop']").val();
  widthcrop = $("input[name='widthcrop']").val();
  heightcrop = $("input[name='heightcrop']").val();
}
//change title of div .main-title
function changeTitle(str) {
  $(".main-title").html(function() {
    let title = str.split("\\");
    title = title[title.length - 1].split("\/");
    title = title[title.length - 1].split("\.");
    return "<h3>" + title[0] + " </h3>";
  });
}
//create zip file for all elements
function zipIt(imgArray) {
  zip = new JSZip();
  //zip.file("nested/hello.txt", "Hello World\n");

  for (i = 0; i < imgArray.length; i++) {
    zip.folder("test").file(title + "_" + i + ".png", imgArray[i], {
      binary: true
    });
  }
  zip.generateAsync({
      type: "blob"
    })
    .then(function(blob) {
      saveAs(blob, title + "[imagemanager].zip");
    });
}
